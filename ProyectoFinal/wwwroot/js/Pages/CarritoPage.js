$(document).ready(async function () {
    await obtenerCarrito();
});

async function obtenerCarrito() {
    try {
        let productosCantidad = await Carrito.obtenerProductosCarrito();

        // Generar la grilla de productos
        generarGrilla(productosCantidad);

    }
    catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
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

            const tr = document.createElement('tr');
            tr.setAttribute('data-index', productoCantidad.Id); // Asignar el Id como atributo de la fila
            tr.innerHTML = `
                <td>${producto.Foto ? `<img src="${producto.Foto}" alt="${producto.Nombre}" class="img-thumbnail" style="width: 50px; height: 50px;">` : 'Sin imagen'}</td>
                <td>${producto.Nombre}</td>
                <td>$${producto.Precio.toFixed(2)}</td>
                <td>${cantidad}</td>
                <td><input type="text" class="form-control comentario-input" placeholder="Comentario"></td>
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
        if (event.target.closest('.btn-eliminar-producto')) {
            const index = event.target.closest('.btn-eliminar-producto').getAttribute('data-index');
            await eliminarLineaPorId(index);
        }
    });

    // Añadir el event listener para el botón Pedir
    document.getElementById('btnPedir').addEventListener('click', function () {
        alert('Pedido realizado!');
        // Aquí puedes agregar la lógica para procesar el pedido
    });
}


async function eliminarLineaPorId(id) {
    try {
        await Carrito.EliminarLinea(id);

        let productosCantidad = await Carrito.obtenerProductosCarrito();
        generarGrilla(productosCantidad);

    } catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
    }
}


