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
  "mensaje_linkedin": "mensaje listo para enviar por LinkedIn, máximo 5 oraciones. Primera oración sobre la empresa/persona, no sobre On Fit. Informal pero profesional. En español rioplatense. Sin emojis. Terminá con una pregunta o CTA concreto tipo 'respondeme esto y coordinamos'."
}`

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
      max_tokens: 2000,
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
