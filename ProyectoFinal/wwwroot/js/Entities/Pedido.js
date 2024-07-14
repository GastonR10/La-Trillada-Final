class Pedido {
    constructor(id, comentario, estado, aceptado, carrito, idMesa, fecha, eliminado, email, telefono, direccion, nombre) {
        this.Id = id;
        this.Comentario = comentario;
        this.Estado = estado;
        this.Aceptado = aceptado;
        this.Carrito = carrito;
        this.IdMesa = idMesa;
        this.Fecha = fecha;
        this.Eliminado = eliminado;
        this.Email = email;
        this.Telefono = telefono;
        this.Direccion = direccion;
        this.Nombre = nombre;
    }


    static async RealizarPedidoLogueado(dir, mesa, pagoTipo, comentario) {
        try {
            const url = $("#URLRealizarPedidoLogueado").val();

            if (mesa == null) mesa = 0;

            pagoTipo == 1 ? pagoTipo = true : pagoTipo = false;
                
         
            let requestBody = {
                Dir: dir,
                Mesa: mesa,
                PagoTipo: pagoTipo,
                Comentario: comentario
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (response.status == 400) {// lo dejamos de momento pero no deberia estar.
                return "El producto no existe.";
            }
            if (response.ok) {
                return "ok"
            }

            return "error"

        } catch (error) {
            console.error('Error fetching products:', error);
        }

    }


    static async RealizarPedidoExpress(dir, nom, mail, tel, mesa, pagoTipo, comentario) {
        try {
            const url = $("#URLRealizarPedidoExpress").val();

            if (mesa == null) mesa = 0;

            pagoTipo == 1 ? pagoTipo = true : pagoTipo = false;


            let requestBody = {
                Dir: dir,
                Nombre: nom,
                Mail: mail,
                Tel: tel,
                Mesa: mesa,
                PagoTipo: pagoTipo,
                Comentario: comentario
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (response.status == 400) {// lo dejamos de momento pero no deberia estar.
                return "El producto no existe.";
            }
            if (response.ok) {
                return "ok"
            }

            return "error"

        } catch (error) {
            console.error('Error fetching products:', error);
        }

    }

}

