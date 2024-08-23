    let _idPedido;

$(document).ready(async function () {
    showLoader();
    // Código a ejecutar cuando el DOM esté listo
    await cargarPedido();

    hideLoader();
});

async function cargarPedido() {
    try {
        const parts = window.location.pathname.split('/');
        const id = parts.pop();

        _idPedido = id;
        let pedido = await Pedido.getPedido(id);

        if (pedido == null) {
            Tools.Toast('Error buscando el pedido.', 'warning');
            return;
        }

        const fecha = document.getElementById('fechaPedido');
        const direccion = document.getElementById('direccionCliente');
        const divDireccion = document.getElementById('divDireccion');
        const mesa = document.getElementById('mesaCliente');
        const divMesa = document.getElementById('divMesa');
        const metodoPago = document.getElementById('metodoPago');
        const estado = document.getElementById('estadoPedido');
        const comentario = document.getElementById('comentarioPedido');
        const listaProd = document.getElementById('divProdList');

        // Formatear la fecha
        const date = new Date(pedido.Fecha);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        fecha.innerText = formattedDate;

        direccion.innerText = pedido.Direccion;
        mesa.innerText = "" + pedido.IdMesa;
        pedido.Pos ? metodoPago.innerText = "POS" : metodoPago.innerText = "Efectivo";
        estado.innerText = pedido.Estado;
        comentario.innerText = pedido.Comentario;

        if (pedido.IdMesa == 0) {
            divDireccion.style.display = "block";
        } else {
            divMesa.style.display = "block";
        }

        // Crear la tabla
        const table = document.createElement('table');
        table.className = 'table table-striped';

        // Crear la cabecera de la tabla
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['', 'Nombre', 'Cantidad', 'Precio', 'Comentario', 'Total Producto'].forEach(text => {
            const th = document.createElement('th');
            th.innerText = text;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Crear el cuerpo de la tabla
        const tbody = document.createElement('tbody');

        pedido.Carrito.ProductosCantidad.forEach(producto => {
            const row = document.createElement('tr');

            const cellFoto = document.createElement('td');
            const img = document.createElement('img');
            img.src = producto.Producto.Foto || 'default.jpg';
            img.alt = producto.Producto.Nombre;
            img.width = 50;
            img.height = 50;
            cellFoto.appendChild(img);

            const cellNombre = document.createElement('td');
            cellNombre.innerText = producto.Producto.Nombre;

            const cellCantidad = document.createElement('td');
            cellCantidad.innerText = producto.Cantidad;

            const cellPrecio = document.createElement('td');
            cellPrecio.innerText = producto.Producto.Precio.toFixed(2);

            const cellComentario = document.createElement('td');
            cellComentario.innerText = producto.Comentario || ' - ';

            const cellTotalProducto = document.createElement('td');
            const totalProducto = producto.Cantidad * producto.Producto.Precio;
            cellTotalProducto.innerText = totalProducto.toFixed(2);

            row.appendChild(cellFoto);
            row.appendChild(cellNombre);
            row.appendChild(cellCantidad);
            row.appendChild(cellPrecio);
            row.appendChild(cellComentario);
            row.appendChild(cellTotalProducto);

            tbody.appendChild(row);
        });

        // Agregar fila para el total
        const totalRow = document.createElement('tr');
        const totalCell = document.createElement('td');
        totalCell.setAttribute('colspan', '5');
        totalCell.innerHTML = '<strong>Total</strong>';
        const totalValueCell = document.createElement('td');
        totalValueCell.innerHTML = '<strong>' + pedido.Carrito.PrecioTotal.toFixed(2) + '</strong>';
        totalRow.appendChild(totalCell);
        totalRow.appendChild(totalValueCell);
        tbody.appendChild(totalRow);

        table.appendChild(tbody);

        // Añadir la tabla al divProdList
        listaProd.innerHTML = ''; // Limpiar cualquier contenido previo
        listaProd.appendChild(table);

    } catch (ex) {
        await handleError(ex);
        Tools.Toast('Error inesperado, contacte al administrador', 'error');
    }
}
