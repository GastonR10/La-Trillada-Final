$(document).ready(async function () {
    await cargarInfoPersonal();
    await cargarMesas();
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

async function cargarMesas() {
    try {
        let res = await Mesa.getMesas();

        if (res != null) {
            let slcMesas = document.getElementById("mesasSlc");

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

function RealizarPedidoLog() {
    try {
        let inputDir = document.getElementById("pedidoDomicilioLogueado");
        let inputLocal = document.getElementById("pedidoLocalLogueado");

        let res;

        if (inputDir.style.display === "block") {

            res = await Pedido.RealizarPedidoLogueado();

        } else if (inputLocal.style.display === "block") {

            res = await Pedido.RealizarPedidoLogueado();
        }

        console.log(res);

            
    } catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
    }

}