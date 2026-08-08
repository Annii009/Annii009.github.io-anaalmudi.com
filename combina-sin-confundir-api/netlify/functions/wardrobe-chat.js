// Función serverless que conecta la app "Combina sin Confundir" con la API
// gratuita de Google Gemini (no necesita tarjeta de crédito).
// Documentación: https://ai.google.dev/gemini-api/docs

const GEMINI_MODEL = "gemini-3.6-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// En producción, pon aquí tu dominio (ej: "https://anaalmudi.com") en vez de "*".
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "https://anaalmudi.com";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const DALTONISMO_AVISOS = {
  protanopia: "Evita combinaciones de rojo con verde o marrón, ya que le costará distinguirlas.",
  deuteranopia: "Evita combinaciones de verde con rojo o marrón, ya que le costará distinguirlas.",
  tritanopia: "Evita combinaciones de azul con morado, o de amarillo con verde claro, ya que le costará distinguirlas.",
};

function construirSystemPrompt(armario, daltonismo) {
  const listaArmario = armario
    .map((p) => `- ${p.nombre} (tipo: ${p.tipo}, color: ${p.color})`)
    .join("\n");

  const notaDaltonismo = daltonismo
    ? `La persona tiene ${daltonismo}. ${DALTONISMO_AVISOS[daltonismo] || ""}`
    : "La persona no tiene daltonismo, así que no hace falta tener ninguna precaución especial con los colores.";

  return `Eres el chatbot de estilismo de "Combina sin Confundir", una app de armario virtual. Hablas en español de España, en un tono cercano y natural, como un amigo con buen ojo para la ropa.

Este es el armario de la persona (solo puedes recomendar prendas de esta lista, no te inventes ninguna):
${listaArmario}

${notaDaltonismo}

Cuando te pregunten qué ponerse o cómo combinar algo:
- Recomienda solo prendas que estén en la lista de arriba.
- Ten en cuenta la nota sobre daltonismo al elegir combinaciones de color.
- Sé breve y directo (2-4 frases), como si estuvieras respondiendo por chat.
- Si el armario no tiene prendas suficientes para lo que piden, dilo con naturalidad y sugiere lo más parecido que haya.`;
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Método no permitido" }),
    };
  }

  if (!process.env.GEMINI_API_KEY) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Falta configurar GEMINI_API_KEY en el servidor" }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "El cuerpo de la petición no es JSON válido" }),
    };
  }

  const { armario, daltonismo, mensajes } = payload;

  if (!Array.isArray(armario) || armario.length === 0) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "El armario está vacío" }),
    };
  }

  if (!Array.isArray(mensajes) || mensajes.length === 0) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Falta el mensaje de la conversación" }),
    };
  }

  // Gemini usa los roles "user" y "model" (no "assistant").
  const contents = mensajes.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  try {
    const geminiResponse = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: construirSystemPrompt(armario, daltonismo) }] },
        contents,
      }),
    });

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      console.error("Error de la API de Gemini:", data);
      throw new Error(data.error?.message || "Respuesta de error de Gemini");
    }

    const texto = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";

    if (!texto) {
      const motivo = data.promptFeedback?.blockReason;
      throw new Error(motivo ? `respuesta bloqueada (${motivo})` : "respuesta vacía del modelo");
    }

    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify({ respuesta: texto }),
    };
  } catch (err) {
    console.error("Error al llamar a la API de Gemini:", err);
    return {
      statusCode: 502,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "No se ha podido generar la respuesta. Inténtalo de nuevo en un momento." }),
    };
  }
};
