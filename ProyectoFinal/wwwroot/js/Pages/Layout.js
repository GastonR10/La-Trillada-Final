//let _carrito = new Carrito();
//_carrito.cargarDesdeLocalStorage();

$(document).ready(function () {
    $('#btnMostrarMenu').click(function () {
        $('#sidebar').toggleClass('visible');
        $('#mainContent').toggleClass('shifted');
    });

});