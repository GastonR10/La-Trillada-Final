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


    static async RealizarPedidoLogueado(dir, mesa, pagoTipo) {
        try {
            const url = $("#URLRealizarPedidoLogueado").val();


            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dir, mesa, pagoTipo)
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

