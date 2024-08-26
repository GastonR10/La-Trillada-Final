$(document).ready(async function () {
    try {
        showLoader();

        let res = await Experiencia.ObtenerExperiencias();

        if (res.status == 500) {
            Tools.Toast('Error inesperado, contacte al administrador', 'error');
            return;
        }

        if (res.length === 0) {
            return; // No hacer nada si la lista está vacía
        }

        const carrusel = $("#carruselExperiencias");
        carrusel.empty(); // Limpiar el contenido existente

        res.forEach(exp => {
            const estrellas = Math.floor(exp.Calificacion / 2); // Calcular estrellas completas
            const mediaEstrella = exp.Calificacion % 2 === 1; // Verificar si hay media estrella

            let estrellasHtml = '';
            for (let i = 0; i < estrellas; i++) {
                estrellasHtml += '<i class="fas fa-star full-star"></i>'; // Estrella completa
            }
            if (mediaEstrella) {
                estrellasHtml += `
                        <div class="star-container">
                            <i class="far fa-star star-bg"></i>
                            <i class="fas fa-star star-fg"></i>
                        </div>`;
            }
            for (let i = estrellas + (mediaEstrella ? 1 : 0); i < 5; i++) {
                estrellasHtml += '<i class="far fa-star empty-star"></i>'; // Estrellas vacías
            }

            const tarjeta = `
                    <div class="swiper-slide">
                        <div class="card experiencia-card">
                            <div class="card-body">
                                <h5 class="card-title">${exp.NombreUsuario}</h5>
                                <p class="card-text"><small class="text-muted">${new Date(exp.Fecha).toLocaleDateString()}</small></p>
                                <p class="card-text">${exp.Comentario}</p>
                                <div class="rating" style="display: flex;justify-content: center;">${estrellasHtml}</div>
                            </div>
                        </div>
                    </div>
                `;

            carrusel.append(tarjeta);
        });

        // Inicializar Swiper
        new Swiper('.swiper-container', {
            slidesPerView: 1, // Mostrar 1 tarjeta a la vez por defecto (para pantallas pequeñas)
            spaceBetween: 10, // Espacio entre las tarjetas
            slidesPerGroup: 1, // Deslizar una tarjeta a la vez
            loop: true, // Habilitar el looping
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            breakpoints: {
                // Cuando la pantalla es mayor a 768px (escritorio)
                769: {
                    slidesPerView: 3    , // Mostrar 3 tarjetas a la vez en pantallas grandes
                    spaceBetween: 10 // Espacio entre las tarjetas
                }
            }
        });


        hideLoader();

    } catch (ex) {
        await handleError(ex);
        Tools.Toast('Error inesperado, contacte al administrador', 'error');
    }
});
