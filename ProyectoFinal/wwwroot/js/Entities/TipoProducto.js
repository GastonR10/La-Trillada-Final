class TipoProducto {
    constructor(id, descripcion, orden) {
        this.Id = id;
        this.Descripcion = descripcion;
        this.Orden = orden;
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
            const tiposProducto = data.map(item => new TipoProducto(item.Id, item.Descripcion, 0));

            return tiposProducto;

        } catch (ex) {
            console.error('Error al agregar el producto:', error);
            throw error;
        }
    }
}

