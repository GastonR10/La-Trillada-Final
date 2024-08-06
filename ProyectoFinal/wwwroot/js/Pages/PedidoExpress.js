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
            res = await Pedido.RealizarPedidoExpress(dir, nom, mail, tel, null, pagoTipo, comentario);

        } else if (inputLocal.style.display === "block") {

            let mesa = document.getElementById("mesasSlc").value;
            res = await Pedido.RealizarPedidoExpress("", "", "", -1, mesa, pagoTipo, comentario);
        }


        console.log(res);


    } catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
    }

}
