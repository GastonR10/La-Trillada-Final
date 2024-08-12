$(document).ready(async function () {
    showLoader();
    await cargarMesas("mesasSlc");
    hideLoader();
});


function TipoPedido(tipoPedido) {
    try {

        let inputGral = document.getElementById("pedidoLogueadoGeneral");
        inputGral.style.display = "block";
        let inputDir = document.getElementById("pedidoDomicilioLogueado");
        let inputLocal = document.getElementById("pedidoLocalLogueado");

        if (tipoPedido == 1) {
            inputDir.style.display = "block";
            inputLocal.style.display = "none";
        } else {
            inputLocal.style.display = "block";
            inputDir.style.display = "none";
        }
    } catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
    }


}

async function RealizarPedidoExpress() {
    try {
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
            }
            else {
                res = await Pedido.RealizarPedidoExpress(dir, nom, mail, tel, null, pagoTipo, comentario);
            }            

        } else if (inputLocal.style.display === "block") {

            let mesa = document.getElementById("mesasSlc").value;
            if (mesa == 0) {
                Tools.Toast("Seleccionar mesa", 'warning');
            } else {
                res = await Pedido.RealizarPedidoExpress("", "", "", -1, mesa, pagoTipo, comentario);
                
            } 
                         
        }
        if (res.status == 200) {
            Tools.Toast("Pedido realizado con exito!", 'success');
            //Guardo variables para mostrar toaster luego de cambio de vista
            localStorage.setItem('toastMessage', 'Pedido realizado');
            localStorage.setItem('toastType', 'success');

            let redirectUrl = $("#URLProductosActivos").val();
            window.location.href = redirectUrl;

        } else if (res.status == 500) {
            Tools.Toast('Error inesperado, contacte al administrador', 'error');

        } else if (res.status == 403) {
            Tools.Toast("Carrito esta vacío", 'warning');
        }


        console.log(res);


    } catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
    }

}
