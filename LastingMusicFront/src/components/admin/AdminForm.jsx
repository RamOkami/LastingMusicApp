import React from 'react';
import { Plus, Sparkles, Check, Loader2, Disc } from 'lucide-react';

export default function AdminForm({
  artist,
  setArtist,
  album,
  setAlbum,
  status,
  setStatus,
  isJapanese,
  setIsJapanese,
  hasObi,
  setHasObi,
  price,
  setPrice,
  genre,
  setGenre,
  releaseYear,
  setReleaseYear,
  description,
  setDescription,
  coverUrl,
  setCoverUrl,
  tracklistStr,
  setTracklistStr,
  discogsToken,
  setDiscogsToken,
  isLoading,
  errorMsg,
  searchResults,
  setSearchResults,
  handleAutocomplete,
  handleSelectResult,
  handleSaveCD,
  autocompletePreview
}) {
  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="glass-panel border-neutral-800 rounded-xl p-6">
        <h2 className="text-lg font-bold tracking-tight mb-5 flex items-center gap-2 text-neutral-100">
          <Plus className="w-5 h-5 text-white" /> Registrar Nuevo CD
        </h2>

        <form onSubmit={handleSaveCD} className="space-y-4">
          
          {/* Token Input */}
          <div className="bg-neutral-900/30 border border-neutral-800/80 p-3 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="discogs-token-input" className="text-[10px] font-bold font-mono text-neutral-400 uppercase cursor-pointer">
                Discogs Personal Access Token (Opcional)
              </label>
              <a 
                href="https://www.discogs.com/settings/developers" 
                target="_blank" 
                rel="noreferrer"
                className="text-[9px] text-neutral-300 hover:text-white hover:underline flex items-center gap-0.5"
              >
                Obtener Token <span className="text-[7px]">↗</span>
              </a>
            </div>
            <input
              id="discogs-token-input"
              type="password"
              placeholder="Pega tu token aquí para buscar datos reales en la base de Discogs"
              value={discogsToken}
              onChange={(e) => setDiscogsToken(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-neutral-300 focus:outline-none focus:border-white font-mono"
            />
          </div>

          {/* Core form data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="artist-input" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 cursor-pointer">Artista</label>
              <input
                id="artist-input"
                type="text"
                required
                placeholder="Ej. MF DOOM"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-white"
              />
            </div>
            
            <div>
              <label htmlFor="album-input" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 cursor-pointer">Álbum / Título</label>
              <input
                id="album-input"
                type="text"
                required
                placeholder="Ej. MM..FOOD"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-white"
              />
            </div>
          </div>

          {/* Status and Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="status-input" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 cursor-pointer">Distribución (Pestaña)</label>
              <select
                id="status-input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-white"
              >
                <option value="disponible">Disponible (Entrega Inmediata)</option>
                <option value="transito">En Tránsito (Reserva)</option>
                <option value="encargo">Encargos Japón (1-2 meses)</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="price-input" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 cursor-pointer">Precio (CLP)</label>
              <input
                id="price-input"
                type="number"
                required
                placeholder="Ej. 29990"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-white font-mono"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-6 py-2 border-t border-neutral-900 pt-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is-japanese-input"
                checked={isJapanese}
                onChange={(e) => {
                  setIsJapanese(e.target.checked);
                  if (e.target.checked) setHasObi(true);
                }}
                className="rounded text-white focus:ring-white w-4 h-4 bg-neutral-900 border-neutral-800"
              />
              <label htmlFor="is-japanese-input" className="text-xs text-neutral-400 select-none cursor-pointer">
                Edición Japonesa
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="has-obi-input"
                checked={hasObi}
                onChange={(e) => setHasObi(e.target.checked)}
                className="rounded text-white focus:ring-white w-4 h-4 bg-neutral-900 border-neutral-800"
              />
              <label htmlFor="has-obi-input" className="text-xs text-neutral-400 select-none cursor-pointer">
                Incluye faja OBI Strip
              </label>
            </div>
          </div>

          {/* Search Results Selection List */}
          {searchResults.length > 0 && (
            <div className="bg-neutral-900/50 border border-neutral-850 p-4 rounded-xl space-y-3 mt-4 text-left">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                  Resultados Encontrados ({searchResults.length})
                </span>
                <button 
                  type="button"
                  onClick={() => setSearchResults([])}
                  className="text-[10px] text-neutral-500 hover:text-neutral-300 cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                {searchResults.map((result, index) => (
                  <button
                    key={`${result.source}-${result.id}-${index}`}
                    type="button"
                    onClick={() => handleSelectResult(result)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg bg-neutral-950/40 hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-800 transition-all text-left group cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-neutral-900 rounded overflow-hidden shrink-0 border border-white/5">
                      {result.coverUrl ? (
                        <img 
                          src={result.coverUrl} 
                          alt={result.title} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-600">
                          <Disc className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-xs font-bold text-neutral-200 truncate group-hover:text-white transition-colors">
                        {result.title}
                      </p>
                      <p className="text-[10px] text-neutral-400 truncate font-mono">
                        {result.artist}
                      </p>
                    </div>
                    <div className="text-right shrink-0 font-mono text-[9px] text-neutral-500 flex flex-col items-end gap-1">
                      <span className="bg-neutral-900 px-1 py-0.5 rounded text-[8px] border border-neutral-800 uppercase text-neutral-400 font-bold">
                        {result.source}
                      </span>
                      <span>{result.year || 'N/A'}</span>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-[9px] text-neutral-500 leading-normal font-mono">
                * Haz clic sobre el álbum correcto para cargar su lista de canciones, carátula y género oficiales.
              </p>
            </div>
          )}

          {/* Metadata Fields */}
          <div className="border-t border-neutral-900 pt-5 mt-5 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold font-mono text-neutral-400 uppercase tracking-wider">
                Metadatos del CD (Autocompletados o Manuales)
              </h3>
              <span className="text-[10px] text-neutral-500 font-mono">
                {autocompletePreview ? '✓ Autocompletado' : 'Edición manual disponible'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="genre-input" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 cursor-pointer">Género</label>
                <input
                  id="genre-input"
                  type="text"
                  placeholder="Ej. Hip-Hop/Rap, J-Pop, Alternative Rock"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-white"
                />
              </div>
              
              <div>
                <label htmlFor="release-year-input" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 cursor-pointer">Año de Prensa</label>
                <input
                  id="release-year-input"
                  type="text"
                  placeholder="Ej. 2004"
                  value={releaseYear}
                  onChange={(e) => setReleaseYear(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-white font-mono"
                />
              </div>
            </div>

            <div>
              <label htmlFor="cover-url-input" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 cursor-pointer">URL de la Portada (CD Cover)</label>
              <input
                id="cover-url-input"
                type="text"
                placeholder="URL de imagen (https://...)"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-white font-mono text-xs"
              />
              <p className="text-[10px] text-neutral-500 mt-1 font-mono">
                Puedes pegar cualquier URL de imagen para corregir carátulas incorrectas o añadir una personalizada.
              </p>
            </div>

            <div>
              <label htmlFor="tracklist-input" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 cursor-pointer">Lista de Canciones (Una por línea)</label>
              <textarea
                id="tracklist-input"
                rows={4}
                placeholder="Escribe o pega los títulos de las canciones, uno por línea&#10;Ejemplo:&#10;Track 1&#10;Track 2"
                value={tracklistStr}
                onChange={(e) => setTracklistStr(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-white font-mono"
              />
            </div>

            <div>
              <label htmlFor="description-input" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 cursor-pointer">Descripción</label>
              <textarea
                id="description-input"
                rows={2}
                placeholder="Descripción física del estado del CD, edición o detalles de importación..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-white"
              />
            </div>
          </div>

          {/* Fetch Discogs Trigger */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={handleAutocomplete}
              disabled={isLoading || !artist || !album}
              className={`flex-1 py-2.5 px-4 rounded text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                isLoading 
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-500 cursor-not-allowed'
                  : 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-850 hover:border-neutral-700'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Buscando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Buscar en APIs
                </>
              )}
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className={`py-2.5 px-6 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isLoading 
                  ? 'bg-neutral-900 text-neutral-500 cursor-not-allowed'
                  : 'bg-white text-black hover:bg-neutral-200 border border-white font-bold shadow-md'
              }`}
            >
              <Check className="w-4 h-4" /> Guardar Disco
            </button>
          </div>

          {errorMsg && (
            <p className="text-[11px] text-neutral-400 font-mono mt-2 text-left">
              * {errorMsg}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
