function SearchPanel() {
  return (
    <aside className="search-panel">
      <h2 className="search-panel__title">Búsqueda</h2>

      <div className="search-panel__field">
        <label className="search-panel__label" htmlFor="search-query">
          ¿Qué buscás?
        </label>
        <input
          id="search-query"
          className="search-panel__input"
          type="text"
          placeholder="Ej: gimnasios en Palermo"
        />
      </div>

      <button className="search-panel__button" type="button">
        Buscar
      </button>
    </aside>
  )
}

export default SearchPanel
