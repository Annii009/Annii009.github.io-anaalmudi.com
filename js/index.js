const btns = document.querySelectorAll('.pill-button');

btns.forEach(b => {
    b.addEventListener('mousemove', (e) => {
        const r = b.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        b.style.transform = `translate(${x * 12}px, ${y * 12}px) scale(1.05)`;
    });

    b.addEventListener('mouseleave', () => {
        b.style.transform = '';
    });
});

const formulario = document.querySelector('.contact-form');

if (formulario) {
    formulario.addEventListener('submit', function(e) {
        e.preventDefault();

        const btnEnviar = formulario.querySelector('.btn-send');
        const textoOriginal = btnEnviar.textContent;
        
        btnEnviar.textContent = 'Enviando...';
        btnEnviar.style.opacity = '0.7';
        btnEnviar.disabled = true;

        fetch(formulario.action, {
            method: 'POST',
            body: new FormData(formulario),
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                formulario.reset();
                mostrarMensaje('¡Mensaje enviado con éxito!', 'success');
            } else {
                mostrarMensaje('Ups! Algo salió mal.', 'error');
            }
        })
        .catch(error => {
            mostrarMensaje('Error de conexión.', 'error');
        })
        .finally(() => {
            btnEnviar.textContent = textoOriginal;
            btnEnviar.style.opacity = '1';
            btnEnviar.disabled = false;
        });
    });
}

function mostrarMensaje(texto, tipo) {
    const mensajePrevio = document.querySelector('.form-status');
    if (mensajePrevio) mensajePrevio.remove();

    const aviso = document.createElement('div');
    aviso.className = `form-status ${tipo}`;
    aviso.textContent = texto;
    
    formulario.appendChild(aviso);

    setTimeout(() => {
        aviso.style.opacity = '1';
    }, 10);

    setTimeout(() => {
        aviso.style.opacity = '0';
        setTimeout(() => aviso.remove(), 500);
    }, 4000);
}