import React from 'react';
import { X, Disc, Info, ArrowRight } from 'lucide-react';

export default function CDPlayerModal({
  cd,
  onClose,
  onAddToCart
}) {
  if (!cd) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Overlay back */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-xs transition-opacity"
      ></div>

      {/* Modal Container */}
      <div className="relative glass-panel bg-neutral-950/95 border-neutral-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row max-h-[90vh] md:max-h-none">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-1.5 rounded-full text-neutral-400 hover:text-neutral-200 bg-neutral-900/40 hover:bg-neutral-900 border border-neutral-800 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Artwork Sleeve */}
        <div className="md:w-5/12 bg-neutral-900/30 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-neutral-900">
          
          {/* CD Sleeve inside modal */}
          <div className="relative w-48 h-48 select-none flex items-center justify-center">
            {/* CD Disc */}
            <div className="absolute w-[92%] h-[92%] rounded-full bg-gradient-to-tr from-zinc-300 via-neutral-100 to-neutral-400 border border-neutral-400/40 flex items-center justify-center shadow-lg transition-transform duration-500 translate-x-8 z-0">
              {/* Holographic light reflection sheen */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-neutral-300/10 to-neutral-400/20 mix-blend-overlay"></div>
              {/* CD circular reflections */}
              <div className="absolute inset-3 rounded-full border border-white/20"></div>
              <div className="absolute inset-6 rounded-full border border-white/10"></div>
              <div className="absolute inset-9 rounded-full border border-neutral-400/25"></div>
              {/* Inner Clear Plastic Ring */}
              <div className="w-12 h-12 rounded-full border border-neutral-400/35 bg-white/25 backdrop-blur-xs flex items-center justify-center relative">
                {/* Center Hole */}
                <div className="w-4.5 h-4.5 rounded-full bg-neutral-950 border border-neutral-800/30 shadow-inner"></div>
              </div>
            </div>

            {/* Cover sleeve */}
            <div className={`absolute inset-0 ${cd.coverUrl ? 'bg-neutral-900' : `bg-gradient-to-br ${cd.coverColor}`} rounded-md shadow-xl -translate-x-4 z-10 flex flex-col justify-between p-4 border border-white/10 overflow-hidden transition-transform duration-500`}>
              {cd.coverUrl && (
                <img 
                  src={cd.coverUrl} 
                  alt={cd.title} 
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[size:12px_12px] pointer-events-none z-10"></div>
              
              {/* Top: Genre badge */}
              <div className="relative z-25 flex justify-between items-start text-[8.5px] font-mono">
                <span className="bg-black/60 text-white px-1.5 py-0.5 rounded border border-white/5 uppercase">
                  {cd.genre}
                </span>
                <span className="text-white/60">{cd.releaseYear}</span>
              </div>
              
              {!cd.coverUrl && (
                <div className="relative z-10 flex items-center justify-center my-auto">
                  <Disc className="w-10 h-10 text-white/15 animate-pulse" />
                </div>
              )}

              {/* Bottom: Title & Artist text inside cover */}
              <div className="relative z-25 text-left mt-auto">
                <h4 className="text-xs font-bold text-white tracking-wide truncate bg-black/40 px-1 py-0.5 rounded backdrop-blur-xs inline-block max-w-full">{cd.title}</h4>
                <p className="text-[9px] text-white/70 font-mono truncate bg-black/40 px-1 py-0.5 rounded backdrop-blur-xs block mt-0.5">{cd.artist}</p>
              </div>

              {/* Obi strip inside modal sleeve */}
              {cd.hasObi && (
                <div className="absolute left-0 top-0 bottom-0 w-[24px] bg-white text-neutral-950 flex flex-col justify-between items-center py-2.5 select-none z-20 shadow-md border-r border-neutral-200/50">
                  <span className="text-[6.5px] font-mono font-extrabold tracking-[0.15em] [writing-mode:vertical-lr] uppercase">
                    OBI
                  </span>
                  <span className="text-[7.5px] font-sans font-bold text-neutral-900 border-t border-neutral-300">
                    JP
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Tracklist & Details */}
        <div className="md:w-7/12 p-6 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[85vh] scrollbar-thin">
          
          {/* Product Details Header */}
          <div className="text-left space-y-2">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest font-semibold block">{cd.genre}</span>
            <h2 className="text-2xl font-extrabold text-neutral-100 leading-tight">{cd.title}</h2>
            <p className="text-sm font-semibold text-neutral-400 font-mono">{cd.artist}</p>
            
            {/* Meta details badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-300 px-2 py-0.5 rounded">
                Origen: {cd.origin}
              </span>
              <span className="bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-300 px-2 py-0.5 rounded">
                Año: {cd.releaseYear}
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                cd.status === 'disponible' 
                  ? 'bg-neutral-900 text-neutral-400 border-neutral-800' 
                  : cd.status === 'transito' 
                    ? 'bg-neutral-900 text-neutral-300 border-neutral-850' 
                    : 'bg-neutral-950 text-neutral-400 border-neutral-900'
              }`}>
                {cd.status === 'disponible' && 'Disponible'}
                {cd.status === 'transito' && 'En Tránsito'}
                {cd.status === 'encargo' && 'Encargo Especial'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="text-left mt-4 text-xs sm:text-sm text-neutral-400 leading-relaxed font-light font-sans">
            <p>{cd.description}</p>
          </div>

          {/* OBI Informative Box if has Obi */}
          {cd.hasObi && (
            <div className="mt-4 p-3 bg-neutral-900/40 border border-neutral-800 rounded-lg text-left text-[11px] text-neutral-350 leading-relaxed">
              <div className="font-bold flex items-center gap-1 uppercase tracking-wider text-[9px] mb-1 text-white">
                <Info className="w-3.5 h-3.5" /> Edición Coleccionista con OBI Strip (帯)
              </div>
              El "Obi strip" es una tira de papel informativa típica de los lanzamientos japoneses, muy valorada por coleccionistas de todo el mundo. Indica autenticidad, traducción oficial y enriquece enormemente el valor de reventa física del CD.
            </div>
          )}

          {/* Tracklist List */}
          <div className="mt-5 text-left">
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 select-none">
              <Disc className="w-3.5 h-3.5 text-white" /> Lista de Canciones ({cd.tracklist.length})
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs font-mono max-h-40 overflow-y-auto pr-1 scrollbar-thin">
              {cd.tracklist.map((track, index) => (
                <li 
                  key={index} 
                  className="py-1 px-2 rounded text-left truncate border border-neutral-900 bg-neutral-900/30 text-neutral-400 flex items-center gap-2"
                >
                  <span className="text-neutral-400 font-bold">{String(index + 1).padStart(2, '0')}</span>
                  <span className="truncate text-neutral-350">{track}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Checkout / Buy panel at bottom of modal */}
          <div className="mt-6 pt-4 border-t border-neutral-900 flex items-center justify-between gap-4">
            <div className="text-left font-mono">
              <span className="text-[10px] text-neutral-500 block uppercase font-semibold">PRECIO DE COPIA</span>
              <span className="text-2xl font-extrabold text-neutral-100">{'$' + cd.price.toLocaleString('es-CL')}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onAddToCart(cd);
                  onClose();
                }}
                className={`px-6 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer border shadow-md ${
                  cd.status === 'disponible' 
                    ? 'bg-white hover:bg-neutral-200 text-black border-white'
                    : cd.status === 'transito'
                      ? 'bg-neutral-900 border-neutral-800 text-white hover:bg-white hover:text-black hover:border-white'
                      : 'bg-neutral-950 border-neutral-850 text-neutral-400 hover:bg-neutral-900 hover:text-white hover:border-neutral-800'
                }`}
              >
                {cd.status === 'disponible' && 'Añadir al Pedido'}
                {cd.status === 'transito' && 'Reservar Copia'}
                {cd.status === 'encargo' && 'Encargar a Japón'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

