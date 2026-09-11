import { useState } from 'react'

function scoreVariant(score) {
  if (score >= 9) return 'green'
  if (score >= 7) return 'orange'
  return 'red'
}

function ResultCard({ data }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(data.mensaje_linkedin)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // El clipboard puede fallar fuera de HTTPS/localhost; no rompemos la card
    }
  }

  return (
    <article className="result-card">
      <header className="result-card__header">
        <h3 className="result-card__empresa">{data.empresa}</h3>
        <span
          className={`result-card__badge result-card__badge--${scoreVariant(data.fit?.score)}`}
        >
          {data.fit?.score}/10
        </span>
      </header>

      <p className="result-card__descripcion">{data.descripcion}</p>

      <section className="result-card__section">
        <span className="result-card__eyebrow">
          {data.decisor?.cargo || 'Decisor'}
        </span>
        <div className="result-card__decisor">
          <span className="result-card__nombre">
            {data.decisor?.nombre || 'No encontrado'}
          </span>
          {data.decisor?.linkedin && (
            <a
              className="result-card__linkedin"
              href={data.decisor.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver perfil
            </a>
          )}
        </div>
      </section>

      <section className="result-card__section">
        <span className="result-card__eyebrow">Por qué On Fit</span>
        <p className="result-card__texto">{data.fit?.argumento}</p>
      </section>

      <section className="result-card__section">
        <span className="result-card__eyebrow">Mensaje LinkedIn</span>
        <div className="result-card__mensaje">
          <textarea
            className="result-card__textarea"
            value={data.mensaje_linkedin}
            readOnly
            rows={5}
          />
          <button
            className="result-card__copiar"
            type="button"
            onClick={handleCopy}
          >
            {copied ? 'Copiado ✓' : 'Copiar'}
          </button>
        </div>
      </section>
    </article>
  )
}

export default ResultCard
