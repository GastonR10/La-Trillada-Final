$(document).ready(async function () {
    showLoader();
    // C�digo a ejecutar cuando el DOM est� listo
    await getTiposProducto();
    hideLoader();
});

async function getTiposProducto() {
    try {
        let res = await TipoProducto.getTiposProducto();

        const selectElement = document.getElementById('slcTipoProducto');

        // Crear y a�adir la opci�n predeterminada
        const defaultOption = document.createElement('option');
        defaultOption.value = '0';
        defaultOption.text = '-- Seleccionar --';
        selectElement.appendChild(defaultOption);

        // A�adir las opciones obtenidas del servidor
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

async function AgregarProducto() {
    try {
        let nombre = $("#nombreProducto").val();
        let desc = $("#descripcionProducto").val();
        let foto = $("#fotoProducto")[0].files[0];
        let tipoId = $("#slcTipoProducto").val(); //hacer referencia al value del select y cargar el select.
        let precio = $("#precioProducto").val();

        let mensaje = "";
        if (nombre == "") {
            mensaje += `- Nombre no puede ser vac�o.<br>`;
        }
        if (tipoId == 0) {
            mensaje += `- Seleccione un tipo de producto.<br>`;
        }
        if (precio == 0) {
            mensaje += `- Precio no puede ser vac�o.<br>`;
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
        Tools.Toast('Error inesperado, contacte al administrador', 'error');
        throw ex;
    }
}