async function RegistrarUsuario() {
    try {
        showLoader();
        let nombre = $("#nombre").val();
        let apellido = $("#apellido").val();
        let nombreUsuario = $("#nombreUsuario").val();
        let contrasena = $("#contrasena").val();
        let RepContrasena = $("#RepContrasena").val();
        let correo = $("#correo").val();
        let celular = $("#Celular").val();
        let direccion = $("#direccion").val();

        let mensaje = "";
        if (contrasena != RepContrasena) {
            mensaje += `- Repetición de contraseña no coincide.<br>`;
        }
        if (nombre == "") {
            mensaje += `- Nombre no puede ser vacío.<br>`;
        }
        if (apellido == "") {
            mensaje += `- Apellido no puede ser vacío.<br>`;
        }
        if (nombreUsuario == "") {
            mensaje += `- Nombre de usuario no puede ser vacío.<br>`;
        }
        if (!esContrasenaValida(contrasena)) {
            mensaje += `- Contraseña debe tener 8 caracteres, y al menos un numero.<br>`;
        }
        if (!esEmailValido(correo)) {
            mensaje += `- Dirección de correo inválida.<br>`;
        }
        if (!esCelularValido(celular)) {
            mensaje += `- Celular inválido.<br>`;
        }
        if (direccion == "") {
            mensaje += `- Dirección no puede ser vacío.<br>`;
        }
        if (mensaje != "") {
            Tools.Toast(mensaje, 'warning');

        } else {

            let res = await Usuario.AltaCliente(nombre, apellido, nombreUsuario, contrasena, correo, celular, direccion);
            if (res.status == 200) {
                $("#nombre").val("");
                $("#apellido").val("");
                $("#nombreUsuario").val("");
                $("#contrasena").val("");
                $("#RepContrasena").val("");
                $("#correo").val("");
                $("#Celular").val("");
                $("#direccion").val("");

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
        Tools.Toast('Error inesperado, contacte al administrador', 'error');
    }
}


