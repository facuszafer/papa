import { useState } from 'react'

const RUBROS_DECISOR = [
  'Trade Marketing',
  'Brand Manager',
  'Growth/Performance',
  'Gerente de Marketing',
  'Media Agency',
  'Dirección General',
]

const CANTIDADES = [3, 5, 10]

function SearchPanel({ onInvestigate, onSuggest, isLoading }) {
  const [mode, setMode] = useState('investigate')
  const [empresa, setEmpresa] = useState('')
  const [rubroDecisor, setRubroDecisor] = useState(RUBROS_DECISOR[0])
  const [descripcion, setDescripcion] = useState('')
  const [cantidad, setCantidad] = useState(5)

  function handleInvestigate(e) {
    e.preventDefault()
    if (isLoading || !empresa.trim()) return
    onInvestigate(empresa.trim(), rubroDecisor)
  }

  function handleSuggest(e) {
    e.preventDefault()
    if (isLoading || !descripcion.trim()) return
    onSuggest(descripcion.trim(), cantidad)
  }

  return (
    <aside className="search-panel">
      <div className="search-panel__tabs">
        <button
          type="button"
          className={
            'search-panel__tab' +
            (mode === 'investigate' ? ' search-panel__tab--active' : '')
          }
          onClick={() => setMode('investigate')}
        >
          Investigar empresa
        </button>
        <button
          type="button"
          className={
            'search-panel__tab' +
            (mode === 'suggest' ? ' search-panel__tab--active' : '')
          }
          onClick={() => setMode('suggest')}
        >
          Sugerir targets
        </button>
      </div>

      {mode === 'investigate' ? (
        <form className="search-panel__form" onSubmit={handleInvestigate}>
          <div className="search-panel__field">
            <label className="search-panel__label" htmlFor="sp-empresa">
              Empresa
            </label>
            <input
              id="sp-empresa"
              className="search-panel__input"
              type="text"
              placeholder="Ej: Bayer Argentina"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="search-panel__field">
            <label className="search-panel__label" htmlFor="sp-rubro">
              Rubro del decisor
            </label>
            <select
              id="sp-rubro"
              className="search-panel__input search-panel__select"
              value={rubroDecisor}
              onChange={(e) => setRubroDecisor(e.target.value)}
              disabled={isLoading}
            >
              {RUBROS_DECISOR.map((rubro) => (
                <option key={rubro} value={rubro}>
                  {rubro}
                </option>
              ))}
            </select>
          </div>

          <button
            className="search-panel__button"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Investigando…' : 'Investigar'}
          </button>
        </form>
      ) : (
        <form className="search-panel__form" onSubmit={handleSuggest}>
          <div className="search-panel__field">
            <label className="search-panel__label" htmlFor="sp-descripcion">
              Describí el perfil que buscás
            </label>
            <textarea
              id="sp-descripcion"
              className="search-panel__input search-panel__textarea"
              placeholder="Ej: marcas de consumo masivo con foco en salud y bienestar, presupuesto medio-alto, que vendan en farmacias"
              rows={5}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="search-panel__field">
            <span className="search-panel__label">Número de sugerencias</span>
            <div className="search-panel__count-group" role="group">
              {CANTIDADES.map((n) => (
                <button
                  key={n}
                  type="button"
                  className={
                    'search-panel__count' +
                    (cantidad === n ? ' search-panel__count--active' : '')
                  }
                  onClick={() => setCantidad(n)}
                  disabled={isLoading}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button
            className="search-panel__button"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Sugiriendo…' : 'Sugerir'}
          </button>
        </form>
      )}
    </aside>
  )
}

export default SearchPanel
