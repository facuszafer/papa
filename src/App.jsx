import SearchPanel from './components/SearchPanel.jsx'

function App() {
  return (
    <>
      <header className="header">
        <span className="header__brand">ON FIT</span>
        <span className="header__subtitle">/ Agente de Prospecting</span>
      </header>

      <main className="layout">
        <div className="layout__left">
          <SearchPanel />
        </div>
        <div className="layout__right">
          <div className="results">Los resultados aparecen acá</div>
        </div>
      </main>
    </>
  )
}

export default App
