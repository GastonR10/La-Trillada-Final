class ProductoCantidad {
    constructor(idProducto, cantidad) {
        this.IdProducto = idProducto;
        this.Cantidad = cantidad;
        this.Producto = null;
        this.Id = 0;
        this.Comentario = "";
        this.IdCarrito = 0;
    }
    setProducto(producto) {
        this.Producto = producto;
    }
    setId(id) {
        this.Id = id;
    }
    setComentario(com) {
        this.Comentario = com;
    }

    static async AgregarComentariosMasivo(duplas) {
        try {

            const url = $("#URLActualizarComentarios").val();

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(duplas)
            });

            if (response.status == 400) {
                return "Perdida de sesion.";
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