
$(document).ready(function () {
    $('#btnMostrarMenu').click(function (event) {
        $('#sidebar').toggleClass('visible');
        $('#mainContent').toggleClass('shifted');
        event.stopPropagation(); // Previene la propagación del evento click al documento
    });

    $(document).click(function (event) {
        // Si el click no es en el sidebar ni en el botón del menú
        if (!$(event.target).closest('#sidebar').length && !$(event.target).closest('#btnMostrarMenu').length) {
            if ($('#sidebar').hasClass('visible')) {
                $('#sidebar').removeClass('visible');
                $('#mainContent').removeClass('shifted');
            }
        }
    });

    // Prevenir que el click dentro del sidebar se propague al documento
    $('#sidebar').click(function (event) {
        event.stopPropagation();
    });
});
