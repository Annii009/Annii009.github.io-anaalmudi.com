document.addEventListener('DOMContentLoaded', () => {

    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('main-nav');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        nav.classList.toggle('open');
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            nav.classList.remove('open');
        });
    });

    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('open');
            nav.classList.remove('open');
        }
    });

    function buildCarousel(gridEl) {
        const images = Array.from(gridEl.querySelectorAll('img'));

        const wrapper = document.createElement('div');
        wrapper.className = 'carousel-wrapper';

        const track = document.createElement('div');
        track.className = 'carousel-track';

        images.forEach(img => {
            const clone = document.createElement('img');
            clone.src = img.src;
            clone.alt = img.alt;
            track.appendChild(clone);
        });

        const prev = document.createElement('button');
        prev.className = 'carousel-btn prev';
        prev.setAttribute('aria-label', 'Anterior');
        prev.innerHTML = '&#8249;';

        const next = document.createElement('button');
        next.className = 'carousel-btn next';
        next.setAttribute('aria-label', 'Siguiente');
        next.innerHTML = '&#8250;';

        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'carousel-dots';

        images.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        });

        wrapper.appendChild(track);
        wrapper.appendChild(prev);
        wrapper.appendChild(next);
        wrapper.appendChild(dotsContainer);

        gridEl.parentNode.insertBefore(wrapper, gridEl.nextSibling);

        let current = 0;
        const total = images.length;

        function goTo(index) {
            current = (index + total) % total;
            track.style.transform = `translateX(-${current * 100}%)`;
            dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
                d.classList.toggle('active', i === current);
            });
        }

        prev.addEventListener('click', () => goTo(current - 1));
        next.addEventListener('click', () => goTo(current + 1));

        let startX = 0;
        track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', e => {
            const diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
        });
    }

    const manosGrid = document.querySelector('.manos-grid');
    const arteGrid  = document.querySelector('.arte-grid');

    if (manosGrid) buildCarousel(manosGrid);
    if (arteGrid)  buildCarousel(arteGrid);

});