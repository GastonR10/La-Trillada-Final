$(document).ready(async function () {
    showLoader();
    //await cargarMesas("mesasSlc");
    const mesaId = localStorage.getItem('mesaId');
    $("#mesaNumero").text(mesaId);

    const inputDir = document.getElementById("pedidoDomicilioLogueado");
    const inputLocal = document.getElementById("pedidoLocalLogueado");
    if (!mesaId) {
        inputDir.style.display = "block";
        inputLocal.style.display = "none";
    } else {
        inputLocal.style.display = "block";
        inputDir.style.display = "none";
    }
    hideLoader();
});


//async function TipoPedido(tipoPedido) {
//    try {

//        let inputGral = document.getElementById("pedidoLogueadoGeneral");
//        inputGral.style.display = "block";
//        let inputDir = document.getElementById("pedidoDomicilioLogueado");
//        let inputLocal = document.getElementById("pedidoLocalLogueado");

//        if (tipoPedido == 1) {
//            inputDir.style.display = "block";
//            inputLocal.style.display = "none";
//        } else {
//            inputLocal.style.display = "block";
//            inputDir.style.display = "none";
//        }
//    } catch (ex) {
//        await handleError(ex);
//        Tools.Toast("Error inesperado, contacte a su administrador", 'error');
//    }
//}

async function RealizarPedidoExpress() {
    try {
        showLoader();
        let inputDir = document.getElementById("pedidoDomicilioLogueado");
        let inputLocal = document.getElementById("pedidoLocalLogueado");

        let res;

        let pagoTipo = document.getElementById("metodoPago").value;
        let comentario = $("#comPedido").val();

        if (inputDir.style.display === "block") {

            let dir = $("#direccionPedEx").val();
            let nom = $("#nombrePedEx").val();
            let mail = $("#mailPedEx").val();
            let tel = $("#telefonoPedEx").val();

            let mensaje = "";
            if (dir == "") {
                mensaje += `- Direccion no puede ser vacío.<br>`;
            }
            if (nom == "") {
                mensaje += `- Nombre no puede ser vacío.<br>`;
            }
            if (tel == 0) {
                mensaje += `- Telefono no puede ser vacío.<br>`;
            }
            if (mensaje != "") {
                Tools.Toast(mensaje, 'warning');
                return;
                hideLoader();
            }
            else {
                res = await Pedido.RealizarPedidoExpress(dir, nom, mail, tel, null, pagoTipo, comentario);
            }            

        } else if (inputLocal.style.display === "block") {

            let mesa = document.getElementById("mesaNumero").textContent;
            let nombre = document.getElementById("nombrePedExMesa").value;
            if (nombre == "") {
                Tools.Toast("Ingresar Nombre", 'warning');
                return;
                hideLoader();
            } else {
                res = await Pedido.RealizarPedidoExpress("", nombre, "", -1, mesa, pagoTipo, comentario);
                
            } 
                         
        }
        if (res.status == 200) {
            Tools.Toast("Pedido realizado con exito!", 'success');
            //Guardo variables para mostrar toaster luego de cambio de vista
            localStorage.removeItem('carrito');
            localStorage.setItem('toastMessage', 'Pedido realizado');
            localStorage.setItem('toastType', 'success');

            let redirectUrl = $("#URLProductosActivos").val();
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
