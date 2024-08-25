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

        const comentariosList = $('#comentariosList');
        comentariosList.empty();

        res.forEach(c => {
            comentariosList.append(`<div><strong>Usuario:</strong> ${c.NombreUsuario}<br><strong>Calificación:</strong> ${c.Calificacion}<br><strong>Fecha:</strong> ${new Date(c.Fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}<br><strong>Comentario:</strong> ${c.Comentario}</div><hr>`);
        });
        hideLoader();
    } catch (ex) {
        await handleError(ex);
        Tools.Toast('Error inesperado, contacte al administrador', 'error');
    }

}