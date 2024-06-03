
async function AgregarProducto() {
    let nombre = $("#nombreProducto").val();
    let desc = "";
    let foto = "";
    let tipoId = 1; //hacer referencia al value del select y cargar el select.

    let respuesta = await Producto.AltaProducto(nombre, desc, foto, tipoId);

    if (respuesta.status == 200) {
        let msj = document.getElementById('lblMensaje');
        msj.textContent = "Alta exitosa!.";
        let divMsj = document.getElementById('divMsj');
        divMsj.style.display = 'block';
    }
}