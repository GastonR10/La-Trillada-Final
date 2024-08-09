function showLoader() {
    document.getElementById("loader").style.display = "flex";
}

function hideLoader() {
    document.getElementById("loader").style.display = "none";
}

// Mostrar la pantalla de carga cuando el DOM esté completamente cargado
//document.addEventListener("DOMContentLoaded", showLoader);

// Ocultar la pantalla de carga cuando la página y todos los recursos estén completamente cargados
//window.onload = hideLoader();