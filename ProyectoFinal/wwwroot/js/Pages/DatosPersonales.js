$(document).ready(async function () {
    await cargarInfo();
});

async function cargarInfo() {
    try {
        let res = await Usuario.ObtenerUsuario();

        if (res != null) {
            let inputNombre = document.getElementById("nombre");
            let inputApellido = document.getElementById("apellido");
            let inputCorreo = document.getElementById("correo");
            let inputTel = document.getElementById("Celular");
            let inputDir = document.getElementById("direccion");

            inputNombre.value = res.Nombre;
            inputApellido.value = res.Apellido;
            inputCorreo.value = res.Email;
            inputTel.value = res.Telefono;
            inputDir.value = res.Direccion;
        }

        console.log(res);

    } catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
    }

}

async function EditarCliente() {
    try {

        let nombre = $("#nombre").val();
        let apellido = $("#apellido").val();
        let correo = $("#correo").val();
        let celular = $("#Celular").val();
        let direccion = $("#direccion").val();

        let res = await Usuario.EditarCliente(nombre, apellido, correo, celular, direccion);

        if (res == "ok") {
            let msj = document.getElementById('lblMensajeEditCli');
            msj.textContent = "Edición exitosa!";
            let divMsj = document.getElementById('divMsjEditCli');
            divMsj.style.display = 'block';
        } else {
            let msj = document.getElementById('lblMensajeEditCli');
            msj.textContent = res;
            let divMsj = document.getElementById('divMsjEditCli');
            divMsj.style.display = 'block';
        }

    } catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
    }
}