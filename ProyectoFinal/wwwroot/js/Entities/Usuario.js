class Usuario {
    constructor(nombre, apellido, usuario, password, correo, celular, direccion) {
        this.NombreUsuario = usuario;
        this.Password = password;
        this.Nombre = nombre;
        this.Apellido = apellido;
        this.Email = correo;
        this.Telefono = celular;
        this.Direccion = direccion;
        this.CarritoAbierto = new Carrito();
    }

    static async AltaDeIngreso(usuario, password) {
        try {
            const url = $("#URLIngresar").val();
            
            const usu = new Usuario(null, null, usuario, password, null, null, null);

            const response = await fetch(url, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usu) 
            });

            if (response.status == 404) {
                let msj = await response.text();
                Tools.Toast(msj, 'warning');
            }

            if (response.status == 500) {
                Tools.Toast('Error inesperado, contacte al administrador', 'error');
            }

            if (response.status == 200) {
                const data = await response.json();

                if (data.redirectUrl) {
                    sessionStorage.setItem('Logueado', true);
                    window.location.href = data.redirectUrl;
                }
                
            } 

        } catch (ex) {
            throw ex;
        }
    }

    static async AltaAdmin(usuario, password) {
        try {
            const url = $("#URLAltaAdmin").val();
            const usu = new Usuario(null, null, usuario, password, null, null, null); // Cambié el nombre de la variable a 'usu'

            const response = await fetch(url, {
                method: 'POST', // Cambiado a POST
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usu) // El cuerpo ahora está permitido con POST
            });

            return response;

        } catch (ex) {
            throw ex;
        }
    }


    static async AltaCliente(nombre, apellido, usuario, password, correo, celular, direccion) {
        try {
            const url = $("#URLAltaCliente").val();
            const usu = new Usuario(nombre, apellido, usuario, password, correo, celular, direccion);

            const response = await fetch(url, {
                method: 'POST', // Cambiado a POST
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usu) // El cuerpo ahora está permitido con POST
            });

            return response;

        } catch (ex) {
            throw ex;
        }
    }


    static async ObtenerUsuario() {
        try {
            const url = $("#URLObtenerUsuario").val();

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response;

        } catch (ex) {
            throw ex;
        }
    }

    static async EditarCliente(nombre, apellido, correo, celular, direccion) {
        try {
            const url = $("#URLEditarCliente").val();
            const usu = new Usuario(nombre, apellido, "", "", correo, celular, direccion);

            const response = await fetch(url, {
                method: 'POST', // Cambiado a POST
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usu) // El cuerpo ahora está permitido con POST
            });

            return response;

        } catch (ex) {
            throw ex;
        }
    }

}