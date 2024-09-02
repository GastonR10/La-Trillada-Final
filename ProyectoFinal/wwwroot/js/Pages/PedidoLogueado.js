﻿$(document).ready(async function () {
    showLoader();    
    const mesaId = localStorage.getItem('mesaId');
    $("#mesaNumero").text(mesaId);
    const inputDir = document.getElementById("pedidoDomicilioLogueado");
    const inputLocal = document.getElementById("pedidoLocalLogueado");
    if (!mesaId) {
        await cargarInfoPersonal();
        inputDir.style.display = "block";
        inputLocal.style.display = "none";
    } else {
        inputLocal.style.display = "block";
        inputDir.style.display = "none";
    }
    hideLoader();
});

async function cargarInfoPersonal() {
    try {
        let res = await Usuario.ObtenerUsuario();

        if (res.status == 400) {
            const msj = await res.text();
            Tools.Toast(msj, 'warning');
            
        }

        if (res.status == 500) {
            Tools.Toast("Error inesperado, contacte a su administrador", 'error');
            return;
        }

        if (res.status == 200) {
            res = await res.json();
            let inputDir = document.getElementById("direccionPedido");
            inputDir.innerText = res.Direccion;
        }


    } catch (ex) {
        await handleError(ex);
        Tools.Toast("Error inesperado, contacte a su administrador", 'error');
    }
}

async function RealizarPedidoLog() {
    try {
        showLoader();
        let inputDir = document.getElementById("pedidoDomicilioLogueado");
        let inputLocal = document.getElementById("pedidoLocalLogueado");

        let res;

        let pagoTipo = document.getElementById("metodoPago").value;
        let comentario = $("#comPedido").val();

        if (inputDir.style.display === "block") {

            let dir = $("#direccionPedido").text();
            if (dir == "") {
                Tools.Toast("Ingrese direccion en datos personales.", 'warning');
                hideLoader();
                return;
            } else {
                res = await Pedido.RealizarPedidoLogueado(dir, null, pagoTipo, comentario);
            }

        } else if (inputLocal.style.display === "block") {

            let mesa = document.getElementById("mesaNumero").textContent;
            if (mesa == 0) {
                Tools.Toast("Seleccionar mesa", 'warning');
                hideLoader();
                return;
            } else {
                res = await Pedido.RealizarPedidoLogueado("", mesa, pagoTipo, comentario);
            }
        }

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

    } catch (ex) {
        await handleError(ex);
        Tools.Toast("Error inesperado, contacte a su administrador", 'error');
    }

}