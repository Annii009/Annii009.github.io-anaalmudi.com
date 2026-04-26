const btns = document.querySelectorAll('.pill-button');
btns.forEach(b => {
    b.addEventListener('mousemove', (e) => {
        const r = b.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        b.style.transform = `translate(${x * 12}px, ${y * 12}px) scale(1.05)`;
    });
    b.addEventListener('mouseleave', () => b.style.transform = '');
});