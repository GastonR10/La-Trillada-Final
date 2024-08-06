$(document).ready(async function () {
    showLoader();
    await cargarInfoPersonal();
    await cargarMesas("mesasSlc");
    hideLoader();
});

async function cargarInfoPersonal() {
    try {
        let res = await Usuario.ObtenerUsuario();

        if (res != null) {
            let inputDir = document.getElementById("direccionPedido");

            inputDir.innerText = res.Direccion;
        }

        console.log(res);

    } catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
    }
}

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

async function RealizarPedidoLog() {
    try {
        let inputDir = document.getElementById("pedidoDomicilioLogueado");
        let inputLocal = document.getElementById("pedidoLocalLogueado");

        let res;

        let pagoTipo = document.getElementById("metodoPago").value; 
        let comentario = $("#comPedido").val();

        if (inputDir.style.display === "block") {

            let dir = $("#direccionPedido").text();
            res = await Pedido.RealizarPedidoLogueado(dir, null, pagoTipo, comentario);

        } else if (inputLocal.style.display === "block") {

            let mesa = document.getElementById("mesasSlc").value;
            res = await Pedido.RealizarPedidoLogueado("", mesa, pagoTipo, comentario);
        }


        console.log(res);

            
    } catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
    }

}