function asyncConfirm(message) {
    return new Promise((resolve) => {
        // Mostrar el diálogo
        const dialog = document.getElementById('asyncConfirm');
        const confirmMessage = document.getElementById('confirmMessage');
        const confirmYes = document.getElementById('confirmYes');
        const confirmNo = document.getElementById('confirmNo');

        confirmMessage.textContent = message;
        dialog.style.display = 'flex';

        // Configurar los botones
        confirmYes.onclick = () => {
            dialog.style.display = 'none';
            resolve(true);  // Se confirmó
        };

        confirmNo.onclick = () => {
            dialog.style.display = 'none';
            resolve(false);  // Se canceló
        };
    });
}