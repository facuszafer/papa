import { useState } from 'react'
import SearchPanel from './components/SearchPanel.jsx'
import ResultCard from './components/ResultCard.jsx'
import LoadingState from './components/LoadingState.jsx'
import { investigarEmpresa, sugerirTargets } from './api.js'

let nextId = 0

// La API devuelve texto que debería ser JSON puro, pero puede venir
// envuelto en backticks o con texto alrededor: extraemos el primer
// objeto/array balanceado antes de parsear.
function parseRespuesta(texto) {
  try {
    return JSON.parse(texto)
  } catch {
    const start = texto.search(/[[{]/)
    if (start === -1) throw new Error('La respuesta no contiene JSON válido')
    const end = Math.max(texto.lastIndexOf('}'), texto.lastIndexOf(']'))
    return JSON.parse(texto.slice(start, end + 1))
  }
}

function App() {
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleInvestigate(empresa, rubroDecisor) {
    setError(null)
    setIsLoading(true)
    try {
      const raw = await investigarEmpresa(empresa, rubroDecisor)
      const parsed = parseRespuesta(raw)
      setResults((prev) => [{ id: nextId++, data: parsed }, ...prev])
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSuggest(descripcion, cantidad) {
    setError(null)
    setIsLoading(true)
    try {
      const raw = await sugerirTargets(descripcion, cantidad)
      const parsed = parseRespuesta(raw)
      const items = (Array.isArray(parsed) ? parsed : [parsed]).map((data) => ({
        id: nextId++,
        data,
      }))
      setResults((prev) => [...items, ...prev])
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <header className="header">
        <span className="header__brand">ON FIT</span>
        <span className="header__subtitle">/ Agente de Prospecting</span>
      </header>

      <main className="layout">
        <div className="layout__left">
          <SearchPanel
            onInvestigate={handleInvestigate}
            onSuggest={handleSuggest}
            isLoading={isLoading}
          />
        </div>
        <div className="layout__right">
          {error && <div className="error-banner">{error}</div>}
          {isLoading ? (
            <LoadingState />
          ) : results.length > 0 ? (
            <div className="results-grid">
              {results.map(({ id, data }) => (
                <ResultCard key={id} data={data} />
              ))}
            </div>
          ) : (
            <div className="results">Los resultados aparecen acá</div>
          )}
        </div>
      </main>
    </>
  )
}

export default App
