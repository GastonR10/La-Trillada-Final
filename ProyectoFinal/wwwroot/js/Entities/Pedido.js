class Pedido {
    constructor(id, comentario, estado, aceptado, idMesa, fecha, eliminado, email, telefono, direccion, nombre, apellido, pos) {
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
        this.Apellido = apellido;
        this.Pos = pos;
    }

    static async actualizarEstadoPedido(id) {
        try {
            let url = $("#URLActualizarEstadoPedido").val();

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(id)

            });

            return response;

        } catch (ex) {
            throw ex;
        }
    }

    static async cancelarPedido(id) {
        try {
            let url = $("#URLCancelarPedido").val();

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(id)

            });

            return response;

        } catch (ex) {
            throw ex;
        }
    }

    static async getPedido(id) {
        try {
            let url = $("#URLGetPedido").val();

            url = url + "/" + id

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status != 200) {
                return response;
                
            } else {
                const data = await response.json();

                let pedido;

                if (data.Cliente != null && data.Cliente != undefined) {
                    pedido = new Pedido(data.Id, data.Comentario, data.Estado, data.Aceptado, data.IdMesa, data.Fecha, data.Eliminado, data.Cliente.Email, data.Cliente.Telefono, data.Cliente.Direccion, data.Cliente.Nombre, data.Cliente.Apellido, data.Pos);
                } else {
                    pedido = new Pedido(data.Id, data.Comentario, data.Estado, data.Aceptado, data.IdMesa, data.Fecha, data.Eliminado, data.Email, data.Telefono, data.Direccion, data.Nombre, data.Apellido, data.Pos);
                }

                pedido.Carrito = data.Carrito;

                return pedido;
            }

        } catch (ex) {
            throw ex;
        }
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

            return response;

        } catch (ex) {
            throw ex;
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
                           
            return response;

        } catch (ex) {
            throw ex;
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

            if (response.status != 200) {
                return response;
            }

            const data = await response.json();

            const pedidos = [
                ...data.PedidosCliente.map(item => {
                    const pedido = new Pedido(item.Id, item.Comentario, item.Estado, item.Aceptado, item.IdMesa, item.Fecha, item.Eliminado, item.Cliente.Email, item.Cliente.Telefono, item.Direccion, item.Cliente.Nombre, item.Cliente.Apellido, item.Pos);
                    pedido.Carrito = item.Carrito;
                    return pedido;
                }
                ),
                ...data.PedidosExpress.map(item => {
                    const pedido = new Pedido(item.Id, item.Comentario, item.Estado, item.Aceptado, item.IdMesa, item.Fecha, item.Eliminado, item.Email, item.Telefono, item.Direccion, item.Nombre, item.Apellido, item.Pos);
                    pedido.Carrito = item.Carrito;
                    return pedido;
                }

                )
            ];

            // Ordenar por número de pedido (Id)
            pedidos.sort((a, b) => a.Id - b.Id);

            return pedidos;
            
        } catch (ex) {
            throw ex;
        }
    }

    static async GetFinalizados() {
        try {
            const url = $("#URLPedidosFinalizados").val();


            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify()
            });

            if (response.status != 200) {
                return response;
            }

            const data = await response.json();

            const pedidos = [
                ...data.PedidosCliente.map(item => {
                    const pedido = new Pedido(item.Id, item.Comentario, item.Estado, item.Aceptado, item.IdMesa, item.Fecha, item.Eliminado, item.Cliente.Email, item.Cliente.Telefono, item.Direccion, item.Cliente.Nombre, item.Cliente.Apellido, item.Pos);
                    pedido.Carrito = item.Carrito;
                    return pedido;
                }
                ),
                ...data.PedidosExpress.map(item => {
                    const pedido = new Pedido(item.Id, item.Comentario, item.Estado, item.Aceptado, item.IdMesa, item.Fecha, item.Eliminado, item.Email, item.Telefono, item.Direccion, item.Nombre, item.Apellido, item.Pos);
                    pedido.Carrito = item.Carrito;
                    return pedido;
                }
                    
                )
            ];

            // Ordenar por número de pedido (Id)
            pedidos.sort((a, b) => a.Id - b.Id);

            return pedidos;


        } catch (ex) {
            throw ex;
        }
    }

    static async GetPedidosCliente() {
        try {
            const url = $("#URLPedidosCliente").val();

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status != 200) {
                return response;
            }

            const data = await response.json();

            const pedidos = data.map(item => {
                const pedido = new Pedido(
                    item.Id,
                    item.Comentario,
                    item.Estado,
                    item.Aceptado,
                    item.IdMesa,
                    new Date(item.Fecha), // Convertir la fecha a objeto Date
                    item.Eliminado,
                    item.Cliente.Email,
                    item.Cliente.Telefono,
                    item.Direccion,
                    item.Cliente.Nombre,
                    item.Pos
                );
                pedido.Carrito = item.Carrito;
                return pedido;
            });

            // Ordenar por fecha de la más reciente a la más antigua
            pedidos.sort((a, b) => b.Fecha - a.Fecha);

            return pedidos;

        } catch (ex) {
            throw ex;
        }
    }

    static async GetPedidosCocina() {
        try {
            const url = $("#URLPedidosCocina").val();


            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify()
            });

            if (response.status == 500) return response;
                    
            const data = await response.json();

            const pedidos = [
                ...data.PedidosCliente.map(item => {
                    const pedido = new Pedido(item.Id, item.Comentario, item.Estado, item.Aceptado, item.IdMesa, item.Fecha, item.Eliminado, item.Cliente.Email, item.Cliente.Telefono, item.Direccion, item.Cliente.Nombre, item.Cliente.Apellido, item.Pos);
                    pedido.Carrito = item.Carrito;
                    return pedido;
                }
                ),
                ...data.PedidosExpress.map(item => {
                    const pedido = new Pedido(item.Id, item.Comentario, item.Estado, item.Aceptado, item.IdMesa, item.Fecha, item.Eliminado, item.Email, item.Telefono, item.Direccion, item.Nombre, item.Apellido, item.Pos);
                    pedido.Carrito = item.Carrito;
                    return pedido;
                }

                )
            ];

            // Ordenar por número de pedido (Id)
            pedidos.sort((a, b) => a.Id - b.Id);

            return pedidos;


        } catch (ex) {
            throw ex;
        }
    }

}

