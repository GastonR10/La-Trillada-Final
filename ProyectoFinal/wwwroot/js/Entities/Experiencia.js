class Experiencia {
    constructor(nombre, fecha, calif, coment) {
        this.NombreUsuario = nombre;
        this.Fecha = fecha;
        this.Calificacion = parseInt(calif);
        this.Comentario = coment;
    }

    static async Create(calif, coment) {
        try {
            let url = $("#URLCrearExperiencia").val();

            const exp = new Experiencia("", new Date().toISOString(), calif, coment);

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

    static async ObtenerExperiencias() {
        try {
            const url = $("#URLObtenerExperiencias").val();

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }

            });


            if (response.status == 200) {
                const data = await response.json();
                
                // Convertir los objetos recibidos en instancias de la clase Experiencia
                const experiencias = data.map(exp => new Experiencia(exp.NombreUsuario, exp.Fecha, exp.Calificacion, exp.Comentario));              
                return experiencias;
            } 
            
            return response;

        } catch (ex) {
            throw ex;
        }
    }


}