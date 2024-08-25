/* ------------------------------ TOAST ------------------------------  */
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
                <span ${tipo == 'info' ? 'class= "text-primary"' : 'class= "text-white"'}><i class="fa-solid ${iconoClase} fa-lg"></i></span>
                <div class="d-flex flex-grow-1 align-items-center">
                  <span ${tipo == 'info' ? 'class= "text-primary fw-semibold"' : 'class= "text-white fw-semibold"'}>${mensaje}</span>
                  <button type="button" class="btn-close btn-close-sm ${tipo == 'info' ? "btn-close-black" : "btn-close-white"} ms-auto" data-bs-dismiss="toast" aria-label="Close"></button>
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

/* ------------------------------ SELECT PARA CARGAR MESAS ------------------------------  */
async function cargarMesas(slcId) {
    try {
        let res = await Mesa.getMesas();

        if (res.status != 500) {
            let slcMesas = document.getElementById(slcId);

            // Crear y a�adir la opci�n predeterminada
            const defaultOption = document.createElement('option');
            defaultOption.value = '0';
            defaultOption.text = '-- Seleccionar --';
            slcMesas.appendChild(defaultOption);

            // A�adir las opciones obtenidas del servidor
            res.forEach(m => {
                const option = document.createElement('option');
                option.value = m.Id;
                option.text = m.Id;
                slcMesas.appendChild(option);
            });
        } else {
            Tools.Toast("Error inesperado, contacte al administrador", 'error');
        }

    } catch (ex) {
        await handleError(ex);
        Tools.Toast("Error inesperado, contacte al administrador", 'error');
    }

}

/* ------------------------------ AVISAR NUEVO PEDIDO SIGNALR ------------------------------  */
function avisarNuevoPedido() {
    const connection = new signalR.HubConnectionBuilder()
        .withUrl("/notificationHub") // Aseg�rate de que la URL sea la correcta para tu servidor SignalR
        .configureLogging(signalR.LogLevel.Information)
        .build();

    connection.on("RecibirPedido", async function (id) {
        Tools.Toast('Nuevo pedido ' + id + ' recibido', 'info')

    });

    connection.on("PedidoAceptado", async function (id) {
        Tools.Toast('Pedido ' + id + ' fue enviado a preparacion', 'info')

    });

    connection.on("PedidoPronto", async function (id) {
        Tools.Toast('El pedido ' + id + ' fue colocado en camino.', 'info') 

    });

    connection.start()
        .then(function () {
            console.log('Conectado a SignalR');
        })
        .catch(function (err) {
            console.error('Error al conectar a SignalR:', err.message);
        });
}

/* ------------------------------ CONFIRM ASINCR�NICO ------------------------------  */
async function asyncConfirm(message) {
    return new Promise((resolve) => {
        // Mostrar el di�logo
        const dialog = document.getElementById('asyncConfirm');
        const confirmMessage = document.getElementById('confirmMessage');
        const confirmYes = document.getElementById('confirmYes');
        const confirmNo = document.getElementById('confirmNo');

        confirmMessage.textContent = message;
        dialog.style.display = 'flex';

        // Configurar los botones
        confirmYes.onclick = () => {
            dialog.style.display = 'none';
            resolve(true);  // Se confirm�
        };

        confirmNo.onclick = () => {
            dialog.style.display = 'none';
            resolve(false);  // Se cancel�
        };
    });
}

/* ------------------------------ PANTALLA DE CARGA ------------------------------  */
function showLoader() {
    document.getElementById("loader").style.display = "flex";
}

function hideLoader() {
    document.getElementById("loader").style.display = "none";
}

/* ------------------------------ VALIDACIONES ------------------------------  */
function esCelularValido(numero) {
    // Expresi�n regular para validar que el n�mero comienza con 0 y tiene 9 caracteres
    const patron = /^0\d{8}$/;
    return patron.test(numero);
}

function esContrasenaValida(contrasena) {
    // Expresi�n regular para validar que tiene al menos 8 caracteres y al menos un n�mero
    const patron = /^(?=.*\d).{8,}$/;
    return patron.test(contrasena);
}
function esEmailValido(email) {
    // Expresi�n regular para validar una direcci�n de correo electr�nico incluyendo TLD de dos letras
    const patron = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    return patron.test(email);
}

/* ------------------------------ LOG DE ERRORES ------------------------------  */
async function handleError(ex) {
    let errorMessage = `${new Date().toISOString()}: ${ex.message}\n${ex.stack}\n\n;`;

    await fetch('/api/log/error', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: errorMessage })
    });
}