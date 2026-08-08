# Combina sin Confundir — función serverless

Esta carpeta es un proyecto aparte de tu portfolio. Contiene únicamente la función serverless que hace de intermediaria entre la app web (que vive en GitHub Pages) y la API **gratuita** de Google Gemini. Se despliega en **Netlify** por separado — GitHub Pages no puede ejecutar código de servidor.

> **Ya está desplegada y conectada.** El sitio en Netlify se llama `combina-sin-confundir-api` y su URL (`https://combina-sin-confundir-api.netlify.app/.netlify/functions/wardrobe-chat`) ya está puesta directamente en `js/moda.js` (constante `CHAT_ENDPOINT`), así que la web funciona sin que tengas que configurar nada. Las instrucciones de abajo son solo por si algún día necesitas volver a desplegarla desde cero (por ejemplo, en otra cuenta) o entender cómo funciona.

```
combina-sin-confundir-api/
├── netlify/
│   └── functions/
│       └── wardrobe-chat.js   ← la función
├── netlify.toml
├── package.json
└── README.md (este archivo)
```

## 1. Requisitos

- Una cuenta gratuita en [Netlify](https://www.netlify.com/).
- Una cuenta de Google (para conseguir la clave de Gemini, gratis, sin tarjeta).
- Node.js instalado en tu ordenador (para usar el CLI de Netlify).

## 2. Conseguir tu clave de Gemini (gratis)

1. Ve a **[aistudio.google.com/apikey](https://aistudio.google.com/apikey)** e inicia sesión con tu cuenta de Google.
2. Pulsa **"Create API key"** (si es la primera vez, elige "Create API key in new project").
3. Copia la clave generada — empieza por `AIza...`. No hace falta dar de alta ninguna tarjeta.

## 3. Instalar el CLI de Netlify

```bash
npm install -g netlify-cli
netlify login
```

Esto abre el navegador para autenticarte con tu cuenta de Netlify.

## 4. Instalar las dependencias del proyecto

Desde esta carpeta (`combina-sin-confundir-api/`):

```bash
npm install
```

(La función no usa ninguna librería externa — solo `fetch`, que ya viene incluido en Node — así que este paso apenas hace nada, pero conviene dejarlo por si en el futuro se añade alguna dependencia.)

## 5. Crear el sitio en Netlify y desplegar

Sigues situado en esta carpeta:

```bash
netlify init
```

Elige **"Create & configure a new site"** y sigue las preguntas (puedes dejar los valores por defecto: no hay build command, y el directorio publicado puede quedar vacío ya que solo usamos funciones). Cuando termine, despliega:

```bash
netlify deploy --prod
```

Al finalizar te mostrará una URL como:

```
https://tu-sitio-random.netlify.app
```

Tu función estará disponible en:

```
https://tu-sitio-random.netlify.app/.netlify/functions/wardrobe-chat
```

Guarda esa URL, la necesitarás en el paso 7.

## 6. Configurar la clave de Gemini

**Nunca subas tu clave al código.** Se configura como variable de entorno en Netlify:

```bash
netlify env:set GEMINI_API_KEY "AIza-tu-clave-aqui"
```

También puedes hacerlo desde el panel: **Site settings → Environment variables → Add a variable**.

Opcional: si quieres restringir qué dominios pueden llamar a tu función (recomendado para producción), configura también:

```bash
netlify env:set ALLOWED_ORIGIN "https://anaalmudi.com"
```

Si no configuras `ALLOWED_ORIGIN`, la función acepta peticiones desde cualquier origen (`*`), lo cual está bien para probar pero es menos seguro a largo plazo.

Después de configurar variables de entorno, vuelve a desplegar para que tomen efecto:

```bash
netlify deploy --prod
```

## 7. Conectar el frontend con la función

Abre `js/moda.js` en tu repo y cambia la constante `CHAT_ENDPOINT` al principio del archivo por la URL de tu nueva función:

```js
const CHAT_ENDPOINT = 'https://tu-sitio-random.netlify.app/.netlify/functions/wardrobe-chat';
```

Guarda el archivo y sube el cambio a tu repo de GitHub Pages. Listo — el chat de tu armario ya llamará a la nueva función, sin coste.

## Sobre el límite gratuito

La capa gratuita de Gemini tiene límites de peticiones por minuto y por día (pensados para proyectos personales como este). Si algún día los superases, la función devolverá un error temporal — para un uso normal de esta app no deberías notarlo.

## Actualizar la función más adelante

Si modificas `netlify/functions/wardrobe-chat.js`, simplemente vuelve a correr, desde esta carpeta:

```bash
netlify deploy --prod
```

## Probar en local (opcional)

```bash
netlify dev
```

Esto levanta la función en `http://localhost:8888/.netlify/functions/wardrobe-chat`, útil para probarla con `curl` o Postman antes de pegarla en la app.
