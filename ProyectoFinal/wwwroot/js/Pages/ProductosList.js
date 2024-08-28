$(document).ready(async function () {
    showLoader();
    //Mostrar toaster si entramos luego de eliminar producto
    const toastMessage = localStorage.getItem('toastMessage');
    const toastType = localStorage.getItem('toastType');
    if (toastMessage && toastType) {
        // Mostrar el toaster
        Tools.Toast(toastMessage, toastType);

        // Limpiar el almacenamiento local
        localStorage.removeItem('toastMessage');
        localStorage.removeItem('toastType');
    }
    
    // Código a ejecutar cuando el DOM esté listo
    await obtenerProductos();

    hideLoader();
});


async function obtenerProductos() {
    try {
        let productos = await Producto.getProductosList();
        if (productos.status == 500) {
            Tools.Toast('Error inesperado, contacte al administrador', 'error');
            return;
        }


        let tiposProd = await TipoProducto.getTiposProducto();
        if (tiposProd.status == 500) {
            Tools.Toast('Error inesperado, contacte al administrador', 'error');
            return;
        }

        const container = document.getElementById('tblProductos');
        container.innerHTML = '';

        tiposProd.forEach(tipo => {
            const productosPorTipo = productos.filter(p => p.IdTipoProducto === tipo.Id);
            if (productosPorTipo.length > 0) {

                const groupContainer = document.createElement('div');
                groupContainer.innerHTML = `<h2>${tipo.Descripcion}</h2>`;

                const table = document.createElement('table');
                table.className = 'table';

                const thead = document.createElement('thead');
                thead.innerHTML = `
                    <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Acciones</th>
                    </tr>
                                        `;
                table.appendChild(thead);

                const tbody = document.createElement('tbody');


                productosPorTipo.forEach(producto => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                    <td>${producto.Nombre}</td>
                    <td>$${producto.Precio}</td>
                    <td>
                    <button class="btn btn-warning" onclick="vistaEditarProducto(${producto.Id})">Editar</button>
                    <button class="btn btn-danger" onclick="eliminarProducto(${producto.Id})">Eliminar</button>
                    </td>
                    <td>
                    <label for="activo-${producto.Id}">Activo</label>
                    <input type="checkbox" ${producto.Activo ? 'checked' : ''} id="activo-${producto.Id}" onchange="activarDesactivar(${producto.Id}, '${producto.Nombre}', this.checked);">
                    </td>
                        `;
                    tbody.appendChild(tr);
                });


                table.appendChild(tbody);
                groupContainer.appendChild(table);
                container.appendChild(groupContainer);
            }
        });

    } catch (ex) {
        throw ex;
    }
}

async function activarDesactivar(productId, prodNombre, isActive) {
    try {

        let res = await Producto.UpdateActivo(productId, isActive);

        if (res.status == 200) {
            let mensaje = "";
            if (!isActive) {
                mensaje = prodNombre + ' desactivado con exito';
            } else {
                mensaje = prodNombre + ' activado con exito';
            }

            Tools.Toast(mensaje, 'success');

        } else if (res.status == 500) {
            Tools.Toast('Error inesperado, contacte al administrador', 'error');

        } else if (res.status == 404) {
            Tools.Toast("Producto no existe.", 'warning');
        }        

    } catch (ex) {
        throw ex;
    }
}

async function eliminarProducto(productId) {
    try {
        let confirmacion = await asyncConfirm(`¿Estás seguro de que deseas eliminar el producto?`);

        if (confirmacion) {
            // Lógica para eliminar el elemento
            let res = await Producto.UpdateEliminar(productId);

            if (res.status == 200) {
                showLoader();
                await obtenerProductos();
                hideLoader();
                Tools.Toast('Producto eliminado con exito', 'success');

            } else if (res.status == 500) {
                Tools.Toast('Error inesperado, contacte al administrador', 'error');

            } else if (res.status == 404) {
                Tools.Toast("Producto no existe.", 'warning');
            }
        }

    } catch (ex) {
        await handleError(ex);
        Tools.Toast('Error inesperado, contacte al administrador', 'error');
    }
}

async function vistaEditarProducto(id) {
    try {

        let redirectUrl = $("#URLGetProductoVista").val();
        const urlWithId = `${redirectUrl}/${id}`;
        window.location.href = urlWithId;

    } catch (ex) {
        await handleError(ex);
        Tools.Toast('Error inesperado, contacte al administrador', 'error');
    }
}