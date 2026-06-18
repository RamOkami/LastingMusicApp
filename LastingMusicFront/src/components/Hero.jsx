import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero({ setActiveTab }) {
  return (
    <section className="mb-12 relative overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-950 p-8 md:p-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neutral-800/10 via-neutral-950/40 to-neutral-950 pointer-events-none"></div>
      
      <div className="relative z-10 max-w-2xl text-left">
        <span className="text-xs font-mono tracking-[0.4em] text-neutral-300 uppercase font-semibold">
          Ediciones Japonesas & Selección Especial
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-3 mb-4 font-sans bg-gradient-to-l from-neutral-900 via-neutral-500 to-neutral-100 bg-clip-text text-transparent">
          Curando sonido clasico en formato físico.
        </h1>
        <p className="text-neutral-400 text-base md:text-lg leading-relaxed mb-6 font-light">
          Encuentra CD's icónicos de hip-hop underground, rap clásico, metal experimental y tesoros traídos directamente desde Japón con su OBI strip original.
        </p>
        <div className="flex flex-wrap gap-4">
          <a 
            href="#tienda-cds" 
            className="bg-white hover:bg-neutral-200 text-black text-sm font-semibold tracking-wide py-3 px-6 rounded-lg transition-colors shadow-lg flex items-center gap-2"
          >
            Explorar Álbumes <ArrowRight className="w-4 h-4" />
          </a>
          <button 
            onClick={() => {
              setActiveTab('encargo');
              const element = document.getElementById('tienda-cds');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }} 
            className="border border-neutral-850 hover:border-neutral-700 bg-neutral-900/40 backdrop-blur-sm hover:bg-neutral-900/70 text-neutral-200 text-sm font-medium py-3 px-6 rounded-lg transition-all cursor-pointer"
          >
            Pedidos a Japón (1-2 meses)
          </button>
        </div>
      </div>

      {/* Decorative elements for vinyl */}
      <div className="absolute right-[-50px] bottom-[-50px] w-64 h-64 border border-neutral-800 rounded-full opacity-35 hidden lg:block pointer-events-none animate-spin-slow">
        <div className="absolute inset-6 border border-dashed border-neutral-800 rounded-full"></div>
        <div className="absolute inset-16 border border-neutral-800 rounded-full"></div>
        <div className="absolute inset-24 border border-neutral-700/20 rounded-full"></div>
      </div>
    </section>
  );
}
