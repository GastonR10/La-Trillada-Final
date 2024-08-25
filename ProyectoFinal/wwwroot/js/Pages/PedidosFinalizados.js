let _PedidosFinalizados;

$(document).ready(async function () {
    
    await obtenerPedidosFinalizados();
    
});

async function obtenerPedidosFinalizados() {
    try {
        showLoader();

        _PedidosFinalizados = await Pedido.GetFinalizados();

        if (_PedidosFinalizados != 200) {
            Tools.Toast("Error inesperado, contacte a su administrador", 'error');
            return;
        }

        if (_PedidosFinalizados.length == 0) {
            Tools.Toast('No hay pedidos finalizados.', 'warning');
        }

        grillaPedidosFinalizados(_PedidosFinalizados)

        hideLoader();
    }
    catch (ex) {
        await handleError(ex);
        Tools.Toast("Error inesperado, contacte a su administrador", 'error');
    }
}

function grillaPedidosFinalizados(pedidosFinalizados) {
    try {
        const container = document.getElementById('divPedidosFinalizados');
        container.innerHTML = '';

        // Si no hay pedidos en el estado "Finalizado", no crear la sección
        if (pedidosFinalizados.length === 0) {
            return;
        }
        
        // Crear un contenedor para los pedidos finalizados
        const estadoContainer = document.createElement('div');
        estadoContainer.className = 'estado-container';

        // Crear un título para el estado
        const estadoTitulo = document.createElement('h3');
        estadoTitulo.textContent = 'Finalizado';
        estadoContainer.appendChild(estadoTitulo);

        // Crear la tabla para los pedidos finalizados
        const table = document.createElement('table');
        table.className = 'table';

        // Crear el encabezado de la tabla
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['Fecha', 'Hora', 'Nro de Pedido', 'Nombre', 'Direccion', 'Telefono', 'Forma de pago', 'Precio', 'Acciones'];

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
        pedidosFinalizados.forEach(pedido => {
            const row = document.createElement('tr');

            // Fecha
            const tdFecha = document.createElement('td');
            const date = new Date(pedido.Fecha);
            const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
            tdFecha.textContent = formattedDate;
            tdFecha.style.textAlign = 'center';
            row.appendChild(tdFecha);

            // Hora
            const tdHora = document.createElement('td');
            const formattedHour = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            tdHora.textContent = formattedHour;
            tdHora.style.textAlign = 'center';
            row.appendChild(tdHora);

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

            //Dirección
            const tdDireccion = document.createElement('td');
            tdDireccion.textContent = pedido.Direccion || 'N/A';
            tdDireccion.style.textAlign = 'center';
            row.appendChild(tdDireccion);

            // Telefono
            const tdTelefono = document.createElement('td');
            tdTelefono.textContent = pedido.Telefono || 'N/A';
            tdTelefono.style.textAlign = 'center';
            row.appendChild(tdTelefono);

            // Forma de pago
            const tdPos = document.createElement('td');
            tdPos.textContent = pedido.Pos ? "POS" : "Efectivo";
            tdPos.style.textAlign = 'center';
            row.appendChild(tdPos);

            // Precio
            const tdPrecio = document.createElement('td');
            tdPrecio.textContent = '$ ' + (pedido.Carrito.PrecioTotal || 0);
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

    } catch (ex) {
        throw ex;
    }
}


function verPedido(id) {
    try {
        let redirectUrl = $("#URLGetPedidoVista").val();
        const urlWithId = `${redirectUrl}/${id}`;
        window.location.href = urlWithId;
    } catch (ex) {
        throw ex;
    }

}