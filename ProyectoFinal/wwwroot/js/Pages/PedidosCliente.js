

$(document).ready(async function () {
    showLoader();
    await obtenerPedidosCliente();
    hideLoader();
});

async function obtenerPedidosCliente() {
    try {

        let pedidosCliente = await Pedido.GetPedidosCliente();
        if (pedidosCliente.status == 500) {
            Tools.Toast("Error inesperado, contacte al administrador", 'error');
        }
        if (pedidosCliente.status == 400) {
            const msj = await pedidosCliente.text();
            Tools.Toast(msj, 'warning');
        }
        if (pedidosCliente.length == 0) {
            Tools.Toast('No hay pedidos.', 'warning');
        }

        grillaPedidosCliente(pedidosCliente)


    }
    catch (ex) {
        await handleError(ex);
        Tools.Toast("Error inesperado, contacte al administrador", 'error');
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

            // Si no hay pedidos en el estado actual, no crear la sección
            if (pedidosFiltrados.length === 0) {
                return;
            }

            // Crear un contenedor para cada estado
            const estadoContainer = document.createElement('div');
            estadoContainer.className = 'estado-container';

            // Crear un título para cada estado
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

                // Dirección
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

                // Botón Ver
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
        throw ex;
    }
}

function verPedido(id) {
    try {
        let redirectUrl = $("#URLGetPedidoClienteVista").val();
        const urlWithId = `${redirectUrl}/${id}`;
        window.location.href = urlWithId;
    } catch (ex) {
        throw ex;
    }

}
