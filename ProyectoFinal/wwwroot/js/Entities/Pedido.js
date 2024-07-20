class Pedido {
    constructor(id, comentario, estado, aceptado, idMesa, fecha, eliminado, email, telefono, direccion, nombre) {
        this.Id = id;
        this.Comentario = comentario;
        this.Estado = estado;
        this.Aceptado = aceptado;
        this.Carrito = null;
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

            let carrito = new Carrito();
            carrito.ProductosCantidad = JSON.parse(localStorage.getItem("carrito"));

            if (!carrito.ProductosCantidad) {
                carrito.ProductosCantidad = [];
            }

            let requestBody = {
                Dir: dir,
                Nombre: nom,
                Mail: mail,
                Tel: tel,
                Mesa: mesa,
                PagoTipo: pagoTipo,
                Comentario: comentario,
                Carrito: carrito
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
                localStorage.setItem('carrito', JSON.stringify([]));
                return "ok"
            }

            return "error"

        } catch (error) {
            console.error('Error fetching products:', error);
        }

    }

    static async GetAllPendientes() {
        try {
            const url = $("#URLPedidosPendientes").val();


            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify()
            });

            if (response.status == 400) {// lo dejamos de momento pero no deberia estar.
                return "Sin permisos de Administrador.";
            }

            const data = await response.json();

            const pedidos = data.map(item => new Pedido(item.Id, item.Comentario, item.Estado, item.Aceptado, item.IdMesa, item.Fecha, item.Eliminado, item.Email, item.Telefono,item.Direccion, item.Nombre));

            return pedidos;

            return "error"

        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

}

