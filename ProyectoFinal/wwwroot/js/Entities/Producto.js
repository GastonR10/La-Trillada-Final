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

            if (response.status != 200) {
                return response;
            }

            const data = await response.json();

            const producto = new Producto(data.Id, data.Nombre, data.Descripcion, data.Foto, data.IdTipoProducto, data.Precio, data.Activo, data.Eliminado);

            return producto;


        } catch (ex) {
            throw ex;
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
            throw ex;
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

            if (response.status != 200) {
                return null;
            }

            const data = await response.json();

            const productos = data.map(item => new Producto(item.Id, item.Nombre, item.Descripcion, item.Foto, item.IdTipoProducto, item.Precio, item.Activo, item.Eliminado));

            return productos;

        } catch (ex) {
            throw ex;
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

            if (response.status != 200) {
                return null;
            }

            const data = await response.json();

            const productos = data.map(item => new Producto(item.Id, item.Nombre, item.Descripcion, item.Foto, item.IdTipoProducto, item.Precio, item.Activo, item.Eliminado));

            return productos;

        } catch (ex) {
            throw ex;
        }
    }

    static async UpdateActivo(productId, isActive) {
        try {
            const url = $("#URLActivarDesactivarProducto").val();

            const formData = new FormData();
            formData.append('Id', productId);
            formData.append('Activo', isActive);

            //const producto = new Producto(productId, null, null, null, 0, 0, isActive, false);

            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });
                     
            return response;

        } catch (ex) {
            throw ex;
        }

    }

    static async UpdateEliminar(productId) {
        try {
            const url = $("#URLEliminarProducto").val();

            const formData = new FormData();
            formData.append('Id', productId);
            formData.append('Activo', false);
            formData.append('Eliminado', true);

            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });

            return response;

        } catch (ex) {
            throw ex;
        }

    }

    static async editarProducto(producto) {
        try {
            const url = $("#URLUpdateProducto").val();

            //let fotoString = "";
            const formData = new FormData();
            let fileName = null;

            formData.append('Id', producto.Id);
            formData.append('Nombre', producto.Nombre);
            formData.append('Descripcion', producto.Descripcion);
            formData.append('IdTipoProducto', producto.IdTipoProducto);
            formData.append('Precio', producto.Precio);
            formData.append('Activo', producto.Activo);
            formData.append('Eliminado', false);

            //formData.append('Foto', producto.Foto);
            formData.append('fotoNueva', producto.Foto);
            //formData.append('Foto', fotoString);

            if (producto.Foto != null) {
                const randomInt = Math.floor(Math.random() * 1000000);
                const fileExtension = producto.Foto.name.match(/\.([^.]+)$/)[1];
                fileName = `${producto.Nombre}${randomInt}.${fileExtension}`;
                const fotoStringNueva = `/img/product/${fileName}`;
                formData.append('Foto', fotoStringNueva);
            }

            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            return response;

        } catch (ex) {
            throw ex;
        }

    }

    //static async ObtenerProductosIds(arrayIds) {

    //    try {
    //        const url = $("#URLGetProductIds").val();

    //        const response = await fetch(url, {
    //            method: 'POST',
    //            headers: {
    //                'Content-Type': 'application/json'
    //            },
    //            body: JSON.stringify(arrayIds)               
    //        });

    //        if (response.badRequest) {
    //            throw new Error(`Error en la solicitud: ${response.statusText}`);
    //        }

    //        const data = await response.json();

    //        const productos = data.map(item => new Producto(item.Id, item.Nombre, item.Descripcion, item.Foto, item.IdTipoProducto, item.Precio, item.Activo, item.Eliminado));

    //        return productos;

    //    } catch (error) {
    //        console.error('Error fetching products:', error);
    //    }
    //}

    /* return arrayIds.map(id => new Producto(id, `Producto ${id}`, `Descripción del producto ${id}`, null, 1, 100 + id, true, false));*/

}