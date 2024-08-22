$(document).ready(async function () {
    await obtenerCarrito();
});

async function obtenerCarrito() {
    try {
        showLoader();

        let productosCantidad = [];

        if (sessionStorage.getItem('Logueado') == "true") {
            productosCantidad = await Carrito.obtenerProductosCarrito();

            if (productosCantidad.status == 400) {
                const msj = await res.text();
                Tools.Toast(msj, 'warning');
                return;

            } else if (productosCantidad.status == 500) {
                Tools.Toast("Error inesperado, contacte a su administrador", 'error');
                return;
            }

        }
        else {
            productosCantidad = JSON.parse(localStorage.getItem('carrito'));
        }

        // Generar la grilla de productos
        generarGrilla(productosCantidad);

        hideLoader();
    }
    catch (ex) {
        Tools.Toast("Error inesperado, contacte a su administrador", 'error');
    }
}

function generarGrilla(productosCantidad) {
    const container = document.getElementById('divProdList');
    container.innerHTML = ''; // Limpiar el contenedor

    const table = document.createElement('table');
    table.className = 'table';

    // Crear el encabezado de la tabla
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th></th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Comentario</th>
            <th>Total</th>
            <th></th>
        </tr>
    `;
    table.appendChild(thead);

    // Crear el cuerpo de la tabla
    const tbody = document.createElement('tbody');

    let sumaTotal = 0;

    productosCantidad.forEach(productoCantidad => {
        const producto = productoCantidad.Producto;
        if (producto) {
            const cantidad = productoCantidad.Cantidad;
            const total = producto.Precio * cantidad;
            sumaTotal += total;

            const comentario = productoCantidad.Comentario || '';

            const tr = document.createElement('tr');
            tr.setAttribute('data-index', productoCantidad.Id); // Asignar el Id como atributo de la fila
            tr.innerHTML = `
                <td>${producto.Foto ? `<img src="${producto.Foto}" alt="${producto.Nombre}" class="img-thumbnail" style="width: 50px; height: 50px;">` : 'Sin imagen'}</td>
                <td>${producto.Nombre}</td>
                <td>$${producto.Precio.toFixed(2)}</td>
                <td>${cantidad}</td>
                <td><input type="text" class="form-control comentario-input" value="${comentario}" placeholder="Comentario"></td>
                <td>$${total.toFixed(2)}</td>
                <td><button class="btn btn-link btn-eliminar-producto" data-index="${productoCantidad.Id}"><i class="fa-solid fa-trash"></i></button></td>
            `;
            tbody.appendChild(tr);
        }
    });

    // Crear la fila del total
    const totalRow = document.createElement('tr');
    totalRow.innerHTML = `
        <td colspan="5"></td>
        <td><strong>Total:</strong></td>
        <td><strong>$${sumaTotal.toFixed(2)}</strong></td>
    `;
    tbody.appendChild(totalRow);

    // Crear la fila del botón Pedir
    const pedirRow = document.createElement('tr');
    pedirRow.innerHTML = `
          <td colspan="12">
            <div class="text-right text-md-right">
                <button id="btnPedir" class="btn btn-primary w-100 w-md-auto">Pedir</button>
            </div>
        </td>
    `;
    tbody.appendChild(pedirRow);

    table.appendChild(tbody);
    container.appendChild(table);

    // Añadir el event listener para el botón de eliminar
    document.getElementById('divProdList').addEventListener('click', async function (event) {
        showLoader();
        if (event.target.closest('.btn-eliminar-producto')) {
            const index = event.target.closest('.btn-eliminar-producto').getAttribute('data-index');

            if (sessionStorage.getItem('Logueado') == "true") {
                await eliminarLineaPorId(index);
            } else {
                eliminarLineaSinLogin(index);
            }
        }
        hideLoader();
    });

    // Añadir el event listener para el botón Pedir
    document.getElementById('btnPedir').addEventListener('click', async function () {
        showLoader();
        const duplas = [];

        // Recorrer todas las filas del cuerpo de la tabla
        const rows = document.querySelectorAll('#divProdList tbody tr');
        rows.forEach(row => {
            const comentarioInput = row.querySelector('.comentario-input');
            const comentario = comentarioInput ? comentarioInput.value : "";
            const id = row.getAttribute('data-index');

            if (id) {
                duplas.push({ Id: id, Comentario: comentario });
            }
        });

        if (duplas.length == 0) {
            Tools.Toast('Carrito vacío', 'warning');
        } else {

            try {

                if (sessionStorage.getItem('Logueado') == "true") {

                    // Llamar a la función para agregar los comentarios en masa
                    const res = await ProductoCantidad.AgregarComentariosMasivo(duplas);

                    if (res.status == 200) {
                        // Obtiene la URL desde el campo oculto
                        const urlPedidoLogueado = document.getElementById('URLPedidoLogueado').value;

                        // Redirige a la vista PedidoLogueado del controlador Pedido
                        window.location.href = urlPedidoLogueado;
                    }
                    if (res.status == 500) {
                        Tools.Toast("Error inesperado, contacte a su administrador", 'error');
                    }
                    if (res.status == 400) {
                        const msj = res.text();
                        Tools.Toast(msj, 'warning');
                    }


                } else {

                    // Obtener el carrito del localStorage
                    let carrito = JSON.parse(localStorage.getItem('carrito'));
                    if (!carrito) carrito = [];

                    // Actualizar los comentarios en el carrito
                    duplas.forEach(dupla => {
                        const productoCantidad = carrito.find(item => item.Id == dupla.Id);
                        if (productoCantidad) {
                            productoCantidad.Comentario = dupla.Comentario;
                        }
                    });

                    // Guardar el carrito actualizado en el localStorage
                    localStorage.setItem('carrito', JSON.stringify(carrito));

                    // Obtiene la URL desde el campo oculto
                    const urlPedidoLogueado = document.getElementById('URLPedidoExpress').value;

                    // Redirige a la vista PedidoLogueado del controlador Pedido
                    window.location.href = urlPedidoLogueado;
                }

                hideLoader();

            } catch (ex) {
                throw ex;
            }
        }
    });
}


async function eliminarLineaPorId(id) {
    try {
        showLoader();

        const res = await Carrito.EliminarLinea(id);

        if (res.status == 200) {
            let productosCantidad = await Carrito.obtenerProductosCarrito();
            if (productosCantidad.status == 400) {
                const msj = await res.text();
                Tools.Toast(msj, 'warning');
                return;

            } else if (productosCantidad.status == 500) {
                Tools.Toast("Error inesperado, contacte a su administrador", 'error');
                return;
            }
            generarGrilla(productosCantidad);
        }

        if (res.status == 400 || res.status == 404) {
            const msj = await res.text();
            Tools.Toast(msj, 'warning');
        }
        if (res.status == 500) {
            Tools.Toast("Error inesperado, contacte a su administrador", 'error');
        }

        hideLoader();

    } catch (ex) {
        throw ex;
    }
}

function eliminarLineaSinLogin(index) {
    try {
        showLoader();
        // Obtener el carrito del localStorage
        let carrito = JSON.parse(localStorage.getItem('carrito'));
        if (!carrito) carrito = [];

        // Filtrar el carrito para excluir el producto con el Id específico
        carrito = carrito.filter(item => item.Id != index);

        // Guardar el carrito actualizado en el localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));

        // Volver a generar la grilla para reflejar los cambios
        generarGrilla(carrito);

        hideLoader();

    } catch (ex) {
        throw ex;
    }

}


