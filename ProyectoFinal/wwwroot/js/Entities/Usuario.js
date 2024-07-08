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

    //constructor(usuario, password) {
    //    this.NombreUsuario = usuario;
    //    this.Password = password;
    //}

    static async AltaDeIngreso(usuario, password) {
        try {
            const url = $("#URLIngresar").val();
            /* const usu = new Usuario(usuario, password);*/ // Cambié el nombre de la variable a 'usu'
            const usu = new Usuario(null, null, usuario, password, null, null, null);

            const response = await fetch(url, {
                method: 'POST', // Cambiado a POST
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usu) // El cuerpo ahora está permitido con POST
            });

            if (response.status == 404) {
                return null;
            }

            const data = await response.json();

            if (data.redirectUrl) {
                window.location.href = data.redirectUrl;
            } else if (data.error) {
                console.error('Error:', data.error);
                alert('Error: ' + data.error);
            }

        } catch (ex) {
            console.error('Error:', ex.message);
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

            if (response.status == 400) {
                return "El nombre de usuario ya existe.";
            }
            if (response.ok) {
                return "ok"
            }

            return "error"

        } catch (ex) {
            console.error('Error:', ex.message);
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

            if (response.status == 400) {
                return "El nombre de usuario ya existe.";
            }
            if (response.ok) {
                return "ok"
            }

            return "error"

        } catch (ex) {
            console.error('Error:', ex.message);
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

            if (response.status == 400) {
                return "El nombre de usuario ya existe.";
            }
            if (response.ok) {
                return await response.json();
            }

            return "error"

        } catch (ex) {
            console.error('Error:', ex.message);
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

            if (response.status == 400) {// lo dejamos de momento pero no deberia estar.
                return "El nombre de usuario ya existe.";
            }
            if (response.ok) {
                return "ok"
            }

            return "error"

        } catch (ex) {
            console.error('Error:', ex.message);
            throw ex;
        }
    }

   
}