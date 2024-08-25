$(document).ready(async function () {
    try {
        if (sessionStorage.getItem('Logueado') === null) {
            // Si no existe, la crea y le asigna el valor "false"
            sessionStorage.setItem('Logueado', false);
        }

        if (localStorage.getItem('carrito') === null) {
            // Si no existe, lo crea y le asigna un array vacío
            localStorage.setItem('carrito', JSON.stringify([]));
        }

        //Mostrar toaster si entramos luego pedir
        const toastMessage = localStorage.getItem('toastMessage');
        const toastType = localStorage.getItem('toastType');
        if (toastMessage && toastType) {
            // Mostrar el toaster
            Tools.Toast(toastMessage, toastType);

            // Limpiar el almacenamiento local
            localStorage.removeItem('toastMessage');
            localStorage.removeItem('toastType');
        }

        // Ejecuta la lógica inicial al cargar la página
        await actualizarVista();

        // Agregar un listener para el evento popstate
        window.addEventListener('pageshow', async function (event) {
            await actualizarVista();
        });
    } catch (ex) {
        throw ex;
    }
});

// Función para actualizar la vista
async function actualizarVista() {
    try {
        showLoader();

        await obtenerProductosActivos();
        await mostrarTotalCarrito();

        hideLoader();
    }
    catch (ex) {
        await handleError(ex);
        Tools.Toast('Error inesperado, contacte al administrador', 'error');
    }

}

async function obtenerProductosActivos() {
    try {
        let productos = await Producto.getProductosActivos();
        if (productos.status == 500) {
            Tools.Toast('Error inesperado, contacte al administrador', 'error');
            return;
        }

        let tiposProd = await TipoProducto.getTiposProducto();
        if (tiposProd.status == 500) {
            Tools.Toast('Error inesperado, contacte al administrador', 'error');
            return;
        }
        const container = document.getElementById('productosContainer');
        container.innerHTML = ''; // Limpia el contenido previo

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
                        <p class="card-text" ><strong>Precio:</strong> $${producto.Precio}</p>
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

        // Asignar eventos de clic a los botones de agregar al carrito
        container.querySelectorAll('.btn-agregar-carrito').forEach(btn => {
            btn.addEventListener('click', async function (event) {
                showLoader();
                event.preventDefault();
                const productoId = this.getAttribute('data-producto-id');
                const cantidadInput = this.closest('.card').querySelector('.cantidad-input');
                const cantidad = parseInt(cantidadInput.value);

                if (cantidad > 0) {
                    if (sessionStorage.getItem('Logueado') == "true") {
                        const res = await Carrito.agregarProducto(productoId, cantidad);
                        if (res.status == 400) {
                            const msj = await res.text();
                            Tools.Toast(msj, 'warning');
                            hideLoader();
                            return;
                        }
                        if (res.status == 500) {
                            Tools.Toast("Error inesperado, contacte al administrador", 'error');
                            hideLoader();
                            return;
                        }

                    } else {
                        let carrito = JSON.parse(localStorage.getItem('carrito'));
                        if (!carrito) carrito = [];

                        // Encontrar el último ID usado en el carrito y calcular el siguiente
                        let ultimoId = carrito.length > 0 ? carrito[carrito.length - 1].Id : 0;
                        let nuevoId = ultimoId + 1;

                        // Obtener información del producto
                        const producto = productos.find(p => p.Id == productoId);

                        // Crear el objeto del producto a agregar
                        let productoCantidad = {
                            Id: nuevoId,
                            IdProducto: parseInt(productoId, 10),
                            Cantidad: cantidad,
                            Comentario: "",
                            Producto: {
                                Id: producto.Id,
                                Nombre: producto.Nombre,
                                Foto: producto.Foto,
                                Precio: producto.Precio
                            }
                        };

                        carrito.push(productoCantidad);
                        localStorage.setItem('carrito', JSON.stringify(carrito));
                    }

                    cantidadInput.value = 1;
                    await mostrarTotalCarrito();
                    Tools.Toast(`Producto agregado al carrito`, 'success')

                } else {
                    Tools.Toast("La cantidad debe ser mayor a 0", 'warning')
                }
                hideLoader();
            });
        });

    }
    catch (ex) {
        throw ex;
    }
}

async function mostrarTotalCarrito() {
    try {
        const seccionTotal = document.getElementById('footerTotal');
        const valorCarrito = document.getElementById('total-amount');
        let totalCarrito = 0;
        if (sessionStorage.getItem('Logueado') == "true") {

            totalCarrito = await Carrito.obtenerTotalCarrito();
            if (totalCarrito.status == 500) {
                Tools.Toast('Error inesperado, contacte al administrador', 'error');
                return;
            }
            if (totalCarrito.status == 400) {
                const msj = await totalCarrito.text();
                Tools.Toast(msj, 'warning');
                return;
            }

        } else {
            const carrito = JSON.parse(localStorage.getItem('carrito') || '[]'); // Convierte el string a un objeto JSON

            carrito.forEach(pc => {
                totalCarrito += pc.Cantidad * pc.Producto.Precio;
            })
        }

        if (totalCarrito > 0) {
            seccionTotal.style.display = 'block';
            valorCarrito.innerText = totalCarrito.toFixed(2);
        } else {
            seccionTotal.style.display = 'none';
        } 

    } catch (ex) {
        await handleError(ex);
        Tools.Toast('Error inesperado, contacte al administrador', 'error');
    }
       
}