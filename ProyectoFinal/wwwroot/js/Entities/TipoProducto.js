//function getTiposProducto() {
//    fetch('/TipoProducto/GetTiposProducto')
//        .then(response => response.json())
//        .then(data => {
//            let select = document.getElementById("tipoProducto");
//            data.forEach(tipo => {
//                let option = document.createElement("option");
//                option.value = tipo.id;
//                option.text = tipo.nombre;
//                select.add(option);
//            });
//        })
//        .catch(error => console.error('Error:', error));
//}

class TipoProducto {
    constructor(id, descripcion) {
        this.Id = id;
        this.Descripcion = descripcion;
    }

    static async getTiposProducto() {
        try {
            const url = $("#URLGetTiposProducto").val();

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.badRequest) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }

            const data = await response.json();

            // Crear instancias de TipoProducto con los datos obtenidos
            const tiposProducto = data.map(item => new TipoProducto(item.Id, item.Descripcion));

            return tiposProducto;

        } catch (ex) {
            console.error('Error al agregar el producto:', error);
            throw error;
        }
    }
}

