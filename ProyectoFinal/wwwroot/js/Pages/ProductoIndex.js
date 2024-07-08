$(document).ready(async function () {
    // Código a ejecutar cuando el DOM esté listo
    await getTiposProducto();
});

async function getTiposProducto() {
    try {
        let res = await TipoProducto.getTiposProducto();

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

        let respuesta = await Producto.AltaProducto(nombre, desc, foto, tipoId, precio, true, false);

        if (respuesta.status == 200) {
            let msj = document.getElementById('lblMensaje');
            msj.textContent = "Alta exitosa!.";
            let divMsj = document.getElementById('divMsj');
            divMsj.style.display = 'block';
            $("#nombreProducto").val("");
            $("#descripcionProducto").val("");
            $("#fotoProducto").val("");
            $("#slcTipoProducto").val("0");
            $("#precioProducto").val("");
        }
    } catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
    }
}