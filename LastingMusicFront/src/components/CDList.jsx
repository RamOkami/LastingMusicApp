import React from 'react';
import { Search, X, Grid, Info, Disc } from 'lucide-react';
import CDCard from './CDCard';
export default function CDList({
  activeTab,
  setActiveTab,
  selectedGenre,
  setSelectedGenre,
  searchQuery,
  setSearchQuery,
  onlyObi,
  setOnlyObi,
  cds,
  onSelectCD,
  onAddToCart,
  allCDsCount,
  genres
}) {
  return (
    <section aria-labelledby="catalog-title">
      {/* Search and Filters bar */}
      <div className="mb-10 space-y-6">
        
        {/* Header and Search */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="text-left">
            <h2 id="catalog-title" className="text-2xl font-bold tracking-tight text-neutral-100">Catálogo Físico</h2>
            <p className="text-xs text-neutral-400 mt-1 font-mono">Filtra ediciones exclusivas y pre-encargos</p>
          </div>

          {/* Search and Obi filter wrapper */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:max-w-xl">
            {/* Search Bar */}
            <div className="relative flex-grow">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                <Search className="w-4 h-4" />
              </span>
              <label htmlFor="search-input" className="sr-only">Buscar por título o artista</label>
              <input
                id="search-input"
                type="search"
                placeholder="Buscar por título, artista..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900/50 border border-neutral-800/80 rounded-lg pl-9 pr-4 py-2.5 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all font-sans"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-neutral-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Obi Filter Toggle */}
            <button
              onClick={() => setOnlyObi(!onlyObi)}
              className={`px-4 py-2.5 rounded-lg border text-sm font-medium tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer ${
                onlyObi
                  ? 'bg-white/10 border-white/50 text-white shadow-md'
                  : 'bg-neutral-900/30 border-neutral-800/80 text-neutral-400 hover:border-neutral-700/80 hover:text-neutral-200'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${onlyObi ? 'bg-white' : 'bg-neutral-600'}`}></div>
              <span>Con OBI Strip JP</span>
            </button>
          </div>
        </div>

        {/* Genre Selector Chips */}
        <div className="border-t border-b border-neutral-900 py-3.5">
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none">
            <span className="text-xs font-mono text-neutral-500 mr-2 flex items-center gap-1 uppercase select-none">
              <Grid className="w-3.5 h-3.5" /> Géneros:
            </span>
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all uppercase tracking-wide cursor-pointer ${
                  selectedGenre === genre
                    ? 'bg-white text-black shadow-sm font-bold border border-white'
                    : 'bg-neutral-900/50 text-neutral-400 border border-neutral-850 hover:border-neutral-700 hover:text-neutral-200'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Three Main Tabs */}
        <div className="flex border-b border-neutral-800" role="tablist" aria-label="Distribución de catálogo musical">
          <button
            id="tab-disponible"
            role="tab"
            aria-selected={activeTab === 'disponible'}
            aria-controls="catalog-grid"
            onClick={() => setActiveTab('disponible')}
            className={`flex-1 py-4 text-center font-semibold text-sm tracking-wider uppercase border-b-2 transition-all cursor-pointer relative ${
              activeTab === 'disponible'
                ? 'border-white text-white bg-white/2'
                : 'border-transparent text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/10'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              Disponibles
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 font-normal">
                {allCDsCount.disponible}
              </span>
            </span>
            {activeTab === 'disponible' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white"></span>
            )}
          </button>
          <button
            id="tab-transito"
            role="tab"
            aria-selected={activeTab === 'transito'}
            aria-controls="catalog-grid"
            onClick={() => setActiveTab('transito')}
            className={`flex-1 py-4 text-center font-semibold text-sm tracking-wider uppercase border-b-2 transition-all cursor-pointer relative ${
              activeTab === 'transito'
                ? 'border-white text-white bg-white/2'
                : 'border-transparent text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/10'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              En Tránsito
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 font-normal">
                {allCDsCount.transito}
              </span>
            </span>
            {activeTab === 'transito' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white"></span>
            )}
          </button>
          <button
            id="tab-encargo"
            role="tab"
            aria-selected={activeTab === 'encargo'}
            aria-controls="catalog-grid"
            onClick={() => setActiveTab('encargo')}
            className={`flex-1 py-4 text-center font-semibold text-sm tracking-wider uppercase border-b-2 transition-all cursor-pointer relative ${
              activeTab === 'encargo'
                ? 'border-white text-white bg-white/2'
                : 'border-transparent text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/10'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              Encargos (Japón)
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 font-normal">
                {allCDsCount.encargo}
              </span>
            </span>
            {activeTab === 'encargo' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white"></span>
            )}
          </button>
        </div>

        {/* Tab Contextual Warning Info */}
        <div className="p-4 rounded-xl border border-neutral-900 bg-neutral-950/40 text-neutral-400 text-xs flex items-start gap-3 text-left">
          <Info className="w-4.5 h-4.5 text-white shrink-0 mt-0.5" />
          <div>
            {activeTab === 'disponible' && (
              <p>
                <strong>CD's listos para entrega inmediata:</strong> Envío express a todo Chile desde Santiago. Plazo estimado de entrega de 2 a 4 días hábiles.
              </p>
            )}
            {activeTab === 'transito' && (
              <p>
                <strong>Álbumes en ruta de distribución:</strong> Estas copias ya vienen hacia Chile. Puedes reservarlas ahora mismo para asegurar tu copia antes de que se agoten. Envío estimado en 1-2 meses.
              </p>
            )}
            {activeTab === 'encargo' && (
              <p>
                <strong>Pedidos especiales de importación a Japón:</strong> Se encargan bajo demanda al distribuidor. Plazo estimado de entrega de 1 a 2 meses debido a trámites aduaneros. Suele incluir el Obi Strip japonés original de colección.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Grid rendering */}
      {cds.length > 0 ? (
        <ul id="catalog-grid" role="tabpanel" aria-labelledby={`tab-${activeTab}`} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {cds.map((cd) => (
            <li key={cd.id}>
              <CDCard
                cd={cd}
                onSelect={() => onSelectCD(cd)}
                onAddToCart={onAddToCart}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div id="catalog-grid" role="tabpanel" aria-labelledby={`tab-${activeTab}`} className="text-center py-20 rounded-2xl border border-neutral-900 bg-neutral-900/10">
          <Disc className="w-12 h-12 text-neutral-600 mx-auto animate-pulse mb-4" />
          <h3 className="text-lg font-semibold text-neutral-400">No se encontraron álbumes</h3>
          <p className="text-sm text-neutral-500 mt-1 max-w-md mx-auto">
            Prueba cambiando los filtros de género, la barra de búsqueda o desactivando el filtro de Obi Strip.
          </p>
          <button
            onClick={() => {
              setSelectedGenre('Todos');
              setSearchQuery('');
              setOnlyObi(false);
            }}
            className="mt-5 text-xs font-semibold text-neutral-300 hover:underline hover:text-white"
          >
            Restaurar todos los filtros
          </button>
        </div>
      )}
    </section>
  );
}
