document.addEventListener("DOMContentLoaded", (event) => {
    const IMAGE_WIDTH = 500;
    const DELAY = 3000;
    const $prev = document.querySelector('.prev');
    const $next = document.querySelector('.next');
    const $imageContainer = document.querySelector('.image-container');
    const $numimages = $imageContainer.childElementCount;
    let currentImg = 1;
    let timeout;

    function updateImg() {
        if (currentImg > $numimages - 2) {
            currentImg = 1;
        }

        $imageContainer.style.transform = `translateX(-${(currentImg - 1) * IMAGE_WIDTH}px)`;

        timeout = setTimeout(
            () => {
                currentImg++;
                updateImg();

            },
            DELAY,
        );
    }
   
    $prev.addEventListener(
        'click',
        () => {
            clearTimeout(timeout);
            currentImg--;
            updateImg();

        },
    );
    $next.addEventListener(
        'click',
        () => {
            clearTimeout(timeout);
            currentImg++;
            updateImg();
        },

    );

    updateImg();


const images = document.querySelector('.carousel-images');
const indicators = document.querySelectorAll('.carousel-indicator');
const totalImages = indicators.length;
let index = 0;

document.getElementById('nextBtn').addEventListener('click', () => {
    index = (index + 1) % totalImages;
    updateCarousel();
});

document.getElementById('prevBtn').addEventListener('click', () => {
    index = (index - 1 + totalImages) % totalImages;
    updateCarousel();
});

indicators.forEach((indicator, i) => {
    indicator.addEventListener('click', () => {
        index = i;
        updateCarousel();
    });
});

function updateCarousel() {
    images.style.transform = `translateX(${-index * 100}%)`;
    indicators.forEach(indicator => indicator.classList.remove('active'));
    indicators[index].classList.add('active');
}

});

function toggleSidebar() { 
    var sidebar = document.getElementById("sidebar"); 
    if (sidebar.style.display === "block") { 
        sidebar.style.display = "none"; 
    } 
    else { 
        sidebar.style.display = "block"; 
    } 
}

// Aplicar ajustes al cargar la página (sino no pilla el js)
document.addEventListener('DOMContentLoaded', () => {
    cargarElementos();
});

function cargarElementos() {
    const responsiveHamburger = document.querySelector('.header--responsive .header__hamburger');
    const responsiveHeader = document.querySelector('.header--responsive');
    const body = document.body;

    // Abrir y cerrar el menú al hacer clic en el botón del hamburger
    responsiveHamburger.addEventListener('click', function (e) {
        e.stopPropagation(); // Impide que el clic en el botón se propague y cierre el menú
        responsiveHeader.classList.toggle('is-open');
        body.classList.toggle('menu-open'); // Evita el scroll cuando el menú está abierto
    });

    // Cerrar el menú si se hace clic fuera de él
    document.addEventListener('click', function (e) {
        if (!responsiveHeader.contains(e.target) && !responsiveHamburger.contains(e.target)) {
            responsiveHeader.classList.remove('is-open');
            body.classList.remove('menu-open');
        }
    });

    // Evitar que el clic en el menú abra el menú al hacer clic dentro de él
    responsiveHeader.addEventListener('click', function (e) {
        e.stopPropagation();
    });
}