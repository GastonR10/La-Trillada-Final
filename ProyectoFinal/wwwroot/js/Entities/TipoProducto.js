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
            console.error('Error al agregar el producto:', ex.error);
            throw ex.error;
        }
    }

    static async Ordenar(cambios) {
        try {
            // Aquí debes enviar los datos modificados al servidor para que se guarden los cambios
            const url = $("#URLOrdenar").val(); // Suponiendo que tienes un endpoint para guardar los cambios
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cambios)
            });

            if (!response.ok) {
                throw new Error(`Error al guardar los cambios: ${response.statusText}`);
            }

            return response;

        } catch (ex) {
            console.error('Error al agregar el producto:', ex.error);
            throw ex.error;
        }
    }

    static async AgregarTipo(desc) {
        try {
            const url = $("#URLAgregar").val(); // Suponiendo que tienes un endpoint para guardar los cambios
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ Descripcion: desc })
            });

            return response;


        } catch (ex) {
            console.error('Error al agregar el producto:', ex.message);
            throw ex.message;
        }
    }

    static async Eliminar(Id) {
        try {
            const url = `${$("#URLEliminar").val()}/${Id}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response;


        } catch (ex) {
            console.error('Error al eliminar el producto:', ex.message);
            throw ex.message;
        }
    }
}

