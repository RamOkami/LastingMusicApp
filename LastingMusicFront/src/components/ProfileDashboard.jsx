import React, { useState } from 'react';
import { User, Compass, Package, MapPin, Shield, Edit2, Lock, ArrowRight, CheckCircle, X } from 'lucide-react';
import { genres } from '../data/cds';

export default function ProfileDashboard({
  userProfile,
  setUserProfile,
  ordersCount,
  setActiveSection
}) {
  const [editProfile, setEditProfile] = useState({ ...userProfile });
  const [passwordState, setPasswordState] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [message, setMessage] = useState(null);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUserProfile({ ...editProfile });
    setMessage({ type: 'success', text: 'Perfil actualizado con éxito.' });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!passwordState.current || !passwordState.new || !passwordState.confirm) {
      setMessage({ type: 'error', text: 'Por favor, rellene todos los campos de contraseña.' });
      return;
    }
    if (passwordState.new !== passwordState.confirm) {
      setMessage({ type: 'error', text: 'Las nuevas contraseñas no coinciden.' });
      return;
    }
    setMessage({ type: 'success', text: 'Contraseña cambiada correctamente.' });
    setPasswordState({ current: '', new: '', confirm: '' });
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <section className="max-w-4xl mx-auto" aria-labelledby="profile-title">
      
      {/* Header */}
      <div className="mb-8 flex items-center justify-between border-b border-neutral-900 pb-4">
        <div className="text-left">
          <h1 id="profile-title" className="text-3xl font-extrabold tracking-tight">Mi Perfil</h1>
          <p className="text-sm text-neutral-400 mt-1 font-mono">Configura tus credenciales y dirección de envío</p>
        </div>
        <button 
          onClick={() => setActiveSection('store')}
          className="text-xs text-neutral-300 hover:text-white font-medium flex items-center gap-1 cursor-pointer"
        >
          Volver a la Tienda <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Message Notifications */}
      {message && (
        <div className="p-4 rounded-lg mb-6 border flex items-center gap-3 text-left bg-neutral-900/50 border-neutral-800 text-neutral-200">
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 shrink-0 text-white" />
          ) : (
            <X className="w-5 h-5 shrink-0 text-neutral-500" />
          )}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Profile Card Summary */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass-panel rounded-xl p-6 border-neutral-800 text-center">
            <div className="w-20 h-20 bg-gradient-to-tr from-neutral-800 to-neutral-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-neutral-500 shadow-md">
              <User className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-lg font-bold text-neutral-100">{userProfile.name}</h3>
            <p className="text-xs font-mono text-neutral-500 mt-0.5">{userProfile.email}</p>
            
            <div className="mt-6 pt-6 border-t border-neutral-900 text-left space-y-3.5">
              <div className="flex items-center gap-2.5 text-xs text-neutral-400">
                <Compass className="w-4 h-4 text-white shrink-0" />
                <span><span>Coleccionista: <strong>{userProfile.favoriteGenre}</strong></span></span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-neutral-400">
                <Package className="w-4 h-4 text-white shrink-0" />
                <span className="cursor-pointer hover:underline text-neutral-300 hover:text-white" onClick={() => setActiveSection('orders')}>
                  Pedidos Realizados: <strong>{ordersCount}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-neutral-400">
                <MapPin className="w-4 h-4 text-white shrink-0" />
                <span className="truncate">Localidad: <strong>{userProfile.city}, {userProfile.country}</strong></span>
              </div>
            </div>
          </div>

          {/* Import Alert Box */}
          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/40 text-neutral-400 text-xs leading-relaxed space-y-2 text-left">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[10px] text-white">
              <Shield className="w-4 h-4 text-white" /> Info Importación Japón
            </div>
            <p>
              Tus credenciales de envío deben ser correctas y estar completas. Las aduanas de Chile requieren el nombre legal y dirección detallada para procesar los CD's que encargues desde Japón sin demoras adicionales.
            </p>
          </div>
        </div>

        {/* Form Panel */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Shipping and Billing */}
          <div className="glass-panel border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg font-bold tracking-tight mb-5 flex items-center gap-2 text-neutral-100 text-left">
              <Edit2 className="w-4.5 h-4.5 text-white" /> Información de Envío y Facturación
            </h2>
            
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div>
                  <label htmlFor="name-input" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 cursor-pointer">Nombre Completo</label>
                  <input
                    id="name-input"
                    type="text"
                    required
                    value={editProfile.name}
                    onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="email-input" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 cursor-pointer">Email de Contacto</label>
                  <input
                    id="email-input"
                    type="email"
                    required
                    value={editProfile.email}
                    onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div>
                  <label htmlFor="phone-input" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 cursor-pointer">Teléfono móvil</label>
                  <input
                    id="phone-input"
                    type="text"
                    value={editProfile.phone}
                    onChange={(e) => setEditProfile({ ...editProfile, phone: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="genre-select" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 cursor-pointer">Género musical preferido</label>
                  <select
                    id="genre-select"
                    value={editProfile.favoriteGenre}
                    onChange={(e) => setEditProfile({ ...editProfile, favoriteGenre: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-white"
                  >
                    {genres.filter(g => g !== 'Todos').map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-left">
                <label htmlFor="address-input" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 cursor-pointer">Dirección de Envío</label>
                <input
                  id="address-input"
                  type="text"
                  required
                  placeholder="Ej. Calle Gran Vía 14, Piso 3A"
                  value={editProfile.address}
                  onChange={(e) => setEditProfile({ ...editProfile, address: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 text-left">
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="city-input" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 cursor-pointer">Ciudad</label>
                  <input
                    id="city-input"
                    type="text"
                    required
                    value={editProfile.city}
                    onChange={(e) => setEditProfile({ ...editProfile, city: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label htmlFor="zipcode-input" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 cursor-pointer">Código Postal</label>
                  <input
                    id="zipcode-input"
                    type="text"
                    required
                    value={editProfile.zipCode}
                    onChange={(e) => setEditProfile({ ...editProfile, zipCode: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-white"
                  />
                </div>
                <div className="col-span-3 sm:col-span-1">
                  <label htmlFor="country-input" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 cursor-pointer">País</label>
                  <input
                    id="country-input"
                    type="text"
                    required
                    value={editProfile.country}
                    onChange={(e) => setEditProfile({ ...editProfile, country: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 text-left">
                <input
                  type="checkbox"
                  id="notifyRestocks"
                  checked={editProfile.notifyRestocks}
                  onChange={(e) => setEditProfile({ ...editProfile, notifyRestocks: e.target.checked })}
                  className="rounded text-white focus:ring-white w-4 h-4 bg-neutral-900 border-neutral-800"
                />
                <label htmlFor="notifyRestocks" className="text-xs text-neutral-400 select-none">
                  Notificarme por email cuando lleguen CD's "En Tránsito"
                </label>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-white hover:bg-neutral-200 text-black text-sm font-bold tracking-wide py-2 px-5 rounded transition-all cursor-pointer shadow-md border border-white"
                >
                  Guardar Perfil
                </button>
              </div>
            </form>
          </div>

          {/* Password Settings */}
          <div className="glass-panel border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg font-bold tracking-tight mb-5 flex items-center gap-2 text-neutral-100 text-left">
              <Lock className="w-4.5 h-4.5 text-white" /> Seguridad de Cuenta
            </h2>
            
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="text-left">
                <label htmlFor="current-password-input" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 cursor-pointer">Contraseña Actual</label>
                <input
                  id="current-password-input"
                  type="password"
                  value={passwordState.current}
                  onChange={(e) => setPasswordState({ ...passwordState, current: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div>
                  <label htmlFor="new-password-input" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 cursor-pointer">Nueva Contraseña</label>
                  <input
                    id="new-password-input"
                    type="password"
                    value={passwordState.new}
                    onChange={(e) => setPasswordState({ ...passwordState, new: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="confirm-password-input" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 cursor-pointer">Confirmar Nueva Contraseña</label>
                  <input
                    id="confirm-password-input"
                    type="password"
                    value={passwordState.confirm}
                    onChange={(e) => setPasswordState({ ...passwordState, confirm: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900 bg-neutral-900/40 text-neutral-300 text-xs font-semibold tracking-wide py-2.5 px-4 rounded transition-all cursor-pointer"
                >
                  Cambiar Contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
