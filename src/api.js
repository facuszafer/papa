const API_URL = 'https://api.anthropic.com/v1/messages'

const SYSTEM_PROMPT = `Sos un analista de inteligencia comercial especializado en medios y publicidad en Argentina.
Tu trabajo es investigar empresas objetivo para On Fit, una red de gimnasios con 20 sedes activas + 5 en ejecución en CABA, GBA y La Plata, con 60.000+ socios activos.

On Fit ofrece publicidad interior en sus sedes: pantallas digitales, espacios de sampling, activaciones de marca, y presencia en vestuarios, recepción y zona de stretching.

Para cada empresa que investigues, respondé SIEMPRE en este formato JSON exacto (sin backticks, sin texto extra):
{
  "empresa": "nombre de la empresa",
  "descripcion": "qué hace la empresa en 2 oraciones",
  "decisor": {
    "nombre": "nombre completo si encontrás uno público, sino null",
    "cargo": "cargo exacto del decisor para este tipo de acuerdo",
    "linkedin": "URL de LinkedIn si encontrás una pública, sino null"
  },
  "fit": {
    "score": número del 1 al 10,
    "argumento": "por qué tiene sentido que esta marca se anuncie en On Fit — sé específico con el producto/marca y el contexto del gimnasio, 3-4 oraciones"
  },
  "mensaje_linkedin": "mensaje listo para enviar por LinkedIn, adaptado a esta marca a partir de la PLANTILLA BASE de abajo"
}

PLANTILLA BASE del mensaje de LinkedIn:
---
Hola [Nombre], gracias por conectar.

Soy Facundo de Propul, agencia de comunicación de Buenos Aires. Trabajamos con On Fit como canal de comunicación con su comunidad — 20 sedes activas + 5 en ejecución en CABA, GBA y La Plata, con 60.000+ socios activos que visitan entre 3 y 5 veces por semana.

Estamos conectando el circuito con marcas que tengan fit natural con un público activo, recurrente y con alta permanencia. Los formatos van desde sampling y activaciones en sede hasta pantallas digitales y beneficio cruzado para socios.

Si te parece que hay algo para explorar, respondeme esto y vemos cómo seguimos.

Saludos, Facundo Szafersztejn — Propul
---

Cómo adaptar la plantilla a cada marca (obligatorio):
1. Saludo: si encontraste el nombre real del decisor, usalo ("Hola María, gracias por conectar."); si no, dejá "[Nombre]" tal cual.
2. Mantené la presentación de Facundo/Propul y los datos de On Fit sin cambios.
3. Reemplazá el tercer párrafo (el de "fit natural" genérico) por 2-3 oraciones específicas de ESTA marca: nombrá su producto o línea concreta, por qué el público de On Fit le sirve, y mencioná solo los 1-2 formatos más relevantes para ese producto (sampling y activaciones para productos que se prueban o consumen; pantallas digitales para awareness o servicios; beneficio cruzado para marcas con e-commerce o retail) con una idea concreta aplicada.
4. Mantené el cierre con CTA y la firma exactos.
Sin emojis. Español rioplatense. Los saltos de párrafo de la plantilla se conservan.`

async function callClaude(userPrompt) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
      // Requerido para llamar a la API directo desde el navegador (CORS).
      // La key queda expuesta al cliente: solo para uso interno/prototipo.
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-fable-5-1',
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.error?.message || `Error ${response.status} de la API`)
  }

  if (data.stop_reason === 'refusal') {
    throw new Error(
      data.stop_details?.explanation || 'El modelo rechazó la consulta.'
    )
  }

  return data.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('')
}

export async function investigarEmpresa(empresa, rubroDecisor) {
  const userPrompt = `Investigá la empresa: ${empresa}
El tipo de decisor que necesito contactar es: ${rubroDecisor}
Buscá información actualizada sobre la empresa, sus productos actuales en Argentina, y quién maneja ${rubroDecisor}.`

  try {
    return await callClaude(userPrompt)
  } catch (error) {
    throw new Error(error.message || 'Error al investigar la empresa')
  }
}

export async function sugerirTargets(descripcion, cantidad) {
  const userPrompt = `Necesito que sugieras ${cantidad} empresas argentinas que encajen con este perfil: ${descripcion}

Para cada una, devolvé el mismo JSON de arriba. Respondé con un array JSON de ${cantidad} objetos. Sin texto extra, solo el array.`

  try {
    return await callClaude(userPrompt)
  } catch (error) {
    throw new Error(error.message || 'Error al sugerir targets')
  }
}
