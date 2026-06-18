import React from 'react';
import { ShoppingBag, User, LogOut } from 'lucide-react';
import logoWhite from '../assets/IconLastingMusicBlanco.png';

export default function Navbar({ 
  activeSection, 
  setActiveSection, 
  cartCount, 
  setIsCartOpen,
  currentUser,
  onLoginClick,
  onLogout
}) {
  return (
    <header className="sticky top-0 z-40 border-b bg-neutral-950/80 border-neutral-900 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <button 
          type="button"
          onClick={() => setActiveSection('store')} 
          className="flex items-center gap-3 cursor-pointer group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-lg p-1 transition-all"
          aria-label="Ir a la tienda LastingMusic"
        >
          <div className="relative">
            <img 
              src={logoWhite} 
              alt="LastingMusic Logo" 
              className="w-15 h-15 object-contain group-hover:scale-105 transition-transform duration-300" 
            />
            <div className="absolute inset-0 bg-white blur-md opacity-10 rounded-full group-hover:opacity-20 transition-opacity"></div>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-bold tracking-tight text-xl text-neutral-100 font-sans">
              LastingMusic
            </span>
          </div>
        </button>

        {/* Navigation Links */}
        {currentUser && (
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => setActiveSection('store')}
              className={`text-sm font-medium tracking-wide uppercase transition-all py-2 relative cursor-pointer ${
                activeSection === 'store' 
                  ? 'text-white font-semibold' 
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Tienda
              {activeSection === 'store' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full"></span>
              )}
            </button>
            
            <button 
              onClick={() => setActiveSection('orders')}
              className={`text-sm font-medium tracking-wide uppercase transition-all py-2 relative cursor-pointer ${
                activeSection === 'orders' 
                  ? 'text-white font-semibold' 
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Mis Pedidos
              {activeSection === 'orders' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full"></span>
              )}
            </button>
            <button 
              onClick={() => setActiveSection('profile')}
              className={`text-sm font-medium tracking-wide uppercase transition-all py-2 relative cursor-pointer ${
                activeSection === 'profile' 
                  ? 'text-white font-semibold' 
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Mi Perfil
              {activeSection === 'profile' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full"></span>
              )}
            </button>

            {/* Admin Panel button - completely hidden from regular/guest users */}
            {currentUser?.role === 'admin' && (
              <button 
                onClick={() => setActiveSection('admin')}
                className={`text-sm font-medium tracking-wide uppercase transition-all py-2 relative cursor-pointer ${
                  activeSection === 'admin' 
                    ? 'text-white font-semibold' 
                    : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Panel Admin
              {activeSection === 'admin' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full"></span>
              )}
            </button>
            )}
          </nav>
        )}

        {/* Controls */}
        <div className="flex items-center gap-4">
          
          {/* User Profile / Login trigger */}
          {currentUser ? (
            <div className="flex items-center gap-3">
              {/* Profile icon (quick link) */}
              <button
                onClick={() => setActiveSection('profile')}
                className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                  activeSection === 'profile'
                    ? 'border-white bg-white/10 text-white'
                    : 'border-neutral-800 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100'
                }`}
                title={`Identificado como: ${currentUser.name}`}
              >
                <User className="w-4.5 h-4.5" />
              </button>
              
              <button
                onClick={onLogout}
                className="p-2.5 rounded-full border border-neutral-800 text-neutral-400 hover:bg-neutral-900 hover:text-white transition-all cursor-pointer"
                title="Cerrar sesión"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="flex items-center gap-1.5 px-4 py-2 border border-neutral-800 bg-neutral-900/40 hover:bg-white text-neutral-300 hover:text-black rounded-lg text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Acceder</span>
            </button>
          )}

          {/* Cart Trigger Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-full border border-neutral-800 bg-neutral-900/40 text-neutral-200 hover:bg-white hover:text-black transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white text-black rounded-full flex items-center justify-center text-[10px] font-bold border border-neutral-950 animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}


