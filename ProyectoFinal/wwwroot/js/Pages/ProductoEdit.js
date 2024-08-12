let _idProducto;

$(document).ready(async function () {
    showLoader();
    // Código a ejecutar cuando el DOM esté listo
    await obtenerProducto();

    hideLoader();
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
        activo.checked = producto.Activo;
        img.src = producto.Foto || "/img/product/error.png";
        await getTiposProducto();
        tipo.value = producto.IdTipoProducto;
        img.alt = producto.Nombre;


    } catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
    }
}

async function getTiposProducto() {
    try {
        let res = await TipoProducto.getTiposProducto();

        const selectElement = document.getElementById('productoTipo');

        // Crear y añadir la opción predeterminada
        const defaultOption = document.createElement('option');
        defaultOption.value = '0';
        defaultOption.text = '-- Seleccionar --';
        selectElement.appendChild(defaultOption);

        // Añadir las opciones obtenidas del servidor
        res.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo.Id;
            option.text = tipo.Descripcion;
            selectElement.appendChild(option);
        });


    } catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
    }
}

async function editarProducto() {
    try {
        const nombre = $("#productoNombre").val();
        const desc = $("#productoDescripcion").val();
        const precio = $("#productoPrecio").val();
        const tipo = $("#productoTipo").val();
        const activo = $("#productoActivo").prop('checked');
        const fotoNueva = $("#fotoNueva")[0].files[0];

        //const img = $("#productoImg")[0].files[0];

        const producto = new Producto(_idProducto, nombre, desc, fotoNueva, tipo, precio, activo, 0);

        //const fotoString = document.getElementById('productoImg').getAttribute('src');

        let res = await Producto.editarProducto(producto);

        if (!res.ok) {
            throw new Error('Failed to edit product');
        }
        
        await obtenerProducto();
        
        Tools.Toast('Producto editado con exito', 'success');

    } catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
    }
}

function volverListaProducto() {
    try {

        let redirectUrl = $("#URLProductosList").val();
        window.location.href = redirectUrl;

    } catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
    }
}

async function eliminarProducto() {
    try {
        let confirmacion = confirm(`¿Estás seguro de que deseas eliminar el producto?`);

        if (confirmacion) {
            // Lógica para eliminar el elemento
            let res = await Producto.UpdateEliminar(_idProducto);

            if (!res.ok) {
                throw new Error('Failed to update product status');
            }
            
            //Guardo variables para mostrar toaster luego de cambio de vista
            localStorage.setItem('toastMessage', 'Elemento eliminado con exito');
            localStorage.setItem('toastType', 'success');

            let redirectUrl = $("#URLProductosList").val();
            window.location.href = redirectUrl;

            
            
        } else {
            //alert("Eliminación cancelada");
            Tools.Toast("Eliminacion cancelada", 'error')
        }


    } catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
    }
}