const track = document.getElementById('carousel-track');
if (track) {
    const slides = track.querySelectorAll('.carousel-slide');
    const dotsContainer = document.getElementById('carousel-dots');
    const btnPrev = document.getElementById('carousel-prev');
    const btnNext = document.getElementById('carousel-next');
    let current = 0;
    let startX = 0;
    let isDragging = false;

    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('aria-label', `Ir a la imagen ${i + 1}`);
        if (i === 0) {
            dot.classList.add('active');
            dot.setAttribute('aria-current', 'true');
        }
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    function goTo(index) {
        current = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((d, i) => {
            if (i === current) {
                d.classList.add('active');
                d.setAttribute('aria-current', 'true');
            } else {
                d.classList.remove('active');
                d.removeAttribute('aria-current');
            }
        });
    }

    btnPrev.addEventListener('click', () => goTo(current - 1));
    btnNext.addEventListener('click', () => goTo(current + 1));

    track.addEventListener('touchstart', e => { 
        startX = e.touches[0].clientX; 
        isDragging = true; 
    }, { passive: true });

    track.addEventListener('touchend', e => {
        if (!isDragging) return;
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
        isDragging = false;
    });
}