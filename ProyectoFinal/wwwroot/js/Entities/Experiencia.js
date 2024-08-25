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
}