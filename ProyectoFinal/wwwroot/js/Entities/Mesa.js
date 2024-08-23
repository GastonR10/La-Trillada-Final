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

            if (response.status == 500) {
                return null;
            }

            const data = await response.json();

            const mesas = data.map(item => new Mesa(item.Id, item.Reservada));

            return mesas;

        } catch (ex) {
            throw ex;
        }
    }
}