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

    const wrappers = document.querySelectorAll('.video-wrapper');

    wrappers.forEach(wrapper => {
        const video = wrapper.querySelector('video');
        const btn = wrapper.querySelector('.play-btn');

        const tryAutoplay = () => {
            const promise = video.play();
            if (promise !== undefined) {
                promise.then(() => {
                    btn.classList.add('hidden');
                }).catch(() => {
                    btn.classList.remove('hidden');
                });
            }
        };

        btn.addEventListener('click', () => {
            video.play();
            btn.classList.add('hidden');
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    tryAutoplay();
                } else {
                    video.pause();
                    btn.classList.remove('hidden');
                }
            });
        }, { threshold: 0.4 });

        observer.observe(wrapper);
    });

});