
async function RegistrarAdmin() {
    try {
        let RepContrasenaAdmin = $("#RepContrasenaAdmin").val();
        let contrasenaAdmin = $("#contrasenaAdmin").val();
        let nombreUsuarioAdmin = $("#nombreUsuarioAdmin").val();

        if (RepContrasenaAdmin == contrasenaAdmin) {
            let res = await Usuario.AltaAdmin(nombreUsuarioAdmin, contrasenaAdmin);
            if (res == "ok") {
                let msj = document.getElementById('lblMensajeAdm');
                msj.textContent = "Alta exitosa!";
                let divMsj = document.getElementById('divMsjAdm');
                divMsj.style.display = 'block';
            } else if (res == "error") {
                let msj = document.getElementById('lblMensajeAdm');
                msj.textContent = "Error inesperado, contacte a su administrador";
                let divMsj = document.getElementById('divMsjAdm');
                divMsj.style.display = 'block';
            } else {
                let msj = document.getElementById('lblMensajeAdm');
                msj.textContent = res;
                let divMsj = document.getElementById('divMsjAdm');
                divMsj.style.display = 'block';
            }

        } else {
            let msj = document.getElementById('lblMensajeAdm');
            msj.textContent = "La contraseña y su confirmación no son iguales.";
            let divMsj = document.getElementById('divMsjAdm');
            divMsj.style.display = 'block';
        }
    } catch (err) {
        console.error('Error:', ex.message);
        throw ex;
    }
}