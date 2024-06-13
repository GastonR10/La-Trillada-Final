class Usuario {
    constructor(usuario, password) {
        this.NombreUsuario = usuario;
        this.Password = password;
    }

    static async AltaDeIngreso(usuario, password) {
        try {
            const url = $("#URLAltaUsuario").val();
            const usuario = new Usuario(usuario, password);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)
            });

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }

            return response;


        } catch (ex) {

            console.error('Error:', ex.message);
            throw ex;
        }
    }


}