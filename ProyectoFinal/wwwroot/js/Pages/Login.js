
function Ingresar() {
    try {
        let usuario = $("#usuarioLogin").val();
        let password = $("#passwordLogin").val();

        AltaDeIngreso(usuario, password);

       /* if () si ingreso redirijo desde el controlador, sino tiro aca mensaje*/
    } catch (ex) {

        console.error('Error:', ex.message);
        throw ex; 
    }
}