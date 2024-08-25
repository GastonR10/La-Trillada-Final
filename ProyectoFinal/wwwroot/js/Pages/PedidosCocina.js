﻿$(document).ready(async function () {
    
    await cargarPedidosEnPreparacion();

    configurarSignalRR();

    
});

async function cargarPedidosEnPreparacion() {
    try {
        showLoader();
        const pedidos = await Pedido.GetPedidosCocina();
        if (pedidos.status == 500) {
            Tools.Toast('Error inesperado, contacte al administrador', 'error');
            return;
        }

        if (pedidos.length == 0) {
            Tools.Toast('No hay órdenes para cocinar.', 'warning');
        }

        const container = document.getElementById('divPedidosCocina');
        container.innerHTML = ''; // Limpiar el contenedor

        // Crear una fila (row) para las columnas
        let row = document.createElement('div');
        row.className = 'row';

        pedidos.forEach((pedido) => {
            // Crear la tarjeta (columna)
            const col = document.createElement('div');
            col.className = 'col-md-3 mb-3'; // Configurar la columna para ocupar 1/4 del ancho

            const card = document.createElement('div');
            card.className = 'card h-100'; // Hacer que la tarjeta ocupe toda la altura del contenedor

            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';

            const cardTitle = document.createElement('h5');
            cardTitle.className = 'card-title';
            // Mostrar mesa o dirección dependiendo del valor de IdMesa
            if (pedido.IdMesa === 0) {
                cardTitle.innerText = `Pedido #${pedido.Id} \nDirección: ${pedido.Direccion}`;
            } else {
                cardTitle.innerText = `Pedido #${pedido.Id} \nMesa: ${pedido.IdMesa}`;
            }

            const cardText = document.createElement('p');
            cardText.className = 'card-text';
            cardText.innerText = `Cliente: ${pedido.Nombre} ${pedido.Apellido}\nComentario: ${pedido.Comentario}`;

            const listaProd = document.createElement('ul');
            listaProd.className = 'list-group list-group-flush';

            pedido.Carrito.ProductosCantidad.forEach(producto => {
                const item = document.createElement('li');
                item.className = 'list-group-item';
                item.innerHTML = `
                    <strong>${producto.Cantidad} - ${producto.Producto.Nombre}</strong><br/>
                    ${producto.Comentario || ' - '}
                `;
                listaProd.appendChild(item);
            });

            // Agregar el botón debajo del último producto
            const btnCambiarEstado = document.createElement('button');
            btnCambiarEstado.className = 'btn btn-primary mt-2';
            btnCambiarEstado.innerText = 'Pronto';
            btnCambiarEstado.onclick = async function () {
                await actualizarEstadoPedido(pedido.Id);                
            };
            listaProd.appendChild(btnCambiarEstado);

            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardText);
            card.appendChild(cardBody);
            card.appendChild(listaProd);
            col.appendChild(card);

            container.appendChild(col);
        });

        // Añadir la última fila si quedó incompleta
        if (row.hasChildNodes()) {
            container.appendChild(row);
        }
        hideLoader();

    } catch (ex) {
        await handleError(ex);
        Tools.Toast("Error inesperado, contacte a su administrador", 'error');
    }   

}

async function actualizarEstadoPedido(id) {    

    // Implementa la lógica para aceptar el pedido
    try {
        let confirmacion = await asyncConfirm(`¿Estás seguro?`);

        if (confirmacion) {
            await Pedido.actualizarEstadoPedido(id);
        }

    } catch (ex) {
        throw ex;
    }

}

function configurarSignalRR() {
    const connection = new signalR.HubConnectionBuilder()
        .withUrl("/notificationHub") // Asegúrate de que la URL sea la correcta para tu servidor SignalR
        .configureLogging(signalR.LogLevel.Information)
        .build();

    connection.on("PedidoAceptado", async function (id) {
        
        await cargarPedidosEnPreparacion(); // Obtén la lista actualizada de pedidos 
    });

    connection.on("PedidoPronto", async function (id) {
        
        await cargarPedidosEnPreparacion(); // Obtén la lista actualizada de pedidos      
        
    });

    connection.start()
        .then(function () {
            console.log('Conectado a SignalR');
        })
        .catch(function (err) {
            console.error('Error al conectar a SignalR:', err.message);
        });
}