class Producto {
    constructor(nombre, descripcion, foto, idTipoProducto) {
        this.Nombre = nombre;
        this.Descripcion = descripcion;
        this.Foto = foto;
        this.IdTipoProducto = idTipoProducto;
    }


    static async AltaProducto(nombre, descripcion, foto, idTipoProducto) {
        try {
            const url = $("#URLCreateProducto").val();
            const producto = new Producto(nombre, descripcion, foto, idTipoProducto);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(producto)
            });

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }
         
            return response;

        } catch (ex) {
            console.error('Error al agregar el producto:', error);
            throw error; 
        }
    }
}