let _idProducto;

$(document).ready(function () {
    // Código a ejecutar cuando el DOM esté listo
    obtenerProducto();
});

async function obtenerProducto() {
    try {

        const parts = window.location.pathname.split('/');
        const id = parts.pop();

        _idProducto = id;
        let producto = await Producto.getProducto(id);

        if (producto == null) {
            return;
        }

        const nombre = document.getElementById('productoNombre');
        const desc = document.getElementById('productoDescripcion');
        const precio = document.getElementById('productoPrecio');
        const tipo = document.getElementById('productoTipo');
        const activo = document.getElementById('productoActivo');
        const img = document.getElementById('productoImg');

        nombre.value = producto.Nombre;
        desc.value = producto.Descripcion;
        precio.value = producto.Precio;
        tipo.value = producto.IdTipoProducto;
        activo.checked = producto.Activo;
        img.src = producto.Foto;
        img.alt = producto.Nombre;


    } catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
    }
}

async function editarProducto(id) {
    try {

        let res = await Producto.getProducto(id);

        if (!res.ok) {
            throw new Error('Failed to update product status');
        }

    } catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
    }
}