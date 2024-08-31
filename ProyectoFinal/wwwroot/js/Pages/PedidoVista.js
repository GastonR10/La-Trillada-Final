let _idPedido;

$(document).ready(async function () {
    // Código a ejecutar cuando el DOM esté listo
    await cargarPedido();
});

async function cargarPedido() {
    try {
        showLoader();
        const parts = window.location.pathname.split('/');
        const id = parts.pop();

        _idPedido = id;
        let pedido = await Pedido.getPedido(id);

        if (pedido.status == 500) {
            Tools.Toast('Error inesperado, contacte al administrador', 'error');
            return;
        }
        if (pedido.status == 404) {
            let msj = await pedidos.text();
            Tools.Toast(msj, 'warning');
            return;
        }

        const titulo = document.getElementById('titulo');
        const nombre = document.getElementById('nombreCliente');
        const direccion = document.getElementById('direccionCliente');
        const divDireccion = document.getElementById('divDireccion');
        const mesa = document.getElementById('mesaCliente');
        const divMesa = document.getElementById('divMesa');
        const tel = document.getElementById('telefonoCliente');        
        const metodoPago = document.getElementById('metodoPago');
        const estado = document.getElementById('estadoPedido');
        const comentario = document.getElementById('comentarioPedido');
        const listaProd = document.getElementById('divProdList');

        titulo.innerText = `PEDIDO N° ${pedido.Id}`
        nombre.innerText = pedido.Nombre;
        direccion.innerText = pedido.Direccion;
        mesa.innerText = "" + pedido.IdMesa;
        tel.innerText = pedido.Telefono;
        pedido.Pos ? metodoPago.innerText = "POS" : metodoPago.innerText = "Efectivo"
        estado.innerText = pedido.Estado;
        comentario.innerText = pedido.Comentario;

        if (pedido.IdMesa == 0) {
            divDireccion.style.display = "block";
        } else {
            divMesa.style.display = "block";
        }



        // Crear la tabla
        const table = document.createElement('table');
        table.className = 'table table-striped';

        // Crear la cabecera de la tabla
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['', 'Nombre', 'Cantidad', 'Precio', 'Comentario', 'Total Producto'].forEach(text => {
            const th = document.createElement('th');
            th.innerText = text;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Crear el cuerpo de la tabla
        const tbody = document.createElement('tbody');

        //let total = 0;
        pedido.Carrito.ProductosCantidad.forEach(producto => {
            const row = document.createElement('tr');

            const cellFoto = document.createElement('td');
            const img = document.createElement('img');
            img.src = producto.Producto.Foto || 'default.jpg';
            img.alt = producto.Producto.Nombre;
            img.width = 50; 
            img.height = 50; 
            cellFoto.appendChild(img);

            const cellNombre = document.createElement('td');
            cellNombre.innerText = producto.Producto.Nombre;

            const cellCantidad = document.createElement('td');
            cellCantidad.innerText = producto.Cantidad;

            const cellPrecio = document.createElement('td');
            cellPrecio.innerText = producto.Producto.Precio.toFixed(2);

            const cellComentario = document.createElement('td');
            cellComentario.innerText = producto.Comentario || ' - ';

            const cellTotalProducto = document.createElement('td');
            const totalProducto = producto.Cantidad * producto.Producto.Precio;
            cellTotalProducto.innerText = totalProducto.toFixed(2);

            row.appendChild(cellFoto);
            row.appendChild(cellNombre);
            row.appendChild(cellCantidad);
            row.appendChild(cellPrecio);
            row.appendChild(cellComentario);
            row.appendChild(cellTotalProducto);

            tbody.appendChild(row);

            //total += totalProducto;
        });

        // Agregar fila para el total
        const totalRow = document.createElement('tr');
        const totalCell = document.createElement('td');
        totalCell.setAttribute('colspan', '5');
        totalCell.innerHTML = '<strong>Total</strong>';
        const totalValueCell = document.createElement('td');
        totalValueCell.innerHTML = '<strong>' + pedido.Carrito.PrecioTotal.toFixed(2) + '</strong>';
        totalRow.appendChild(totalCell);
        totalRow.appendChild(totalValueCell);
        tbody.appendChild(totalRow);

        table.appendChild(tbody);

        // Añadir la tabla al divProdList
        listaProd.innerHTML = ''; // Limpiar cualquier contenido previo
        listaProd.appendChild(table);


        //Botones
        const btnEstado = document.getElementById('btnEstado');
        const btnCancelar = document.getElementById('btnCancelar');
        const btnVolver = document.getElementById('btnVolver');

        btnEstado.onclick = async function () {
            await actualizarEstadoPedido(_idPedido, pedido.Estado); // Reemplaza _idPedido con el ID del pedido
        };

        btnCancelar.onclick = async function () {
            showLoader();
            await cancelarPedido(_idPedido); // Reemplaza _idPedido con el ID del pedido
            hideLoader();
        };

        btnVolver.onclick = function () {
            volver(0);
        };

        switch (pedido.Estado) {
            case 'Pendiente':
                btnEstado.textContent = 'Aceptar';
                break;
            case 'EnPreparacion':
                btnEstado.textContent = 'En camino';
                break;
            case 'EnCamino':
                btnEstado.textContent = 'Finalizar';
                break;
            case 'Finalizado':
                btnCancelar.style.display = "none";
                btnEstado.style.display = "none";
                btnVolver.onclick = function () {
                    volver(1);
                };
            default:
                // Manejar el caso donde el estado no coincide con ninguno de los valores anteriores
                btnEstado.textContent = 'Desconocido';
                break;
        }
        hideLoader();

    } catch (ex) {
        throw ex;
    }

    async function actualizarEstadoPedido(id, estado) {
        try {
            let confirmacion = await asyncConfirm(`¿Está seguro?`);

            if (confirmacion) {
                showLoader();
                await Pedido.actualizarEstadoPedido(id);

                await cargarPedido();

                let mensaje = "";
                if (estado == 'Pendiente') {
                    mensaje = "El pedido " + id + " fue enviado a preparacion";
                } else if (estado == 'EnPreparacion') {
                    mensaje = "El pedido " + id + " fue colocado en camino";
                } else if (estado == 'EnCamino') {
                    mensaje = "El pedido " + id + " fue finalizado con exito";
                }
                hideLoader();
                Tools.Toast(mensaje, 'success')
            }

        } catch (ex) {
            throw ex;
        }
    }

    async function cancelarPedido(id) {
        try {
            
            let confirmacion = await asyncConfirm(`¿Está seguro que desea cancelar?`);

            if (confirmacion) {
                showLoader();
                const res = await Pedido.cancelarPedido(id);

                if (res.status == 500) {
                    Tools.Toast("Error inesperado, contacte a su administrador", 'error');
                    hideLoader();
                    return;
                }

                if (res.status == 404) {
                    Tools.Toast("Problemas buscando el pedido.", 'warning');
                    hideLoader();
                    return;
                }

                if (res.status == 200) {
                    await cargarPedido();
                    Tools.Toast('El pedido ' + id + ' fue cancelado con exito', 'success');
                    hideLoader();
                    return;
                }
                hideLoader();
            }

        } catch (ex) {
            throw ex;
        }
        
    }

    function volver(finalizado) {
        try {
            if (finalizado) {
                let redirectUrl = $("#URLPedidosFinalizados").val();
                window.location.href = redirectUrl;

            } else {
                let redirectUrl = $("#URLAdministracionPedidos").val();
                window.location.href = redirectUrl;
            }
            
        } catch (ex) {
            throw ex;
        }

    }
}