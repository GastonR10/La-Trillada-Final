async function cargarMesas(slcId) {
    try {
        let res = await Mesa.getMesas();

        if (res != null) {
            let slcMesas = document.getElementById(slcId);

            // Crear y añadir la opción predeterminada
            const defaultOption = document.createElement('option');
            defaultOption.value = '0';
            defaultOption.text = '-- Seleccionar --';
            slcMesas.appendChild(defaultOption);

            // Añadir las opciones obtenidas del servidor
            res.forEach(m => {
                const option = document.createElement('option');
                option.value = m.Id;
                option.text = m.Id;
                slcMesas.appendChild(option);
            });
        }

        console.log(res);

    } catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
    }

}

function avisarNuevoPedido() {
    const connection = new signalR.HubConnectionBuilder()
        .withUrl("/notificationHub") // Asegúrate de que la URL sea la correcta para tu servidor SignalR
        .configureLogging(signalR.LogLevel.Information)
        .build();

    connection.on("AvisarPedido", async function () {
        console.log('aviso pedido');
        Tools.Toast("Se recibio un nuevo pedido", 'info')     
    });

    connection.start()
        .then(function () {
            console.log('Conectado a SignalR');
        })
        .catch(function (err) {
            console.error('Error al conectar a SignalR:', err.message);
        });
}

