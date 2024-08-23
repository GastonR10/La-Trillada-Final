
async function RegistrarAdmin() {
    try {
        showLoader();
        let RepContrasenaAdmin = $("#RepContrasenaAdmin").val();
        let contrasenaAdmin = $("#contrasenaAdmin").val();
        let nombreUsuarioAdmin = $("#nombreUsuarioAdmin").val();

        let mensaje = "";
        if (contrasenaAdmin != RepContrasenaAdmin) {
            mensaje += `- Repetición de contraseña no coincide.<br>`;
        }
        if (nombreUsuarioAdmin == "") {
            mensaje += `- Nombre de usuario no puede ser vacío.<br>`;
        }
        if (!esContrasenaValida(contrasenaAdmin)) {
            mensaje += `- Contraseña debe tener 8 caracteres, y al menos un numero.<br>`;
        }

        if (mensaje != "") {
            Tools.Toast(mensaje, 'warning');
        } else {
            let res = await Usuario.AltaAdmin(nombreUsuarioAdmin, contrasenaAdmin);
            if (res.status == 200) {
                $("#nombreUsuarioAdmin").val("");
                $("#contrasenaAdmin").val("");
                $("#RepContrasenaAdmin").val("");

                Tools.Toast("Usuario creado con exito!", 'success');


            } else if (res.status == 500) {
                Tools.Toast("Error inesperado, contacte a su administrador", 'error');

            } else {
                const msj = await res.text();
                Tools.Toast(msj, 'warning');
            }

        }
        hideLoader();

    } catch (ex) {
        await handleError(ex);
        Tools.Toast("Error inesperado, contacte a su administrador", 'error');
    }
}