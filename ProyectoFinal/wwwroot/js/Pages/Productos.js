document.addEventListener("DOMContentLoaded", function () {
    fetch('/TipoProducto/GetTiposProducto')
        .then(response => response.json())
        .then(data => {
            let select = document.getElementById("tipoProducto");
            data.forEach(tipo => {
                let option = document.createElement("option");
                option.value = tipo.id;
                option.text = tipo.nombre;
                select.add(option);
            });
        })
        .catch(error => console.error('Error:', error));
});

async function AgregarProducto() {
    let nombre = $("#nombreProducto").val();
    let desc = $("#descripcionProducto").val();
    let foto = "";
    let tipoId = $("#slcTipoProducto").val(); //hacer referencia al value del select y cargar el select.

    let respuesta = await Producto.AltaProducto(nombre, desc, foto, tipoId);

    if (respuesta.status == 200) {
        let msj = document.getElementById('lblMensaje');
        msj.textContent = "Alta exitosa!.";
        let divMsj = document.getElementById('divMsj');
        divMsj.style.display = 'block';
    }
}

