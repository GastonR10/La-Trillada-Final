$(document).ready(async function () {
    showLoader();
    await cargarInfo();
    hideLoader();
});

async function cargarInfo() {
    try {
        let res = await Usuario.ObtenerUsuario();
        
        if (res.status == 400) {
            Tools.Toast('Usuario no encontrado.', 'warning');

        } else if (res.status == 500) {
            Tools.Toast('Error inesperado, contacte al administrador', 'error');
        } else {
            res = await res.json();

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

    } catch (ex) {
        await handleError(ex);
        Tools.Toast('Error inesperado, contacte al administrador', 'error');
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

            let mensaje = "";
            if (nombre == "") {
                mensaje += "- Nombre no puede ser vacío.<br>"

            } if (apellido == "") {
                mensaje += "- Apellido no puede ser vacío.<br>"

            } if (!esEmailValido(correo)) {
                mensaje += "- Correo debe ser válido.<br>"

            } if (!esCelularValido(celular)) {
                mensaje += "- Celular debe ser válido.<br>"

            } if (direccion == "") {
                mensaje += "- Dirección no puede ser vacío.<br>"
            }

            if (mensaje == "") {
                let res = await Usuario.EditarCliente(nombre, apellido, correo, celular, direccion);

                const msj = await res.text();

                if (res.status == 200) {
                    Tools.Toast('Edicion exitosa!', 'success')

                } else if (res.status == 400) {
                    Tools.Toast(msj, 'warning')

                } else if (res.status == 500) {
                    Tools.Toast('Error inesperado, contacte al administrador', 'error');
                }
            } else {
                Tools.Toast(mensaje, 'warning');
            }

            hideLoader();
        }       
        
    } catch (ex) {
        await handleError(ex);
        Tools.Toast('Error inesperado, contacte al administrador', 'error');
    }
}