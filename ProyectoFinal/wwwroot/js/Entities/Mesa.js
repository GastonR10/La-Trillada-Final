class Mesa {
    constructor(id, reservada) {
        this.Id = id;
        this.Reservada = reservada;
    }

    static async getMesas() {
        try {
            const url = $("#URLGetMesas").val();

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }

            const data = await response.json();

            // Verificar la estructura del JSON
            console.log('Datos recibidos:', data);

            const mesas = data.map(item => new Mesa(item.Id, item.Reservada));

            return mesas;

        } catch (error) {
            console.error('Error fetching mesas:', error);
        }
    }
}