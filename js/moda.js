// ---- Menú hamburguesa (mismo patrón que el resto del sitio) ----
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('main-nav');

if (hamburger && nav) {
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
}

// ---- Combina sin Confundir ----

const LS_ARMARIO = 'csc_armario';
const LS_DALTONISMO = 'csc_daltonismo'; // '' = sin perfil, o 'protanopia' | 'deuteranopia' | 'tritanopia'

// Función serverless ya desplegada (ver combina-sin-confundir-api/). No hace falta configurar nada.
const CHAT_ENDPOINT = 'https://combina-sin-confundir-api.netlify.app/.netlify/functions/wardrobe-chat';

const TIPO_LABELS = {
    camisa: 'Camisa / camiseta',
    pantalon: 'Pantalón / falda',
    zapatos: 'Zapatos',
    accesorio: 'Accesorio',
    otro: 'Otro',
};

const TIPO_ICONS = {
    camisa: 'fa-shirt',
    pantalon: 'fa-socks',
    zapatos: 'fa-shoe-prints',
    accesorio: 'fa-gem',
    otro: 'fa-tag',
};

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ---- Armario ----

function cargarArmario() {
    try {
        return JSON.parse(localStorage.getItem(LS_ARMARIO)) || [];
    } catch {
        return [];
    }
}

function guardarArmario(armario) {
    localStorage.setItem(LS_ARMARIO, JSON.stringify(armario));
}

// Reduce el tamaño de la foto antes de guardarla en localStorage.
function redimensionarImagen(file, anchoMaximo) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            const img = new Image();
            img.onerror = reject;
            img.onload = () => {
                const escala = Math.min(1, anchoMaximo / img.width);
                const canvas = document.createElement('canvas');
                canvas.width = img.width * escala;
                canvas.height = img.height * escala;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
}

function renderizarArmario() {
    const armario = cargarArmario();
    const lista = document.getElementById('closet-list');
    const vacio = document.getElementById('closet-vacio');

    lista.innerHTML = '';
    vacio.style.display = armario.length === 0 ? 'block' : 'none';

    armario.forEach(prenda => {
        const li = document.createElement('li');
        li.className = 'closet-item';

        const visual = prenda.foto
            ? `<img src="${prenda.foto}" alt="" class="closet-item-thumb">`
            : `<span class="closet-item-icon" aria-hidden="true"><i class="fa-solid ${TIPO_ICONS[prenda.tipo] || 'fa-tag'}"></i></span>`;

        li.innerHTML = `
            ${visual}
            <div class="closet-item-info">
                <div class="closet-item-nombre">${escapeHtml(prenda.nombre)}</div>
                <div class="closet-item-meta">${escapeHtml(TIPO_LABELS[prenda.tipo] || prenda.tipo)} · ${escapeHtml(prenda.color)}</div>
            </div>
            <button type="button" class="closet-item-borrar" aria-label="Eliminar ${escapeHtml(prenda.nombre)}" data-id="${prenda.id}">
                <i class="fa-solid fa-trash" aria-hidden="true"></i>
            </button>
        `;
        lista.appendChild(li);
    });
}

document.getElementById('closet-list').addEventListener('click', (e) => {
    const btn = e.target.closest('.closet-item-borrar');
    if (!btn) return;
    const id = btn.dataset.id;
    const armario = cargarArmario().filter(p => String(p.id) !== id);
    guardarArmario(armario);
    renderizarArmario();
});

document.getElementById('prenda-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('prenda-nombre').value.trim();
    const tipo = document.getElementById('prenda-tipo').value;
    const color = document.getElementById('prenda-color').value.trim();
    const fotoInput = document.getElementById('prenda-foto');

    if (!nombre || !color) return;

    let foto = null;
    if (fotoInput.files[0]) {
        foto = await redimensionarImagen(fotoInput.files[0], 240);
    }

    const armario = cargarArmario();
    armario.push({ id: Date.now(), nombre, tipo, color, foto });
    guardarArmario(armario);
    renderizarArmario();

    e.target.reset();
});

// ---- Perfil de daltonismo (opcional) ----

const daltonismoToggle = document.getElementById('daltonismo-toggle');
const daltonismoTipoWrap = document.getElementById('daltonismo-tipo-wrap');
const daltonismoSelect = document.getElementById('daltonismo-select');

function cargarDaltonismo() {
    return localStorage.getItem(LS_DALTONISMO) || '';
}

function aplicarEstadoDaltonismo(valorGuardado) {
    if (valorGuardado) {
        daltonismoToggle.checked = true;
        daltonismoTipoWrap.hidden = false;
        daltonismoSelect.value = valorGuardado;
    } else {
        daltonismoToggle.checked = false;
        daltonismoTipoWrap.hidden = true;
    }
}

aplicarEstadoDaltonismo(cargarDaltonismo());

function guardarDaltonismoActual() {
    const valor = daltonismoToggle.checked ? daltonismoSelect.value : '';
    localStorage.setItem(LS_DALTONISMO, valor);
    const status = document.getElementById('perfil-guardado');
    status.textContent = 'Perfil guardado.';
    setTimeout(() => { status.textContent = ''; }, 2500);
}

daltonismoToggle.addEventListener('change', () => {
    daltonismoTipoWrap.hidden = !daltonismoToggle.checked;
    guardarDaltonismoActual();
});

daltonismoSelect.addEventListener('change', guardarDaltonismoActual);

// ---- Chat con el armario ----

const chatLog = document.getElementById('chat-log');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');

// Historial de la conversación en memoria (se reinicia si recargas la página).
let mensajesChat = [];

function anadirBurbuja(texto, tipo) {
    const burbuja = document.createElement('div');
    burbuja.className = `chat-bubble chat-bubble-${tipo}`;
    burbuja.innerHTML = `<p>${escapeHtml(texto)}</p>`;
    chatLog.appendChild(burbuja);
    chatLog.scrollTop = chatLog.scrollHeight;
    return burbuja;
}

function anadirIndicadorEscribiendo() {
    const burbuja = document.createElement('div');
    burbuja.className = 'chat-bubble chat-bubble-typing';
    burbuja.textContent = 'Mirando tu armario…';
    chatLog.appendChild(burbuja);
    chatLog.scrollTop = chatLog.scrollHeight;
    return burbuja;
}

if (cargarArmario().length === 0) {
    anadirBurbuja('Añade alguna prenda a tu armario y luego pregúntame qué combinar.', 'system');
} else {
    anadirBurbuja('¡Hola! Ya veo tu armario. Pregúntame qué te pones hoy o cómo combinar alguna prenda.', 'system');
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const pregunta = chatInput.value.trim();
    if (!pregunta) return;

    const armario = cargarArmario();

    if (armario.length === 0) {
        anadirBurbuja('Antes añade alguna prenda a tu armario, así tengo con qué combinar.', 'system');
        chatInput.value = '';
        return;
    }

    anadirBurbuja(pregunta, 'user');
    mensajesChat.push({ role: 'user', content: pregunta });
    chatInput.value = '';
    chatInput.disabled = true;

    const indicador = anadirIndicadorEscribiendo();

    // No hace falta mandar la foto: el chatbot solo necesita nombre, tipo y color.
    const armarioSinFotos = armario.map(({ nombre, tipo, color }) => ({ nombre, tipo, color }));

    try {
        const response = await fetch(CHAT_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                armario: armarioSinFotos,
                daltonismo: cargarDaltonismo() || null,
                mensajes: mensajesChat,
            }),
        });

        if (!response.ok) {
            throw new Error(`la función respondió con un error (${response.status})`);
        }

        const data = await response.json();

        if (!data.respuesta) {
            throw new Error('la respuesta no tuvo el formato esperado.');
        }

        indicador.remove();
        anadirBurbuja(data.respuesta, 'bot');
        mensajesChat.push({ role: 'assistant', content: data.respuesta });
    } catch (err) {
        indicador.remove();
        anadirBurbuja(`No he podido responder. ${err.message}`, 'bot chat-bubble-error');
    } finally {
        chatInput.disabled = false;
        chatInput.focus();
    }
});

renderizarArmario();
