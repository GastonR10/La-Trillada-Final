$(document).ready(async function () {
    await obtenerPedidos();
});

async function obtenerPedidos() {
    try {

        let pedidosPendientes = await Pedido.GetAllPendientes();

        grillaPedidosPendientes(pedidosPendientes)

    }
    catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
    }
}

function grillaPedidosPendientes(pedidosPendientes) {
    try {
        const container = document.getElementById('divPedidosPendientes');
        container.innerHTML = ''; // Limpiar cualquier contenido previo

        const table = document.createElement('table');
        table.className = 'table';

        // Crear el encabezado de la tabla
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        const headers = ['Nro de Pedido', 'Estado', '', '', ''];
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

        pedidosPendientes.forEach(pedido => {
            const row = document.createElement('tr');

            // Nro de Pedido
            const tdId = document.createElement('td');
            tdId.textContent = pedido.Id;
            tdId.style.textAlign = 'center';
            row.appendChild(tdId);

            // Estado del Pedido
            const tdEstado = document.createElement('td');
            tdEstado.textContent = pedido.Estado;
            tdEstado.style.textAlign = 'center';
            row.appendChild(tdEstado);

            // Botón Aceptar
            const tdAceptar = document.createElement('td');
            const btnAceptar = document.createElement('button');
            btnAceptar.className = 'btn btn-primary';
            btnAceptar.textContent = 'Aceptar';
            btnAceptar.addEventListener('click', () => aceptarPedido(pedido.Id));
            tdAceptar.appendChild(btnAceptar);
            row.appendChild(tdAceptar);

            // Botón Cancelar
            const tdCancelar = document.createElement('td');
            const btnCancelar = document.createElement('button');
            btnCancelar.className = 'btn btn-danger';
            btnCancelar.textContent = 'Cancelar';
            btnCancelar.addEventListener('click', () => cancelarPedido(pedido.Id));
            tdCancelar.appendChild(btnCancelar);
            row.appendChild(tdCancelar);

            // Botón Ver
            const tdVer = document.createElement('td');
            const btnVer = document.createElement('button');
            btnVer.className = 'btn btn-success';
            btnVer.textContent = 'Ver';
            btnVer.addEventListener('click', () => verPedido(pedido.Id));
            tdVer.appendChild(btnVer);
            row.appendChild(tdVer);

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        container.appendChild(table);
    } catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
    }
}

function aceptarPedido(id) {
    console.log(`Aceptar pedido ${id}`);
    // Implementa la lógica para aceptar el pedido
}

function cancelarPedido(id) {
    console.log(`Cancelar pedido ${id}`);
    // Implementa la lógica para cancelar el pedido
}

function verPedido(id) {
    console.log(`Ver pedido ${id}`);
    // Implementa la lógica para ver el pedido
}