document.addEventListener("DOMContentLoaded", () => {
    const IMAGE_WIDTH = 500; // Ajusta al ancho de tus imágenes
    const DELAY = 3000; // Retraso en milisegundos
    const $prev = document.querySelector('.prev');
    const $next = document.querySelector('.next');
    const $imageContainer = document.querySelector('.image-container');
    const images = Array.from($imageContainer.children);
    const $numImages = images.length;
    let currentImg = 0; // Index empieza desde 0
    let timeout;

    function updateImg() {
        // Resetea si llegamos al final
        currentImg = (currentImg + $numImages) % $numImages;

        // Mueve el contenedor a la imagen actual
        $imageContainer.style.transform = `translateX(-${currentImg * IMAGE_WIDTH}px)`;

        // Reinicia el ciclo automático
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            currentImg++;
            updateImg();
        }, DELAY);
    }

    $prev.addEventListener('click', () => {
        currentImg--;
        updateImg();
    });

    $next.addEventListener('click', () => {
        currentImg++;
        updateImg();
    });

    // Inicia el ciclo automático
    updateImg();
});


function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar.style.display === "block") {
        sidebar.style.display = "none";
    } else {
        sidebar.style.display = "block";
    }
}
