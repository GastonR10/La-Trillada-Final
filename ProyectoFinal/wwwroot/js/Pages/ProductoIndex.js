$(document).ready(async function () {
    showLoader();
    // Código a ejecutar cuando el DOM esté listo
    await getTiposProducto();
    hideLoader();
});

async function getTiposProducto() {
    try {
        let res = await TipoProducto.getTiposProducto();
        if (res == null) {
            Tools.Toast('Error buscando los tipos.', 'warning');
            return;
        }

        const selectElement = document.getElementById('slcTipoProducto');

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
        await handleError(ex);
        Tools.Toast('Error inesperado, contacte al administrador', 'error');
    }
}

async function AgregarProducto() {
    try {
        let nombre = $("#nombreProducto").val();
        let desc = $("#descripcionProducto").val();
        let foto = $("#fotoProducto")[0].files[0];
        let tipoId = $("#slcTipoProducto").val(); //hacer referencia al value del select y cargar el select.
        let precio = $("#precioProducto").val();

        let mensaje = "";
        if (nombre == "") {
            mensaje += `- Nombre no puede ser vacío.<br>`;
        }
        if (tipoId == 0) {
            mensaje += `- Seleccione un tipo de producto.<br>`;
        }
        if (precio <= 0) {
            mensaje += `- Precio debe ser mayor a 0.<br>`;
        }
        if (mensaje != "") {
            Tools.Toast(mensaje, 'warning');
        }
        else {
            let respuesta = await Producto.AltaProducto(nombre, desc, foto, tipoId, precio, true, false);

            if (respuesta.status == 200) {
                Tools.Toast("Alta exitosa!", 'success');

                $("#nombreProducto").val("");
                $("#descripcionProducto").val("");
                $("#fotoProducto").val("");
                $("#slcTipoProducto").val("0");
                $("#precioProducto").val("");

            } else if (respuesta.status == 500) {
                Tools.Toast('Error inesperado, contacte al administrador', 'error');

            } else if (respuesta.status == 400) {
                Tools.Toast("No todos los datos son correctos", 'warning');
            }
        }        
        
    } catch (ex) {
        await handleError(ex);
        Tools.Toast('Error inesperado, contacte al administrador', 'error');
    }
}