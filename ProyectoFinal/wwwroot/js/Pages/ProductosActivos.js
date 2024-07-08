$(document).ready(async function () {
    // C�digo a ejecutar cuando el DOM est� listo
    await obtenerProductosActivos();
});

async function obtenerProductosActivos() {
    try {
        let productos = await Producto.getProductosActivos();
        let tiposProd = await TipoProducto.getTiposProducto();

        const container = document.getElementById('productosContainer');

        tiposProd.forEach(tipo => {
            const productosPorTipo = productos.filter(p => p.IdTipoProducto === tipo.Id);
            if (productosPorTipo.length > 0) {

                const groupContainer = document.createElement('div');
                groupContainer.innerHTML = `<h2>${tipo.Descripcion}</h2>`;

                // Crea un contenedor de fila
                const row = document.createElement('div');
                row.className = 'row';

                productosPorTipo.forEach(producto => {
                    const card = document.createElement('div');
                    card.className = 'col-xl-3 col-md-4 mb-4';
                    card.innerHTML = `
                        <div class="card">
                                                         ${producto.Foto ?
                            `<img src="${producto.Foto}" class="card-img-top" alt="${producto.Nombre}">` :
                            `<img src="/img/product/error.png" class="card-img-top" alt="${producto.Nombre}">`}  
                        <div class="card-body">
                        <h5 class="card-title">${producto.Nombre}</h5>
                        <p class="card-text">${producto.Descripcion}</p>
                        <p class="card-text"><strong>Precio:</strong> $${producto.Precio}</p>
                        </div>
                        <div class="card-footer">
                        <div class="input-group">
                        <div class="input-group-prepend">
                        <button class="btn btn-outline-secondary btn-cantidad" type="button" data-action="decrement" data-producto-id="${producto.Id}">-</button>
                        </div>
                        <input type="number" class="form-control cantidad-input" value="1" min="1">
                        <div class="input-group-append">
                        <button class="btn btn-outline-secondary btn-cantidad" type="button" data-action="increment" data-producto-id="${producto.Id}">+</button>
                        </div>
                        </div>
                        <button class="btn btn-primary btn-agregar-carrito mt-2" data-producto-id="${producto.Id}">Agregar al carrito</button>
                        </div>
                        </div>
                                        `;

                    row.appendChild(card);
                });

                groupContainer.appendChild(row);
                container.appendChild(groupContainer);
            }


        });
        container.querySelectorAll('.btn-cantidad').forEach(btn => {
            btn.addEventListener('click', function () {
                let action = this.getAttribute('data-action');
                let input = this.parentElement.parentElement.querySelector('.cantidad-input');
                let currentValue = parseInt(input.value);

                if (action === 'increment') {
                    input.value = currentValue + 1;
                } else if (action === 'decrement' && currentValue > 1) {
                    input.value = currentValue - 1;
                }
            });
        });

        container.addEventListener('click', async function (event) {
            if (event.target.classList.contains('btn-agregar-carrito')) {
                const productoId = event.target.getAttribute('data-producto-id');
                const cantidadInput = event.target.closest('.card').querySelector('.cantidad-input');
                const cantidad = parseInt(cantidadInput.value);
                await Carrito.agregarProducto(productoId, cantidad);
                console.log(_carrito.ProductosCantidad); // Para verificar

                // Reiniciar el campo de cantidad a 1
                cantidadInput.value = 1;
            }
        });

    }
    catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
    }
}