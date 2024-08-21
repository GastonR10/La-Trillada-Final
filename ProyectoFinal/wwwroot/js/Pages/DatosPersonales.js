$(document).ready(async function () {
    showLoader();
    await cargarInfo();
    hideLoader();
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
        
        const conf = await asyncConfirm("Seguro que desea confirmar?");

        if (conf) {
            showLoader();
            let nombre = $("#nombre").val();
            let apellido = $("#apellido").val();
            let correo = $("#correo").val();
            let celular = $("#Celular").val();
            let direccion = $("#direccion").val();

            let res = await Usuario.EditarCliente(nombre, apellido, correo, celular, direccion);

            if (res == "ok") {
                Tools.Toast('Edicion exitosa!', 'success')
            } else {
                Tools.Toast(res, 'error')
            }
            hideLoader();
        }       
        
    } catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
    }
}