class ProductoCantidad {
    constructor(idProducto, cantidad) {
        this.IdProducto = idProducto;
        this.Cantidad = cantidad;
        this.Producto = null;
        this.Id = 0;
    }
    setProducto(producto) {
        this.Producto = producto;
    }
    setId(id) {
        this.Id = id;
    }

}