$(document).ready(function () {
    // Código a ejecutar cuando el DOM esté listo
    obtenerProductos();
});


async function obtenerProductos() {
    try {
        let productos = await Producto.getProductosList();
        let tiposProd = await TipoProducto.getTiposProducto();

        const container = document.getElementById('tblProductos');
        container.innerHTML = '';

        tiposProd.forEach(tipo => {
            const productosPorTipo = productos.filter(p => p.IdTipoProducto === tipo.Id);
            if (productosPorTipo.length > 0) {

                const groupContainer = document.createElement('div');
                groupContainer.innerHTML = `<h2>${tipo.Descripcion}</h2>`;

                const table = document.createElement('table');
                table.className = 'table';

                const thead = document.createElement('thead');
                thead.innerHTML = `
                    <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Acciones</th>
                    </tr>
                                        `;
                table.appendChild(thead);

                const tbody = document.createElement('tbody');


                productosPorTipo.forEach(producto => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                    <td>${producto.Nombre}</td>
                    <td>$${producto.Precio}</td>
                    <td>
                    <button class="btn btn-warning" onclick="vistaEditarProducto(${producto.Id})">Editar</button>
                    <button class="btn btn-danger" onclick="eliminarProducto(${producto.Id})">Eliminar</button>
                    </td>
                    <td>
                    <label for="activo-${producto.Id}">Activo</label>
                    <input type="checkbox" ${producto.Activo ? 'checked' : ''} id="activo-${producto.Id}" onchange="activarDesactivar(${producto.Id}, this.checked);">
                    </td>
                        `;
                    tbody.appendChild(tr);
                });


                table.appendChild(tbody);
                groupContainer.appendChild(table);
                container.appendChild(groupContainer);
            }
        });

    } catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
    }
}

async function activarDesactivar(productId, isActive) {
    try {

        let res = await Producto.UpdateActivo(productId, isActive);

        if (!res.ok) {
            throw new Error('Failed to update product status');
        }

    } catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
    }
}

async function eliminarProducto(productId) {
    try {
        let confirmacion = confirm(`¿Estás seguro de que deseas eliminar el producto?`);

        if (confirmacion) {
            // Lógica para eliminar el elemento
            let res = await Producto.UpdateEliminar(productId);

            if (!res.ok) {
                throw new Error('Failed to update product status');
            }
            alert("Elemento eliminado");
            await obtenerProductos();

        } else {
            alert("Eliminación cancelada");
        }

    } catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
    }
}

function vistaEditarProducto(id) {
    try {

        let redirectUrl = $("#URLGetProductoVista").val();
        const urlWithId = `${redirectUrl}/${id}`;
        window.location.href = urlWithId;

    } catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
    }
}