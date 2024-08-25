class Experiencia {
    constructor(nombre, fecha, calif, coment) {
        this.NombreUsuario = nombre;
        this.Fecha = fecha;
        this.Calificacion = calif;
        this.Comentario = coment;
    }

    static async Create(calif, coment) {
        try {
            let url = $("#URLCrearExperiencia").val();

            const exp = new Experiencia(null, null, calif, coment);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(exp)

            });

            return response;

        } catch (ex) {
            throw ex;
        }
    }

    static async FiltrarComentarios(fechaInicio, fechaFin, calificacion) {
        try {
            const url = $("#URLFiltrarExperiencia").val();

            if (!fechaInicio) {
                fechaInicio = new Date('0001-01-01').toISOString();
            }
            if (!fechaFin) {
                fechaFin = new Date().toISOString(); 
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    FechaInicio: fechaInicio,
                    FechaFin: fechaFin,
                    Calificacion: calificacion
                })

            });

            const comentarios = await response.json();

            return comentarios;
                        
        } catch (ex) {
            throw ex;
        }
    }
}