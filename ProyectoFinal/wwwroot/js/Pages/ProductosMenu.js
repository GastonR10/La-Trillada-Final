$(document).ready(async function () {
    showLoader();
   
    // Código a ejecutar cuando el DOM esté listo
    await obtenerProductosMenu();

    hideLoader();
});

async function obtenerProductosMenu() {
    try {
        let productos = await Producto.getProductosActivos();
        let tiposProd = await TipoProducto.getTiposProducto();

        const container = document.getElementById('productosMenuContainer');
        container.innerHTML = '';

        tiposProd.forEach(tipo => {
            const productosPorTipo = productos.filter(p => p.IdTipoProducto === tipo.Id);
            if (productosPorTipo.length > 0) {

                const tipoSection = document.createElement('section');
                tipoSection.className = 'menu-section';

                const tipoHeader = document.createElement('h2');
                tipoHeader.textContent = tipo.Descripcion;
                tipoSection.appendChild(tipoHeader);

                productosPorTipo.forEach(producto => {
                    const itemContainer = document.createElement('div');
                    itemContainer.className = 'menu-item';

                    const itemHeader = document.createElement('div');
                    itemHeader.className = 'item-header';

                    const nombre = document.createElement('h3');
                    nombre.textContent = producto.Nombre;

                    const precio = document.createElement('span');
                    precio.className = 'menu-price';
                    precio.textContent = `$${producto.Precio}`;

                    itemHeader.appendChild(nombre);
                    itemHeader.appendChild(precio);

                    const descripcion = document.createElement('p');
                    descripcion.textContent = producto.Descripcion;

                    itemContainer.appendChild(itemHeader);
                    itemContainer.appendChild(descripcion);

                    tipoSection.appendChild(itemContainer);
                });

                container.appendChild(tipoSection);
            }
        });

    } catch (ex) {
        Tools.Toast('Error inesperado, contacte al administrador', 'error');
    }
}