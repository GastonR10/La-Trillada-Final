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
        await getTiposProducto();

        if (producto == null) {
            Tools.Toast('No se encontró producto en base de datos.', 'warning');
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
        img.alt = producto.Nombre;
        tipo.value = producto.IdTipoProducto;

    } catch (ex) {
        Tools.Toast('Error inesperado, contacte al administrador', 'error');
    }
}

async function getTiposProducto() {
    try {
        let res = await TipoProducto.getTiposProducto();
        if (res == null) {
            Tools.Toast('Error buscando los tipos.', 'warning');
            return;
        }

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

        let mensaje = "";
        if (nombre == "") {
            mensaje += `- Nombre no puede ser vacío.<br>`;
        }
        if (tipo == 0) {
            mensaje += `- Seleccione un tipo de producto.<br>`;
        }
        if (precio <= 0) {
            mensaje += `- Precio debe ser mayor a 0.<br>`;
        }
        if (mensaje != "") {
            Tools.Toast(mensaje, 'warning');
            return;
        }

        const producto = new Producto(_idProducto, nombre, desc, fotoNueva, tipo, precio, activo, 0);

        let res = await Producto.editarProducto(producto);

        if (res.status == 200) {
            Tools.Toast('Producto editado con exito', 'success');
            await obtenerProducto();

        } else if (res.status == 500) {
            Tools.Toast('Error inesperado, contacte al administrador', 'error');

        } else if (res.status == 400) {
            Tools.Toast("No todos los datos son correctos", 'warning');
        }

    } catch (ex) {
        Tools.Toast('Error inesperado, contacte al administrador', 'error');
    }
}

function volverListaProducto() {
    try {

        let redirectUrl = $("#URLProductosList").val();
        window.location.href = redirectUrl;

    } catch (ex) {
        Tools.Toast('Error inesperado, contacte al administrador', 'error');
    }
}

async function eliminarProducto() {
    try {
        let confirmacion = await asyncConfirm(`¿Estás seguro de que deseas eliminar el producto?`);

        if (confirmacion) {
            // Lógica para eliminar el elemento
            let res = await Producto.UpdateEliminar(_idProducto);

            if (res.status == 200) {
                //Guardo variables para mostrar toaster luego de cambio de vista
                localStorage.setItem('toastMessage', 'Elemento eliminado con exito');
                localStorage.setItem('toastType', 'success');

                let redirectUrl = $("#URLProductosList").val();
                window.location.href = redirectUrl;

            } else if (res.status == 500) {
                Tools.Toast('Error inesperado, contacte al administrador', 'error');

            } else if (res.status == 404) {
                Tools.Toast("Producto no existe.", 'warning');
            }

        }

    } catch (ex) {
        Tools.Toast('Error inesperado, contacte al administrador', 'error');
    }
}