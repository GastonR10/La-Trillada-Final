async function CrearExperiencia() {
    try {
        const comentario = $('#comentario').val();
        const calificacion = $('#calificacion').val();

        const res = await Experiencia.Create(calificacion, comentario);
        console.log('Response:', res);

        if (res.status == 200) {
            $('#comentario').val("");
            $('#calificacion').val("");
            Tools.Toast('Comentario creado con éxito', 'success');

        } else if (res.status == 400) {
            const msj = await res.text();
            Tools.Toast(msj, 'warning');

        } else if (res.status == 500) {
            Tools.Toast('Error inesperado, contacte al administrador', 'error');
        }

    } catch (ex) {
        await handleError(ex);
        Tools.Toast('Error inesperado, contacte al administrador', 'error');
    }
    
}