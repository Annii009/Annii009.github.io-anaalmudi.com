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

const LS_ARMARIO = 'csc_armario';
const LS_DALTONISMO = 'csc_daltonismo';
const LS_AVATAR = 'csc_avatar';
const LS_LOOKS = 'csc_looks';

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

function redimensionarImagen(fileOrBlob, anchoMaximo) {
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
                resolve(canvas.toDataURL('image/png'));
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(fileOrBlob);
    });
}

async function quitarFondoSiSePuede(file) {
    try {
        const { removeBackground } = await import('https://esm.sh/@imgly/background-removal');
        return await removeBackground(file);
    } catch (err) {
        console.warn('No se pudo quitar el fondo, se usa la foto original:', err);
        return file;
    }
}

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

function cargarLooks() {
    try {
        return JSON.parse(localStorage.getItem(LS_LOOKS)) || [];
    } catch {
        return [];
    }
}

function guardarLooks(looks) {
    localStorage.setItem(LS_LOOKS, JSON.stringify(looks));
}

function prendasPorTipo(tipo) {
    return cargarArmario().filter(p => p.tipo === tipo);
}

function formatearFecha(timestamp) {
    return new Date(timestamp).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

function renderizarLooksGuardados() {
    const looks = cargarLooks();
    const armario = cargarArmario();
    const lista = document.getElementById('looks-list');
    const vacio = document.getElementById('looks-vacio');

    lista.innerHTML = '';
    vacio.style.display = looks.length === 0 ? 'block' : 'none';

    looks.slice().reverse().forEach(look => {
        const camisa = armario.find(p => p.id === look.camisaId);
        const pantalon = armario.find(p => p.id === look.pantalonId);
        const zapatos = armario.find(p => p.id === look.zapatosId);
        const accesorios = (look.accesorios || []).map(id => armario.find(p => p.id === id)).filter(Boolean);

        const miniatura = (prenda, tipo) => {
            if (!prenda) return '<i class="fa-solid fa-question" aria-hidden="true"></i>';
            return prenda.foto
                ? `<img src="${prenda.foto}" alt="${escapeHtml(prenda.nombre)}">`
                : `<i class="fa-solid ${TIPO_ICONS[tipo] || 'fa-tag'}" aria-hidden="true"></i>`;
        };

        const li = document.createElement('li');
        li.className = 'look-card';
        li.innerHTML = `
            <button type="button" class="look-card-borrar" aria-label="Eliminar este look guardado" data-id="${look.id}">
                <i class="fa-solid fa-trash" aria-hidden="true"></i>
            </button>
            <div class="look-card-imagen">
                <span class="look-card-prenda">${miniatura(camisa, 'camisa')}</span>
                <span class="look-card-prenda">${miniatura(pantalon, 'pantalon')}</span>
                <span class="look-card-prenda">${miniatura(zapatos, 'zapatos')}</span>
                ${accesorios.length > 0 ? `
                <div class="look-card-accesorios-mini">
                    ${accesorios.map(a => `<span class="look-card-accesorio-mini">${miniatura(a, a.tipo)}</span>`).join('')}
                </div>` : ''}
            </div>
            <span class="look-card-fecha">${formatearFecha(look.fecha)}</span>
        `;
        lista.appendChild(li);
    });
}

document.getElementById('looks-list').addEventListener('click', (e) => {
    const btn = e.target.closest('.look-card-borrar');
    if (!btn) return;
    const id = btn.dataset.id;
    const looks = cargarLooks().filter(l => String(l.id) !== id);
    guardarLooks(looks);
    renderizarLooksGuardados();
    actualizarContadores();
});

function actualizarContadores() {
    const armario = cargarArmario();
    document.getElementById('stat-prendas').textContent = armario.length;

    const nCamisas = prendasPorTipo('camisa').length;
    const nPantalones = prendasPorTipo('pantalon').length;
    const nZapatos = prendasPorTipo('zapatos').length;
    document.getElementById('stat-combinaciones').textContent = nCamisas * nPantalones * nZapatos;

    document.getElementById('stat-looks').textContent = cargarLooks().length;
}

const avatarCircle = document.getElementById('avatar-circle');
const avatarInput = document.getElementById('avatar-input');
const avatarImg = document.getElementById('avatar-img');
const avatarIcon = document.getElementById('avatar-icon');

function aplicarAvatarGuardado() {
    const avatar = localStorage.getItem(LS_AVATAR);
    if (avatar) {
        avatarImg.src = avatar;
        avatarImg.hidden = false;
        avatarIcon.hidden = true;
    }
}

avatarCircle.addEventListener('click', () => avatarInput.click());

avatarInput.addEventListener('change', async () => {
    if (!avatarInput.files[0]) return;
    const avatar = await redimensionarImagen(avatarInput.files[0], 160);
    localStorage.setItem(LS_AVATAR, avatar);
    aplicarAvatarGuardado();
});

function renderizarArmario() {
    const armario = cargarArmario();
    const lista = document.getElementById('closet-list');
    const vacio = document.getElementById('closet-vacio');

    lista.innerHTML = '';
    vacio.style.display = armario.length === 0 ? 'block' : 'none';

    armario.forEach(prenda => {
        const li = document.createElement('li');
        li.className = 'closet-tile';

        const visual = prenda.foto
            ? `<img src="${prenda.foto}" alt="" class="closet-tile-photo">`
            : `<span class="closet-tile-icon" aria-hidden="true"><i class="fa-solid ${TIPO_ICONS[prenda.tipo] || 'fa-tag'}"></i></span>`;

        li.innerHTML = `
            ${visual}
            <button type="button" class="closet-tile-borrar" aria-label="Eliminar ${escapeHtml(prenda.nombre)}" data-id="${prenda.id}">
                <i class="fa-solid fa-trash" aria-hidden="true"></i>
            </button>
            <div class="closet-tile-caption">
                <span class="closet-tile-nombre">${escapeHtml(prenda.nombre)}</span>
                <span class="closet-tile-meta">${escapeHtml(TIPO_LABELS[prenda.tipo] || prenda.tipo)} · ${escapeHtml(prenda.color)}</span>
            </div>
        `;
        lista.appendChild(li);
    });

    actualizarContadores();
    renderizarLook();
    renderizarLooksGuardados();
}

document.getElementById('closet-list').addEventListener('click', (e) => {
    const btn = e.target.closest('.closet-tile-borrar');
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
    const boton = document.getElementById('prenda-submit');
    const status = document.getElementById('prenda-status');

    if (!nombre || !color) return;

    let foto = null;
    if (fotoInput.files[0]) {
        boton.disabled = true;
        status.textContent = 'Quitando el fondo de la foto…';

        const sinFondo = await quitarFondoSiSePuede(fotoInput.files[0]);
        foto = await redimensionarImagen(sinFondo, 300);

        status.textContent = '';
        boton.disabled = false;
    }

    const armario = cargarArmario();
    armario.push({ id: Date.now(), nombre, tipo, color, foto });
    guardarArmario(armario);
    renderizarArmario();

    e.target.reset();
});

const daltonismoToggle = document.getElementById('daltonismo-toggle');
const daltonismoTipoWrap = document.getElementById('daltonismo-tipo-wrap');
const daltonismoSelect = document.getElementById('daltonismo-select');
const simularWrap = document.getElementById('simular-wrap');
const simularToggle = document.getElementById('simular-toggle');
const closetList = document.getElementById('closet-list');
const lookWindow = document.getElementById('look-window');

function cargarDaltonismo() {
    return localStorage.getItem(LS_DALTONISMO) || '';
}

function aplicarEstadoDaltonismo(valorGuardado) {
    if (valorGuardado) {
        daltonismoToggle.checked = true;
        daltonismoTipoWrap.hidden = false;
        daltonismoSelect.value = valorGuardado;
        simularWrap.hidden = false;
    } else {
        daltonismoToggle.checked = false;
        daltonismoTipoWrap.hidden = true;
        simularWrap.hidden = true;
        simularToggle.checked = false;
        aplicarFiltroSimulacion();
    }
}

aplicarEstadoDaltonismo(cargarDaltonismo());

function guardarDaltonismoActual() {
    const valor = daltonismoToggle.checked ? daltonismoSelect.value : '';
    localStorage.setItem(LS_DALTONISMO, valor);
    aplicarEstadoDaltonismo(valor);

    const status = document.getElementById('perfil-guardado');
    status.textContent = 'Perfil guardado.';
    setTimeout(() => { status.textContent = ''; }, 2500);
}

daltonismoToggle.addEventListener('change', guardarDaltonismoActual);
daltonismoSelect.addEventListener('change', guardarDaltonismoActual);

function aplicarFiltroSimulacion() {
    const tipo = cargarDaltonismo();
    const filtro = (simularToggle.checked && tipo) ? `url(#filtro-${tipo})` : '';
    closetList.style.filter = filtro;
    lookWindow.style.filter = filtro;
}

simularToggle.addEventListener('change', aplicarFiltroSimulacion);

const LOOK_TIPOS = ['camisa', 'pantalon', 'zapatos'];
const lookIndices = { camisa: 0, pantalon: 0, zapatos: 0 };
const accesoriosIncluidos = new Set();

function mostrarEstadoLook(mensaje) {
    const status = document.getElementById('look-status');
    status.textContent = mensaje;
    setTimeout(() => { status.textContent = ''; }, 2500);
}

function renderizarLook() {
    LOOK_TIPOS.forEach(tipo => {
        const prendas = prendasPorTipo(tipo);
        const visual = document.getElementById(`look-visual-${tipo}`);
        const panel = visual.closest('.look-panel');
        const prevBtn = panel.querySelector('.look-arrow-prev');
        const nextBtn = panel.querySelector('.look-arrow-next');

        if (prendas.length === 0) {
            visual.innerHTML = '<span class="look-panel-vacio">Añade una prenda de este tipo</span>';
            prevBtn.disabled = true;
            nextBtn.disabled = true;
            return;
        }

        lookIndices[tipo] = ((lookIndices[tipo] % prendas.length) + prendas.length) % prendas.length;
        const prenda = prendas[lookIndices[tipo]];

        visual.innerHTML = prenda.foto
            ? `<img src="${prenda.foto}" alt="${escapeHtml(prenda.nombre)}">`
            : `<i class="fa-solid ${TIPO_ICONS[tipo] || 'fa-tag'} look-panel-icono" aria-hidden="true"></i>`;

        prevBtn.disabled = prendas.length <= 1;
        nextBtn.disabled = prendas.length <= 1;
    });

    renderizarAccesorios();
    actualizarContadorLook();
}

function renderizarAccesorios() {
    const accesorios = [...prendasPorTipo('accesorio'), ...prendasPorTipo('otro')];
    const cont = document.getElementById('look-accesorios');
    cont.innerHTML = '';

    accesorios.forEach(a => {
        const incluido = accesoriosIncluidos.has(a.id);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'look-accesorio-btn' + (incluido ? ' activo' : '');
        btn.setAttribute('aria-label', a.nombre + (incluido ? ' (incluido en el look)' : ' (no incluido)'));
        btn.setAttribute('aria-pressed', incluido ? 'true' : 'false');
        btn.innerHTML = a.foto
            ? `<img src="${a.foto}" alt="">`
            : `<i class="fa-solid ${TIPO_ICONS[a.tipo] || 'fa-tag'}" aria-hidden="true"></i>`;
        btn.addEventListener('click', () => {
            if (accesoriosIncluidos.has(a.id)) {
                accesoriosIncluidos.delete(a.id);
            } else {
                accesoriosIncluidos.add(a.id);
            }
            renderizarAccesorios();
        });
        cont.appendChild(btn);
    });
}

function actualizarContadorLook() {
    const counter = document.getElementById('look-counter');
    const nCamisas = prendasPorTipo('camisa').length;
    const nPantalones = prendasPorTipo('pantalon').length;
    const nZapatos = prendasPorTipo('zapatos').length;
    const total = nCamisas * nPantalones * nZapatos;

    if (total === 0) {
        counter.textContent = 'Añade al menos una camisa, un pantalón y unos zapatos';
        return;
    }

    const actual = lookIndices.camisa * nPantalones * nZapatos + lookIndices.pantalon * nZapatos + lookIndices.zapatos + 1;
    counter.textContent = `Look ${actual} de ${total}`;
}

lookWindow.addEventListener('click', (e) => {
    const btn = e.target.closest('.look-arrow');
    if (!btn) return;
    const tipo = btn.closest('.look-panel').dataset.tipo;
    const prendas = prendasPorTipo(tipo);
    if (prendas.length === 0) return;
    const delta = btn.classList.contains('look-arrow-next') ? 1 : -1;
    lookIndices[tipo] = (lookIndices[tipo] + delta + prendas.length) % prendas.length;
    renderizarLook();
});

document.getElementById('look-aleatorio').addEventListener('click', () => {
    LOOK_TIPOS.forEach(tipo => {
        const n = prendasPorTipo(tipo).length;
        if (n > 0) lookIndices[tipo] = Math.floor(Math.random() * n);
    });
    renderizarLook();
});

document.getElementById('look-guardar').addEventListener('click', () => {
    const camisa = prendasPorTipo('camisa')[lookIndices.camisa];
    const pantalon = prendasPorTipo('pantalon')[lookIndices.pantalon];
    const zapatos = prendasPorTipo('zapatos')[lookIndices.zapatos];

    if (!camisa || !pantalon || !zapatos) {
        mostrarEstadoLook('Te faltan prendas para completar un look.');
        return;
    }

    const looks = cargarLooks();
    looks.push({
        id: Date.now(),
        camisaId: camisa.id,
        pantalonId: pantalon.id,
        zapatosId: zapatos.id,
        accesorios: [...accesoriosIncluidos],
        fecha: Date.now(),
    });
    guardarLooks(looks);
    actualizarContadores();
    renderizarLooksGuardados();
    mostrarEstadoLook('¡Look guardado!');
});

document.getElementById('look-wear').addEventListener('click', () => {
    mostrarEstadoLook('¡Look puesto! Que tengas un buen día.');
});

aplicarAvatarGuardado();
renderizarArmario();
