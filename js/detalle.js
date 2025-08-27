document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-img");
  const images = document.querySelectorAll(".fila img");
  const closeBtn = document.querySelector(".close");
  const prevBtn = document.querySelector(".arrow.left");
  const nextBtn = document.querySelector(".arrow.right");
  let index = 0;

  function showImage() {
    modalImg.src = images[index].src;
    modal.classList.add('active');
  }

  images.forEach((img, i) => img.addEventListener('click', () => { index = i; showImage(); }));

  // cierres y navegación con comprobaciones (evita errores si algún elemento falta)
  closeBtn?.addEventListener('click', () => modal.classList.remove('active'));
  prevBtn?.addEventListener('click', () => { index = (index - 1 + images.length) % images.length; showImage(); });
  nextBtn?.addEventListener('click', () => { index = (index + 1) % images.length; showImage(); });

  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('active'); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') modal.classList.remove('active');
    if (e.key === 'ArrowLeft') { index = (index - 1 + images.length) % images.length; showImage(); }
    if (e.key === 'ArrowRight') { index = (index + 1) % images.length; showImage(); }
  });
});