document.addEventListener('DOMContentLoaded', function() {
            // Seleccionar todas las tarjetas
            const flipCards = document.querySelectorAll('.flip-card');
            
            // Añadir evento click a cada tarjeta
            flipCards.forEach(card => {
                card.addEventListener('click', function() {
                    this.classList.toggle('flipped');
                });
            });
        });