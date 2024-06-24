class Producto {
    constructor(id, nombre, descripcion, foto, idTipoProducto, precio, activo, eliminado) {
        this.Id = id;
        this.Nombre = nombre;
        this.Descripcion = descripcion;
        this.Foto = foto;
        this.IdTipoProducto = idTipoProducto;
        this.Precio = precio;
        this.Activo = activo;
        this.Eliminado = eliminado;
    }

    static async getProducto(id) {
        try {
            let url = $("#URLGetProducto").val();

            url = url + "/" + id

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

            const producto = new Producto(data.Id, data.Nombre, data.Descripcion, data.Foto, data.IdTipoProducto, data.Precio, data.Activo, data.Eliminado);

            return producto;


        } catch (ex) {
            console.error('Error al agregar el producto:', error);
            throw error;
        }
    }

    static async AltaProducto(nombre, descripcion, foto, idTipoProducto, precio, activo, eliminado) {
        try {
            const url = $("#URLCreateProducto").val();

            let fotoString = "";
            const formData = new FormData();
            let fileName = null;

            formData.append('Id', 0);
            formData.append('Nombre', nombre);
            formData.append('Descripcion', descripcion);
            formData.append('IdTipoProducto', idTipoProducto);
            formData.append('Precio', precio);
            formData.append('Activo', activo);
            formData.append('Eliminado', eliminado);

            if (foto != null) {
                const randomInt = Math.floor(Math.random() * 1000000);
                const fileExtension = foto.name.match(/\.([^.]+)$/)[1];
                fileName = `${nombre}${randomInt}.${fileExtension}`;
                fotoString = `/img/product/${fileName}`;
            }

            formData.append('file', foto);
            formData.append('fileName', fileName);
            formData.append('Foto', fotoString);

            const res = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }

            return res;

        } catch (ex) {
            console.error('Error al agregar el producto:', error);
            throw error;
        }
    }

    static async getProductosActivos() {
        try {
            const url = $("#URLGetProductosActivos").val();

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

            const productos = data.map(item => new Producto(item.Id, item.Nombre, item.Descripcion, item.Foto, item.IdTipoProducto, item.Precio, item.Activo, item.Eliminado));

            return productos;

        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    static async getProductosList() {
        try {
            const url = $("#URLGetProductosList").val();

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

            const productos = data.map(item => new Producto(item.Id, item.Nombre, item.Descripcion, item.Foto, item.IdTipoProducto, item.Precio, item.Activo, item.Eliminado));

            return productos;

        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    static async UpdateActivo(productId, isActive) {
        try {
            const url = $("#URLUpdateProducto").val();

            const producto = new Producto(productId, null, null, null, 0, 0, isActive, false);

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(producto)
            });

            if (response.badRequest) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }

            return response;

        } catch (error) {
            console.error('Error fetching products:', error);
        }

    }

    static async UpdateEliminar(productId) {
        try {
            const url = $("#URLUpdateProducto").val();

            const producto = new Producto(productId, null, null, null, 0, 0, false, true);

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(producto)
            });

            if (response.badRequest) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }

            return response;

        } catch (error) {
            console.error('Error fetching products:', error);
        }

    }


}