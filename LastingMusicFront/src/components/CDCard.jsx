import React from 'react';
import { Disc } from 'lucide-react';

export default function CDCard({ cd, onSelect, onAddToCart }) {
  return (
    <article className="group relative flex flex-col h-full" aria-labelledby={`cd-title-${cd.id}`}>
      {/* CD sleeve animation wrapper */}
      <button 
        type="button"
        onClick={onSelect}
        className="relative w-full aspect-square max-w-[240px] mx-auto flex items-center justify-center cursor-pointer mb-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-lg"
        aria-label={`Ver detalles de ${cd.title}`}
      >
        {/* Compact Disc (rotates on hover & slides out) */}
        <div className="absolute top-2 right-2 w-[85%] h-[85%] rounded-full bg-gradient-to-tr from-zinc-300 via-neutral-100 to-neutral-400 border border-neutral-400/40 flex items-center justify-center shadow-lg transition-all duration-500 ease-out group-hover:translate-x-12 group-hover:rotate-180 z-0">
          {/* Holographic light reflection sheen */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-neutral-300/10 to-neutral-400/20 mix-blend-overlay"></div>
          {/* CD circular reflections */}
          <div className="absolute inset-3 rounded-full border border-white/20"></div>
          <div className="absolute inset-6 rounded-full border border-white/10"></div>
          <div className="absolute inset-9 rounded-full border border-neutral-400/25"></div>
          {/* Inner Clear Plastic Ring */}
          <div className="w-14 h-14 rounded-full border border-neutral-400/35 bg-white/25 backdrop-blur-xs flex items-center justify-center relative">
            {/* Center Hole */}
            <div className="w-5 h-5 rounded-full bg-neutral-950 border border-neutral-800/30 shadow-inner"></div>
          </div>
        </div>

        {/* Cover Art Box (Z-index 10, covers the disc) */}
        <div className={`absolute inset-0 ${cd.coverUrl ? 'bg-neutral-900' : `bg-gradient-to-br ${cd.coverColor}`} rounded-md shadow-xl transition-transform duration-300 group-hover:-translate-x-6 z-10 flex flex-col justify-between p-4 border border-white/10 overflow-hidden`}>
          {cd.coverUrl && (
            <img 
              src={cd.coverUrl} 
              alt={cd.title} 
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover z-0 opacity-80 group-hover:opacity-100 transition-opacity"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          {/* Subtle background grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[size:16px_16px] pointer-events-none z-10"></div>

          {/* Top: Genre badge (relative z-25 to sit above OBI z-20) */}
          <div className="relative z-25 flex justify-between items-start">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-black/60 text-white px-2 py-0.5 rounded backdrop-blur-sm border border-white/5">
              {cd.genre}
            </span>
            <span className="text-[9px] font-mono text-white/50">{cd.releaseYear}</span>
          </div>

          {/* Middle: Simulated CD art print (only if no coverUrl) */}
          {!cd.coverUrl && (
            <div className="relative z-10 flex items-center justify-center my-auto">
              <Disc className="w-14 h-14 text-white/20 stroke-[1]" />
            </div>
          )}

          {/* Bottom: Title & Artist text inside cover (relative z-25 to sit above OBI z-20) */}
          <div className="relative z-25 text-left mt-auto">
            <h4 className="text-sm font-bold text-white tracking-wide truncate bg-black/40 px-1 py-0.5 rounded backdrop-blur-xs inline-block max-w-full">{cd.title}</h4>
            <p className="text-[10px] text-white/80 font-mono truncate bg-black/40 px-1 py-0.5 rounded backdrop-blur-xs block mt-0.5">{cd.artist}</p>
          </div>

          {/* OBI Strip overlay (authentic Japanese spine card) */}
          {cd.hasObi && (
            <div className="absolute left-0 top-0 bottom-0 w-[30px] bg-white text-neutral-950 flex flex-col justify-between items-center py-3 select-none z-20 shadow-md border-r border-neutral-200/50">
              <span className="text-[7px] font-mono font-extrabold tracking-[0.2em] [writing-mode:vertical-lr] uppercase">
                帯 OBI STRIP
              </span>
              <span className="text-[8px] font-sans font-bold text-neutral-900 border-t border-neutral-300 pt-1">
                JP
              </span>
            </div>
          )}
        </div>
      </button>

      {/* Metadata & Actions under the card */}
      <div className="text-center sm:text-left mt-2 flex-grow flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 
            id={`cd-title-${cd.id}`}
            className="font-semibold text-base tracking-tight text-neutral-100 hover:text-white transition-colors truncate w-4/5 text-left"
          >
            <button 
              type="button"
              onClick={onSelect}
              className="hover:text-white cursor-pointer transition-colors text-left font-semibold text-base tracking-tight focus:outline-none focus-visible:underline"
            >
              {cd.title}
            </button>
          </h3>
          <span className="font-mono text-sm font-bold text-neutral-200">
            {'$' + cd.price.toLocaleString('es-CL')}
          </span>
        </div>
        <p className="text-xs text-neutral-400 font-mono mt-0.5 text-left">{cd.artist}</p>
        
        {/* Details (Origin and OBI status) */}
        <div className="mt-2.5 flex flex-wrap gap-1.5 justify-center sm:justify-start">
          <span className="inline-flex items-center text-[9px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded">
            {cd.origin}
          </span>
          {cd.hasObi && (
            <span className="inline-flex items-center text-[9px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded">
              Con Obi
            </span>
          )}
        </div>

        {/* Buy Button & estimated delivery */}
        <div className="mt-auto pt-3 border-t border-neutral-900/60 flex items-center justify-between gap-2">
          <span className="text-[10px] text-neutral-500 font-mono">
            {cd.waitTime}
          </span>
          <button
            onClick={() => onAddToCart(cd)}
            className={`text-xs font-semibold px-3 py-1.5 rounded transition-all cursor-pointer border ${
              cd.status === 'disponible' 
                ? 'bg-white hover:bg-neutral-200 text-black border-white shadow-sm'
                : cd.status === 'transito'
                  ? 'bg-neutral-900 border-neutral-800 text-white hover:bg-white hover:text-black hover:border-white'
                  : 'bg-neutral-950 border-neutral-850 text-neutral-400 hover:bg-neutral-900 hover:text-white hover:border-neutral-800'
            }`}
          >
            {cd.status === 'disponible' && 'Añadir'}
            {cd.status === 'transito' && 'Reservar'}
            {cd.status === 'encargo' && 'Encargar'}
          </button>
        </div>
      </div>
    </article>
  );
}
