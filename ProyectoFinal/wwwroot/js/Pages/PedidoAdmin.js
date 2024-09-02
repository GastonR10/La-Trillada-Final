$(document).ready(async function () {
    showLoader();
    await cargarMesas();
    hideLoader();
});

async function cargarMesas() {
    try {
        let res = await Mesa.getMesas();
        if (res.status == 500) {
            Tools.Toast('Error inesperado, contacte al administrador', 'error');
            return;
        }

        const selectElement = document.getElementById('mesaNumeroAdmin');

        // Crear y añadir la opción predeterminada
        const defaultOption = document.createElement('option');
        defaultOption.value = '0';
        defaultOption.text = '-- Seleccionar Mesa --';
        selectElement.appendChild(defaultOption);

        // Añadir las opciones obtenidas del servidor
        res.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo.Id;
            option.text = tipo.Id;
            selectElement.appendChild(option);
        });


    } catch (ex) {
        await handleError(ex);
        Tools.Toast('Error inesperado, contacte al administrador', 'error');
    }
}

async function RealizarPedidoAdmin() {
    showLoader();
    const direccion = document.getElementById("direccionPedidoAdmin").value;
    const mesa = document.getElementById("mesaNumeroAdmin").value;
    const pagoTipo = document.getElementById("metodoPagoAdmin").value;
    const comentario = document.getElementById("comPedidoAdmin").value;

    if (direccion != '' && mesa != 0) {
        Tools.Toast('Completar solo un campo entre Dirección y Mesa.', 'warning');
        hideLoader();
        return;
    }

    if (direccion == '' && mesa == 0) {
        Tools.Toast('Ingresar información de dirección o mesa', 'warning');
        hideLoader();
        return;
    }

    const res = await Pedido.RealizarPedidoLogueado(direccion, mesa, pagoTipo, comentario);

    if (res.status == 200) {
        //Guardo variables para mostrar toaster luego de cambio de vista
        localStorage.setItem('toastMessage', 'Pedido realizado');
        localStorage.setItem('toastType', 'success');

        let redirectUrl = $("#URLPantallaPrincipal").val();
        window.location.href = redirectUrl;

    } else if (res.status == 500) {
        Tools.Toast('Error inesperado, contacte al administrador', 'error');

    } else if (res.status == 400) {
        const msj = await res.text();
        Tools.Toast(msj, 'warning');
    }

    hideLoader();
}