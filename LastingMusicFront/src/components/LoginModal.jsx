import React, { useState } from 'react';
import { X, Mail, Lock, User, ShieldCheck, AlertCircle } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      if (!name || !email || !password) {
        setError('Por favor, rellena todos los campos.');
        return;
      }
      // Simulate registration
      const newUser = {
        name,
        email,
        role: 'user',
        phone: '+56 9 ',
        address: '',
        city: '',
        zipCode: '',
        country: 'Chile',
        favoriteGenre: 'Todos'
      };
      onLoginSuccess(newUser);
      onClose();
    } else {
      if (!email || !password) {
        setError('Por favor, rellena todos los campos.');
        return;
      }
      // Check for Admin credentials
      if (email === 'admin@lastingmusic.cl' && password === 'admin123') {
        onLoginSuccess({
          name: 'Administrador Lasting',
          email: 'admin@lastingmusic.cl',
          role: 'admin'
        });
        onClose();
      } else if (email === 'cliente@lastingmusic.cl') {
        onLoginSuccess({
          name: 'Cliente Regular',
          email: 'cliente@lastingmusic.cl',
          role: 'user',
          phone: '+56 9 9876 5432',
          address: 'Huérfanos 1160',
          city: 'Santiago',
          zipCode: '8320000',
          country: 'Chile',
          favoriteGenre: 'Metal'
        });
        onClose();
      } else {
        // Allow arbitrary user login for mockup convenience
        onLoginSuccess({
          name: email.split('@')[0],
          email: email,
          role: 'user',
          phone: '+56 9 ',
          address: '',
          city: '',
          zipCode: '',
          country: 'Chile',
          favoriteGenre: 'Todos'
        });
        onClose();
      }
    }
  };

  // Quick test account log-ins
  const handleQuickLogin = (role) => {
    setError('');
    if (role === 'admin') {
      onLoginSuccess({
        name: 'Administrador Lasting',
        email: 'admin@lastingmusic.cl',
        role: 'admin'
      });
    } else {
      onLoginSuccess({
        name: 'Diego Pérez',
        email: 'diego.p@lastingmusic.cl',
        role: 'user',
        phone: '+56 9 8888 7777',
        address: 'Av. Andrés Bello 2777',
        city: 'Las Condes',
        zipCode: '7550000',
        country: 'Chile',
        favoriteGenre: 'Hip-Hop'
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Overlay */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-xs"
      ></div>

      {/* Modal box */}
      <div className="relative glass-panel bg-neutral-950/95 border-neutral-800 rounded-xl w-full max-w-md p-6 shadow-2xl z-10 text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-900 pb-4 mb-4">
          <h3 className="text-lg font-bold text-neutral-100">
            {isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-neutral-900/50 border border-neutral-800 text-neutral-200 rounded-lg text-xs flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0 text-neutral-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label htmlFor="login-name-input" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1 cursor-pointer">Nombre Completo</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-500">
                  <User className="w-4 h-4" />
                </span>
                <input
                  id="login-name-input"
                  type="text"
                  required
                  placeholder="Ej. Diego Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded pl-9 pr-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-white"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="login-email-input" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1 cursor-pointer">Correo Electrónico</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="login-email-input"
                type="email"
                required
                placeholder="diego@email.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-900/50 border border-neutral-800 rounded pl-9 pr-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-password-input" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1 cursor-pointer">Contraseña</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="login-password-input"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-900/50 border border-neutral-800 rounded pl-9 pr-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-white hover:bg-neutral-200 text-black font-bold py-2 rounded text-sm transition-all shadow-md cursor-pointer border border-white"
          >
            {isRegister ? 'Registrarme' : 'Entrar'}
          </button>
        </form>

        {/* Toggle link */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-neutral-300 hover:text-white font-medium cursor-pointer font-sans"
          >
            {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí'}
          </button>
        </div>

        {/* Quick Test Login accounts */}
        <div className="mt-6 pt-5 border-t border-neutral-900">
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block mb-2.5">
            Cuentas Rápidas de Prueba
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('user')}
              className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800/80 rounded py-2 px-3 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-white" /> Cliente Test
            </button>
            <button
              onClick={() => handleQuickLogin('admin')}
              className="bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800/80 rounded py-2 px-3 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-white" /> Admin Test
            </button>
          </div>
          <p className="text-[9px] text-neutral-600 mt-2 font-mono leading-tight">
            * Admin Test ingresará con rol "admin" habilitando el panel de administración.
          </p>
        </div>

      </div>
    </div>
  );
}
