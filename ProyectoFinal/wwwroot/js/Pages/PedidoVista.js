let _idPedido;

$(document).ready(async function () {
    // Código a ejecutar cuando el DOM esté listo
    await cargarPedido();

});

async function cargarPedido() {
    try {
        const parts = window.location.pathname.split('/');
        const id = parts.pop();

        _idPedido = id;
        let pedido = await Pedido.getPedido(id);

        if (pedido == null) {
            return;
        }

        const nombre = document.getElementById('nombreCliente');
        const direccion = document.getElementById('direccionCliente');
        const mesa = document.getElementById('mesaCliente');
        const tel = document.getElementById('telefonoCliente');        
        const metodoPago = document.getElementById('metodoPago');
        const comentario = document.getElementById('comentarioPedido');
        const listaProd = document.getElementById('divProdList');

        nombre.innerText = pedido.Nombre;
        direccion.innerText = pedido.Direccion;
        mesa.innerText = pedido.Mesa;
        tel.innerText = pedido.Telefono;
        pedido.Pos ? metodoPago.innerText = "POS" : metodoPago.innerText = "Efectivo"
        comentario.innerText = pedido.Comentario;

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

        //let total = 0;
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

            //total += totalProducto;
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
        console.error('Error:', ex.message);
        throw ex;
    }
}