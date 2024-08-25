
$(document).ready(function () {
    sessionStorage.setItem('Logueado', false);
});
async function Ingresar() {
    try {
        showLoader();
        let usuario = $("#usuarioLogin").val();
        let password = $("#passwordLogin").val();

        if (usuario == "" || password == "") {
            Tools.Toast('Ningun campo puede ser vacío', 'error');

        } else {
            await Usuario.AltaDeIngreso(usuario, password);            
        }
        
        hideLoader();
        /* if () si ingreso redirijo desde el controlador, sino tiro aca mensaje*/
    } catch (ex) {
        await handleError(ex);
        Tools.Toast('Error inesperado, contacte al administrador', 'error');
    }
}
document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        Ingresar();       
    }
});
