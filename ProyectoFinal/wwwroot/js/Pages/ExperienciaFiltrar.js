let _ordenAscendente = false;
$(document).ready(async function () {
    await FiltrarExperiencias();
});

async function FiltrarExperiencias() {
    try {
        showLoader();
        const fechaInicio = $('#fechaInicio').val();
        const fechaFin = $('#fechaFin').val();
        const calificacion = $('#calificacionFiltro').val();

        const res = await Experiencia.FiltrarComentarios(fechaInicio, fechaFin, calificacion);

        // Guardar los comentarios en el DOM
        RenderizarComentarios(res);

        hideLoader();
    } catch (ex) {
        await handleError(ex);
        Tools.Toast('Error inesperado, contacte al administrador', 'error');
    }

}

function RenderizarComentarios(comentarios) {
    const comentariosList = $('#comentariosList');
    comentariosList.empty();

    comentarios.forEach(c => {
        comentariosList.append(`<div class="comentario-item" data-calificacion="${c.Calificacion}"><strong>Usuario:</strong> ${c.NombreUsuario}<br><strong>Calificación:</strong> ${c.Calificacion}<br><strong>Fecha:</strong> ${new Date(c.Fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}<br><strong>Comentario:</strong> ${c.Comentario}</div><hr>`);
    });
}

function OrdenarPorCalificacion() {
    const comentariosList = $('#comentariosList');
    const comentarios = comentariosList.children('.comentario-item').get();

    // Ordenar los elementos por calificación
    comentarios.sort((a, b) => {
        const calificacionA = parseFloat($(a).data('calificacion'));
        const calificacionB = parseFloat($(b).data('calificacion'));
        return _ordenAscendente ? calificacionA - calificacionB : calificacionB - calificacionA;
    });

    // Vaciar y volver a agregar los elementos ordenados
    comentariosList.empty();
    comentarios.forEach(item => comentariosList.append(item));

    

    const btnOrdenar = $('#btnOrdenar');
    const icono = btnOrdenar.find('i');

    icono.removeClass('fa-sort fa-sort-down fa-sort-up'); // Remueve todas las posibles clases
    icono.addClass(_ordenAscendente ? 'fa-sort-up' : 'fa-sort-down');

    // Alternar el estado del orden
    _ordenAscendente = !_ordenAscendente;
}
