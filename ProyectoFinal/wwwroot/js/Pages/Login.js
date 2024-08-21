
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
            let res = await Usuario.AltaDeIngreso(usuario, password);

            if (res.status == 404) {
                Tools.Toast('Credenciales incorrectas.', 'warning');
            }
            if (res.status == 500) {
                Tools.Toast('Error inesperado, contacte al administrador', 'error');
            }
        }
        
        hideLoader();
        /* if () si ingreso redirijo desde el controlador, sino tiro aca mensaje*/
    } catch (ex) {

        Tools.Toast('Error inesperado, contacte al administrador', 'error');
    }
}
document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        Ingresar();       
    }
});
