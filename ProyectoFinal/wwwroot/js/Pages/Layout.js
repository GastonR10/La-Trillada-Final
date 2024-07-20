
$(document).ready(function () {
    $('#btnMostrarMenu').click(function () {
        $('#sidebar').toggleClass('visible');
        $('#mainContent').toggleClass('shifted');
    });

});