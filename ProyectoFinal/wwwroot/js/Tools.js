var Tools = Tools || {};
Tools.Toast = function (mensaje, tipo) {
    try {
        let iconoClase;
        let toastClase;

        if (tipo === 'success') {
            iconoClase = 'fa-circle-check';
            toastClase = 'bg-success';
        } else if (tipo === 'error') {
            iconoClase = 'fa-circle-exclamation';
            toastClase = 'bg-danger';
        } else if (tipo === 'warning') {
            iconoClase = 'fa-triangle-exclamation';
            toastClase = 'bg-warning';
        }
        else if (tipo == 'info') {
            iconoClase = 'fa-circle-info';
        }

        let toast = $(`
          <div class="toast fade ${toastClase}" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-body">
              <div class="d-flex gap-4">
                <span ${tipo == 'info' ? 'class= "text-primary"' : ""}><i class="fa-solid ${iconoClase} fa-lg"></i></span>
                <div class="d-flex flex-grow-1 align-items-center">
                  <span class="fw-semibold">${mensaje}</span>
                  <button type="button" class="btn-close btn-close-sm ${["warning", "info"].includes(tipo) ? "btn-close-black" : "btn-close-white"} ms-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
              </div>
            </div>
          </div>`);

        $('.toast-container').append(toast);

        let palabras = mensaje.split(' ').length;
        let wpmPromedio = 200;
        let tiempoSegundos = palabras / wpmPromedio * 60;

        const bootstrapToast = new bootstrap.Toast(toast[0], { autohide: true, delay: tiempoSegundos < 5 ? 5000 : tiempoSegundos * 1000 });
        bootstrapToast.show();

        toast.on('hidden.bs.toast', function () {
            $(this).remove();
        });

    } catch (err) {
        Tools.err("Tools.js", "Tools.Toast", err, true);
    }
};