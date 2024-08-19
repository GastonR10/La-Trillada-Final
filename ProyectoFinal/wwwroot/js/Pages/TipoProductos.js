$(document).ready(async function () {
    showLoader();

    // Obtener y mostrar los tipos de productos existentes
    await iniciarVista();
       
    hideLoader();
});

async function iniciarVista() {
    // Obtener y mostrar los tipos de productos existentes
    await obtenerTipoProductos();

    // Inicializar Sortable.js en la lista
    const sortable = new Sortable(document.getElementById('listaTiposProducto'), {
        animation: 150,
    });

    // Manejar el evento de clic del botón para agregar un nuevo tipo de producto
    //$('#btnAgregarTipoProducto').click(function () {
    //    const descripcion = $('#nuevoTipoProducto').val().trim();
    //    if (descripcion) {
    //        agregarTipoProducto(descripcion);
    //    } else {
    //        Tools.Toast('error', 'La descripción no puede estar vacía');
    //    }
    //});

    // Manejar el evento de clic para guardar los cambios
    $('#btnGuardarCambios').click(async function () {
        await guardarCambios(sortable.toArray());
    });
}

async function obtenerTipoProductos() {
    try {
        const tiposProd = await TipoProducto.getTiposProducto();
        const lista = $('#listaTiposProducto');
        lista.empty();

        // Mostrar los tipos de productos en la lista con un atributo data-id para identificar
        tiposProd.forEach(tipo => {
            lista.append(`
                <li class="list-group-item" data-id="${tipo.Id}">
                    ${tipo.Descripcion}
                </li>
            `);
        });
    } catch (ex) {
        Tools.Toast('Error inesperado, contacte al administrador', 'error');
        throw ex;
    }
}

async function agregarTipoProducto() {
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
            Tools.Toast("No todos los datos son correctos", 'warning');
        }
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
            Tools.Toast(res.statusText, 'error');
        }

        
    } catch (ex) {
        Tools.Toast('Error inesperado, contacte al administrador', 'error');
        throw ex;
    }
}

