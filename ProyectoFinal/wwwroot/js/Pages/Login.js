async function Ingresar() {
    try {
        let usuario = $("#usuarioLogin").val();
        let password = $("#passwordLogin").val();

        let res = await Usuario.AltaDeIngreso(usuario, password);

        if (res == null || res == undefined) {
            console.log("Es OK");
        }

       /* if () si ingreso redirijo desde el controlador, sino tiro aca mensaje*/
    } catch (ex) {

        console.error('Error:', ex.message);
        throw ex; 
    }
}