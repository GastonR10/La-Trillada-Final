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

        if (contrasena == RepContrasena) {
            let res = await Usuario.AltaCliente(nombre, apellido, nombreUsuario, contrasena, correo, celular, direccion);
            if (res == "ok") {
                let msj = document.getElementById('lblMensajeRegUsu');
                msj.textContent = "Usuario creado con exito!";
                let divMsj = document.getElementById('divMsjRegUsu');
                divMsj.style.display = 'block';
            } else if (res == "error") {
                let msj = document.getElementById('lblMensajeRegUsu');
                msj.textContent = "Error inesperado, contacte a su administrador";
                let divMsj = document.getElementById('divMsjRegUsu');
                divMsj.style.display = 'block';
            } else {
                let msj = document.getElementById('lblMensajeRegUsu');
                msj.textContent = res;
                let divMsj = document.getElementById('divMsjRegUsu');
                divMsj.style.display = 'block';
            }
        } else {
            let msj = document.getElementById('lblMensajeRegUsu');
            msj.textContent = "La contraseña y su confirmación no son iguales.";
            let divMsj = document.getElementById('divMsjRegUsu');
            divMsj.style.display = 'block';
        }


    } catch (err) {
        console.error('Error:', ex.message);
        throw ex;
    }
}
