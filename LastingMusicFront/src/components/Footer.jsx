import React from 'react';

export default function Footer({ currentUser, setActiveSection }) {
  return (
    <footer className="mt-20 border-t border-neutral-900 bg-neutral-950/40 py-8 text-xs font-mono text-neutral-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p className="font-semibold text-neutral-400">LASTINGMUSIC FRONTEND PROTOTYPE v1.0.0</p>
          <p className="mt-0.5 text-neutral-600">Creado para coleccionistas de Hip-hop, Rap, Metal, J-Rock y más.</p>
        </div>
        <nav className="flex items-center gap-6" aria-label="Navegación del pie de página">
          <button 
            onClick={() => setActiveSection('store')} 
            className="hover:text-white cursor-pointer bg-transparent border-none p-0 font-mono text-xs text-neutral-500 transition-colors focus:outline-none focus-visible:underline"
          >
            Tienda
          </button>
          {currentUser && (
            <>
              <button 
                onClick={() => setActiveSection('orders')} 
                className="hover:text-white cursor-pointer bg-transparent border-none p-0 font-mono text-xs text-neutral-500 transition-colors focus:outline-none focus-visible:underline"
              >
                Mis Pedidos
              </button>
              <button 
                onClick={() => setActiveSection('profile')} 
                className="hover:text-white cursor-pointer bg-transparent border-none p-0 font-mono text-xs text-neutral-500 transition-colors focus:outline-none focus-visible:underline"
              >
                Mi Perfil
              </button>
            </>
          )}
        </nav>
        <div className="text-center md:text-right text-neutral-600">
          <p>&copy; {new Date().getFullYear()} LastingMusic. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
