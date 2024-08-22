$(document).ready(async function () {   

    await iniciarVista(); 
});

async function iniciarVista() {
    showLoader();
    
    await obtenerTipoProductos();

    // Inicializar Sortable.js en la lista
    const sortable = new Sortable(document.getElementById('listaTiposProducto'), {
        animation: 150,
    });

    $('#btnGuardarCambios').click(async function () {
        await guardarCambios(sortable.toArray());
    });
    hideLoader();
}

async function obtenerTipoProductos() {
    try {
        const tiposProd = await TipoProducto.getTiposProducto();
        if (tiposProd == null) {
            Tools.Toast('Error buscando los tipos.', 'warning');
            return;
        }
        const lista = $('#listaTiposProducto');
        lista.empty();

        // Mostrar los tipos de productos en la lista con un atributo data-id para identificar
        tiposProd.forEach(tipo => {
            lista.append(`
                <li class="list-group-item d-flex justify-content-between align-items-center" data-id="${tipo.Id}">
                    ${tipo.Descripcion}
                    <button class="btn btn-link btn-eliminar-tipo" data-index="${tipo.Id}" data-name="${tipo.Descripcion}"><i class="fa-solid fa-trash"></i></button>
                </li>
            `);
        });

        // Primero, elimina cualquier event listener previo
        $('#listaTiposProducto').off('click', '.btn-eliminar-tipo');

        // Añadir el event listener para el botón de eliminar
        $('#listaTiposProducto').on('click', '.btn-eliminar-tipo', async function (event) {
            const index = $(this).data('index');
            const name = $(this).data('name');
            await eliminarTipoPorId(index, name);
        });

    } catch (ex) {
        Tools.Toast('Error inesperado, contacte al administrador', 'error');
    }
}

async function agregarTipoProducto() {
    try {
        const descripcion = $('#nuevoTipoProducto').val();

        if (descripcion == "") {
            Tools.Toast("Ingrese nombre de tipo.", 'warning');

        } else {
            const res = await TipoProducto.AgregarTipo(descripcion);

            if (res.status == 200) {
                $('#nuevoTipoProducto').val(''); // Limpiar el input después de agregar
                await iniciarVista();
                Tools.Toast(`Tipo de producto ${descripcion} agregado con éxito`, 'success');
            } else if (respuesta.status == 500) {
                Tools.Toast('Error inesperado, contacte al administrador', 'error');

            } else if (respuesta.status == 400) {
                const msj = await respuesta.text();
                Tools.Toast(msj, 'warning');
            }
        }
    } catch (ex) {
        Tools.Toast('Error inesperado, contacte al administrador', 'error');
    }    
}

async function guardarCambios(ordenIds) {
    const cambios = ordenIds.map((id, index) => {
        return { Id: id, Orden: index + 1 }; // Asigna el nuevo orden basado en la posición
    });

    try {
        const res = await TipoProducto.Ordenar(cambios);

        if (res.status == 200) {
            Tools.Toast('Los cambios se han guardado correctamente', 'success');
        }

        if (res.status == 404) {
            let msj = await res.text();
            Tools.Toast(msj, 'error');
        }


    } catch (ex) {
        Tools.Toast('Error inesperado, contacte al administrador', 'error');
    }
}

async function eliminarTipoPorId(id, nombre) {
    try {
        const conf = await asyncConfirm(`seguro que desea eliminar el tipo de producto "${nombre}"`);

        if (conf) {
            const res = await TipoProducto.Eliminar(id);

            await iniciarVista();

            let msj = await res.text();

            if (res.status == 500) {
                Tools.Toast(msj, 'warning');
            }
            if (res.status == 400) {

                Tools.Toast(msj, 'warning');
            }
            if (res.status == 404) {

                Tools.Toast(msj, 'warning');
            }
            if (res.status == 200) {
                Tools.Toast('Tipo "' + nombre + '" eliminado correctamente', 'success');
            }
        }        

    } catch (ex) {
        Tools.Toast('Error inesperado, contacte al administrador', 'error');
    }
}

