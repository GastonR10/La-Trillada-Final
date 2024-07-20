async function cargarMesas(slcId) {
    try {
        let res = await Mesa.getMesas();

        if (res != null) {
            let slcMesas = document.getElementById(slcId);

            // Crear y añadir la opción predeterminada
            const defaultOption = document.createElement('option');
            defaultOption.value = '0';
            defaultOption.text = '-- Seleccionar --';
            slcMesas.appendChild(defaultOption);

            // Añadir las opciones obtenidas del servidor
            res.forEach(m => {
                const option = document.createElement('option');
                option.value = m.Id;
                option.text = m.Id;
                slcMesas.appendChild(option);
            });
        }

        console.log(res);

    } catch (ex) {
        console.error('Error:', ex.message);
        throw ex;
    }

}