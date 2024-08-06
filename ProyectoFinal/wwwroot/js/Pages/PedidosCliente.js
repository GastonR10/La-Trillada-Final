

$(document).ready(async function () {
    showLoader();
    await obtenerPedidosCliente();
    hideLoader();
});

async function obtenerPedidosCliente() {
    try {

        let pedidosCliente = await Pedido.GetPedidosCliente();

        grillaPedidosCliente(pedidosCliente)


    }
    catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
    }
}

function grillaPedidosCliente(pedidosCliente) {
    try {
        const container = document.getElementById('divPedidosCliente');
        container.innerHTML = '';

        // Lista de todos los estados posibles
        const estados = ['Pendiente', 'EnPreparacion', 'EnCamino', 'Finalizado', 'Cancelado'];

        estados.forEach(estado => {
            // Filtrar los pedidos por el estado actual
            const pedidosFiltrados = pedidosCliente.filter(pedido => pedido.Estado === estado);

            // Si no hay pedidos en el estado actual, no crear la secci�n
            if (pedidosFiltrados.length === 0) {
                return;
            }

            // Crear un contenedor para cada estado
            const estadoContainer = document.createElement('div');
            estadoContainer.className = 'estado-container';

            // Crear un t�tulo para cada estado
            const estadoTitulo = document.createElement('h3');
            estadoTitulo.textContent = `${estado}`;
            estadoContainer.appendChild(estadoTitulo);

            // Crear la tabla para los pedidos de este estado
            const table = document.createElement('table');
            table.className = 'table';

            // Crear el encabezado de la tabla
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            const headers = ['Nro de Pedido', 'Nombre', 'Direccion', 'Telefono', 'Precio', 'Acciones'];

            headers.forEach(headerText => {
                const th = document.createElement('th');
                th.textContent = headerText;
                th.style.textAlign = 'center';
                headerRow.appendChild(th);
            });

            thead.appendChild(headerRow);
            table.appendChild(thead);

            // Crear el cuerpo de la tabla
            const tbody = document.createElement('tbody');
            pedidosFiltrados.forEach(pedido => {
                const row = document.createElement('tr');

                // Nro de Pedido
                const tdId = document.createElement('td');
                tdId.textContent = pedido.Id;
                tdId.style.textAlign = 'center';
                row.appendChild(tdId);

                // Nombre
                const tdNombre = document.createElement('td');
                tdNombre.textContent = pedido.Nombre || 'N/A';
                tdNombre.style.textAlign = 'center';
                row.appendChild(tdNombre);

                // Direcci�n
                const tdDireccion = document.createElement('td');
                tdDireccion.textContent = pedido.Direccion || 'N/A';
                tdDireccion.style.textAlign = 'center';
                row.appendChild(tdDireccion);

                // Telefono
                const tdTelefono = document.createElement('td');
                tdTelefono.textContent = pedido.Telefono || 'N/A';
                tdTelefono.style.textAlign = 'center';
                row.appendChild(tdTelefono);

                // Precio
                const tdPrecio = document.createElement('td');
                tdPrecio.textContent = '$ ' + (pedido.Carrito.PrecioTotal || '0');
                tdPrecio.style.textAlign = 'center';
                row.appendChild(tdPrecio);

                // Contenedor de botones
                const tdAcciones = document.createElement('td');
                const divAcciones = document.createElement('div');
                divAcciones.className = 'acciones';

                // Bot�n Ver
                const btnVer = document.createElement('button');
                btnVer.className = 'btn btn-success';
                btnVer.textContent = 'Ver';
                btnVer.addEventListener('click', () => verPedido(pedido.Id));
                divAcciones.appendChild(btnVer);

                tdAcciones.appendChild(divAcciones);
                row.appendChild(tdAcciones);
                tbody.appendChild(row);
            });

            table.appendChild(tbody);
            estadoContainer.appendChild(table);
            container.appendChild(estadoContainer);
        });
    } catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
    }
}

//arreglar el boton ver que va a cualquier lado y muestra cosas que no deberia, como los botenes aceptar y cancelar. Tmabien el boton volver.
function verPedido(id) {
    try {
        console.log(`Ver pedido ${id}`);
        let redirectUrl = $("#URLGetPedidoClienteVista").val();
        const urlWithId = `${redirectUrl}/${id}`;
        window.location.href = urlWithId;
    } catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
    }

}
