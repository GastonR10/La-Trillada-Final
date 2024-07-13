class Carrito {
    constructor() {
        this.ProductosCantidad = [];
    }

    static async obtenerProductosCarrito() {

        try {
            const url = $("#URLObtenerProductosCarrito").val();

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status == 400) {// lo dejamos de momento pero no deberia estar.
                return "No se encontro usuario logeado.";
            }

            const data = await response.json();

            const productosCantidad = data.map(item => {
                const productoCantidad = new ProductoCantidad(item.Producto.Id, item.Cantidad);
                const producto = new Producto(item.Producto.Id, item.Producto.Nombre, item.Producto.Descripcion, item.Producto.Foto, item.Producto.IdTipoProducto, item.Producto.Precio, item.Producto.Activo, item.Producto.Eliminado);
                productoCantidad.setProducto(producto);
                productoCantidad.setId(item.Id);
                productoCantidad.setComentario(item.Comentario);
                return productoCantidad;
            });

            return productosCantidad;

            return "error"

        }
        catch (ex) {
            console.error('Error:', ex.message);
            throw ex;
        }




    }

    static async obtenerCantidadPorId(idProducto) {
        try {
            const producto = this.ProductosCantidad.find(p => p.IdProducto == idProducto);
            return producto ? producto.Cantidad : 0;

        } catch (ex) {
            console.error('Error:', ex.message);
            throw ex;
        }

    }

    static async agregarProducto(idProducto, cantidad) {
        try {


            const url = $("#URLAgregarProducto").val();
            const productoCantidad = new ProductoCantidad(idProducto, cantidad);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productoCantidad)
            });

            if (response.status == 400) {// lo dejamos de momento pero no deberia estar.
                return "El producto no existe.";
            }
            if (response.ok) {
                return "ok"
            }

            return "error"

        }
        catch (ex) {
            console.error('Error:', ex.message);
            throw ex;
        }

    }

    static async EliminarLinea(id) {
        try {


            const url = $("#URLEliminarLinea").val();

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(id)
            });

            if (response.status == 400) {// lo dejamos de momento pero no deberia estar.
                return "La linea no existe";
            }
            if (response.ok) {
                return "ok"
            }

            return "error"

        }
        catch (ex) {
            console.error('Error:', ex.message);
            throw ex;
        }
    }
}
