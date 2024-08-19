async function RegistrarUsuario() {
    try {
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
            mensaje += `- Repetici�n de contrase�a no coincide.<br>`;
        }
        if (nombre == "") {
            mensaje += `- Nombre no puede ser vac�o.<br>`;
        }
        if (apellido == "") {
            mensaje += `- Apellido no puede ser vac�o.<br>`;
        }
        if (nombreUsuario == "") {
            mensaje += `- Nombre de usuario no puede ser vac�o.<br>`;
        }
        if (!esContrasenaValida(contrasena)) {
            mensaje += `- Contrase�a debe tener 8 caracteres, y al menos un numero.<br>`;
        }
        if (!esEmailValido(correo)) {
            mensaje += `- Direcci�n de correo inv�lida.<br>`;
        }
        if (!esCelularValido(celular)) {
            mensaje += `- Celular inv�lido.<br>`;
        }
        if (direccion == "") {
            mensaje += `- Direcci�n no puede ser vac�o.<br>`;
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
                let msj = await res.text();
                Tools.Toast(msj, 'warning');
            }

        }

    } catch (ex) {
        Tools.Toast('Error inesperado, contacte al administrador', 'error');
        throw ex;
    }
}

function esCelularValido(numero) {
    // Expresi�n regular para validar que el n�mero comienza con 0 y tiene 9 caracteres
    const patron = /^0\d{8}$/;
    return patron.test(numero);
}

function esContrasenaValida(contrasena) {
    // Expresi�n regular para validar que tiene al menos 8 caracteres y al menos un n�mero
    const patron = /^(?=.*\d).{8,}$/;
    return patron.test(contrasena);
}
function esEmailValido(email) {
    // Expresi�n regular para validar una direcci�n de correo electr�nico incluyendo TLD de dos letras
    const patron = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    return patron.test(email);
}
