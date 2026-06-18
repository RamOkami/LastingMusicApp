import React from 'react';
import { Disc, Sparkles, Info } from 'lucide-react';

export default function AdminPreview({
  artist,
  album,
  genre,
  releaseYear,
  description,
  coverUrl,
  tracklistStr,
  hasObi,
  getRandomCoverGradient
}) {
  const tracksCount = tracklistStr.split('\n').filter(t => t.trim().length > 0).length;

  return (
    <aside className="lg:col-span-1" aria-label="Vista previa de ficha de CD">
      <div className="glass-panel border-neutral-800 rounded-xl p-5 h-full flex flex-col justify-between">
        <div>
          <h2 className="text-sm font-bold font-mono text-neutral-400 uppercase tracking-widest border-b border-neutral-900 pb-3 mb-4">
            Vista Previa de Ficha
          </h2>

          {(artist || album || genre || releaseYear || coverUrl || tracklistStr) ? (
            <div className="space-y-4">
              {/* CD Cover representation */}
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center select-none shadow-xl rounded-md bg-neutral-900/50 overflow-hidden">
                <div className={`absolute inset-0 ${coverUrl ? 'bg-neutral-900' : `bg-gradient-to-br ${getRandomCoverGradient(genre)}`} rounded-md border border-white/10 flex flex-col justify-between p-2.5 overflow-hidden`}>
                  {coverUrl && (
                    <img 
                      src={coverUrl} 
                      alt={album || 'Portada'} 
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  
                  {!coverUrl && (
                    <Disc className="w-6 h-6 text-white/25 stroke-[1] relative z-10 animate-spin-slow" />
                  )}
                  <div className="text-[8px] text-left relative z-10 mt-auto bg-black/50 p-1.5 rounded backdrop-blur-xs">
                    <p className="font-bold text-white truncate leading-none mb-0.5">{album || 'Título'}</p>
                    <p className="text-white/70 truncate leading-none">{artist || 'Artista'}</p>
                  </div>
                  {hasObi && (
                    <div className="absolute left-0 top-0 bottom-0 w-4 bg-white text-[5px] text-neutral-950 font-bold flex items-center justify-center uppercase [writing-mode:vertical-lr] py-1 border-r border-neutral-200/50 z-20 shadow-md">
                      OBI
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-left">
                <div>
                  <span className="text-neutral-500 font-mono text-[10px] block font-semibold">GÉNERO</span>
                  <span className="text-white font-bold uppercase tracking-wider">{genre || 'No especificado'}</span>
                </div>
                <div>
                  <span className="text-neutral-500 font-mono text-[10px] block font-semibold">AÑO DE PRENSA</span>
                  <span className="text-neutral-300 font-semibold">{releaseYear || 'No especificado'}</span>
                </div>
                <div>
                  <span className="text-neutral-500 font-mono text-[10px] block font-semibold">DESCRIPCIÓN</span>
                  <p className="text-neutral-400 text-[11px] leading-relaxed font-light mt-0.5">{description || 'Sin descripción física.'}</p>
                </div>
                <div>
                  <span className="text-neutral-500 font-mono text-[10px] block font-semibold">LISTA DE CANCIONES ({tracksCount})</span>
                  <ul className="list-decimal list-inside text-neutral-400 text-[10px] font-mono max-h-24 overflow-y-auto pl-1 pr-1.5 scrollbar-thin">
                    {tracklistStr.split('\n').filter(t => t.trim().length > 0).map((track, i) => (
                      <li key={i} className="truncate">{track}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-neutral-500">
              <Sparkles className="w-8 h-8 mx-auto text-neutral-600 mb-3 animate-pulse" />
              <p className="text-xs leading-relaxed max-w-[180px] mx-auto">
                Ingresa artista y álbum y presiona "Buscar en APIs" o rellena los campos para ver la vista previa.
              </p>
            </div>
          )}
        </div>

        {/* Note box */}
        <div className="p-3.5 bg-neutral-950/40 rounded-lg border border-neutral-900 mt-6 flex items-start gap-2 text-[10px] text-neutral-500 leading-normal text-left">
          <Info className="w-4 h-4 text-white shrink-0 mt-0.5" />
          <p>
            Puedes usar el token opcional de Discogs para consultar esa base de datos o dejarlo vacío para consultar de forma gratuita e inmediata el catálogo de iTunes.
          </p>
        </div>
      </div>
    </aside>
  );
}
