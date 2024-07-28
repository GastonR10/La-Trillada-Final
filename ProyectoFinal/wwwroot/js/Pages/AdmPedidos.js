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
        container.innerHTML = '';

        // Limpiar cualquier contenido previo
        const estados = ['Pendiente', 'EnPreparacion', 'EnCamino'];
        estados.forEach(estado => {

            // Filtrar los pedidos por el estado actual
            const pedidosFiltrados = pedidosPendientes.filter(pedido => pedido.Estado === estado);

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
            const headers = ['Nro de Pedido', 'Acciones'];

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
                tdId.textContent = pedido.Id; tdId.style.textAlign = 'center';
                row.appendChild(tdId);

                // Contenedor de botones
                const tdAcciones = document.createElement('td');
                const divAcciones = document.createElement('div');
                divAcciones.className = 'acciones';
                if (estado === 'Pendiente') {

                    // Botón Aceptar
                    const btnAceptar = document.createElement('button');
                    btnAceptar.className = 'btn btn-primary';
                    btnAceptar.textContent = 'Aceptar';
                    btnAceptar.addEventListener('click', async () => await actualizarEstadoPedido(pedido.Id));
                    divAcciones.appendChild(btnAceptar);

                    // Botón Cancelar
                    const btnCancelar = document.createElement('button');
                    btnCancelar.className = 'btn btn-danger';
                    btnCancelar.textContent = 'Cancelar';
                    btnCancelar.addEventListener('click', () => cancelarPedido(pedido.Id));
                    divAcciones.appendChild(btnCancelar);

                    // Botón Ver
                    const btnVer = document.createElement('button');
                    btnVer.className = 'btn btn-success';
                    btnVer.textContent = 'Ver';
                    btnVer.addEventListener('click', () => verPedido(pedido.Id));
                    divAcciones.appendChild(btnVer);

                } else if (estado === 'EnPreparacion') {

                    // Botón En Camino
                    const btnEnCamino = document.createElement('button');
                    btnEnCamino.className = 'btn btn-primary';
                    btnEnCamino.textContent = 'En camino';
                    btnEnCamino.addEventListener('click', async () => await actualizarEstadoPedido(pedido.Id));
                    divAcciones.appendChild(btnEnCamino);

                    // Botón Cancelar
                    const btnCancelar = document.createElement('button');
                    btnCancelar.className = 'btn btn-danger';
                    btnCancelar.textContent = 'Cancelar';
                    btnCancelar.addEventListener('click', () => cancelarPedido(pedido.Id));
                    divAcciones.appendChild(btnCancelar);

                    // Botón Ver
                    const btnVer = document.createElement('button'); btnVer.className = 'btn btn-success';
                    btnVer.textContent = 'Ver';
                    btnVer.addEventListener('click', () => verPedido(pedido.Id));
                    divAcciones.appendChild(btnVer);

                } else if (estado === 'EnCamino') {

                    // Botón Finalizar
                    const btnFinalizar = document.createElement('button');
                    btnFinalizar.className = 'btn btn-primary';
                    btnFinalizar.textContent = 'Finalizar';
                    btnFinalizar.addEventListener('click', async () => await actualizarEstadoPedido(pedido.Id));
                    divAcciones.appendChild(btnFinalizar);

                    // Botón Cancelar
                    const btnCancelar = document.createElement('button');
                    btnCancelar.className = 'btn btn-danger';
                    btnCancelar.textContent = 'Cancelar';
                    btnCancelar.addEventListener('click', () => cancelarPedido(pedido.Id));
                    divAcciones.appendChild(btnCancelar);

                    // Botón Ver
                    const btnVer = document.createElement('button');
                    btnVer.className = 'btn btn-success';
                    btnVer.textContent = 'Ver';
                    btnVer.addEventListener('click', () => verPedido(pedido.Id));
                    divAcciones.appendChild(btnVer);

                }

                tdAcciones.appendChild(divAcciones);
                row.appendChild(tdAcciones);
                tbody.appendChild(row);

            });

            table.appendChild(tbody);
            estadoContainer.appendChild(table);
            container.appendChild(estadoContainer);
        });

    }
    catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
    }
}


async function actualizarEstadoPedido(id) {
    console.log(`Aceptar pedido ${id}`);
    // Implementa la lógica para aceptar el pedido
    try {
        let confirmacion = confirm(`¿Estás seguro?`);

        if (confirmacion) {
            await Pedido.actualizarEstadoPedido(id);

            await obtenerPedidos();
        }

    } catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
    }
}

async function cancelarPedido(id) {
    console.log(`Cancelar pedido ${id}`);
    let confirmacion = confirm(`¿Está seguro que desea cancelar?`);

    if (confirmacion) {
        await Pedido.cancelarPedido(id);

        await obtenerPedidos();
    }
}

function verPedido(id) {
    try {
        console.log(`Ver pedido ${id}`);
        let redirectUrl = $("#URLGetPedidoVista").val();
        const urlWithId = `${redirectUrl}/${id}`;
        window.location.href = urlWithId;
    } catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
    }

}