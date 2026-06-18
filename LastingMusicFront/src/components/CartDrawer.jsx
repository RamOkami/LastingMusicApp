import React from 'react';
import { ShoppingBag, X, Disc, Minus, Plus, ArrowRight } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  updateQuantity,
  removeFromCart,
  onCheckout
}) {
  if (!isOpen) return null;

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.cd.price * item.quantity), 0);
  const shippingCost = cartSubtotal >= 50000 || cartSubtotal === 0 ? 0 : 3990;
  const cartTotal = cartSubtotal + shippingCost;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        {/* Overlay background */}
        <div 
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        ></div>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-md border-l border-neutral-800 bg-neutral-950 p-6 flex flex-col justify-between shadow-2xl">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-900 pb-5">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-white" />
                <h2 className="text-lg font-bold text-neutral-100">Tu Pedido Actual</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-grow overflow-y-auto py-4 scrollbar-thin">
              {cart.length > 0 ? (
                <div className="divide-y divide-neutral-900">
                  {cart.map((item) => (
                    <div key={item.cd.id} className="py-4 flex gap-4">
                      {/* Mini album cover representation */}
                      <div className={`w-14 h-14 ${item.cd.coverUrl ? 'bg-neutral-900' : `bg-gradient-to-br ${item.cd.coverColor}`} rounded shrink-0 border border-white/5 flex items-center justify-center relative overflow-hidden`}>
                        {item.cd.coverUrl ? (
                          <img 
                            src={item.cd.coverUrl} 
                            alt={item.cd.title} 
                            referrerPolicy="no-referrer"
                            className="absolute inset-0 w-full h-full object-cover z-0"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <Disc className="w-6 h-6 text-white/25 relative z-10" />
                        )}
                        {item.cd.hasObi && (
                          <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-white z-20"></div>
                        )}
                      </div>

                      {/* Details & quantities */}
                      <div className="flex-grow flex flex-col justify-between text-left">
                        <div>
                          <h4 className="text-sm font-bold text-neutral-200 truncate leading-tight">{item.cd.title}</h4>
                          <p className="text-xs text-neutral-500 font-mono mt-0.5 truncate">{item.cd.artist}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className={`text-[8.5px] font-mono px-1.5 py-0.5 rounded border uppercase ${
                              item.cd.status === 'disponible' 
                                ? 'bg-neutral-900 text-neutral-400 border-neutral-800' 
                                : item.cd.status === 'transito' 
                                  ? 'bg-neutral-900 text-neutral-300 border-neutral-850' 
                                  : 'bg-neutral-950 text-neutral-400 border-neutral-900'
                            }`}>
                              {item.cd.status === 'disponible' && 'Disponible'}
                              {item.cd.status === 'transito' && 'En Tránsito'}
                              {item.cd.status === 'encargo' && 'Encargo Japón'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-neutral-800 rounded bg-neutral-900/50">
                            <button 
                              onClick={() => updateQuantity(item.cd.id, -1)}
                              className="px-2 py-1 text-neutral-400 hover:text-neutral-200 cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2.5 text-xs font-mono font-bold text-neutral-300">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.cd.id, 1)}
                              className="px-2 py-1 text-neutral-400 hover:text-neutral-200 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="font-mono text-sm font-bold text-neutral-200">
                            {'$' + (item.cd.price * item.quantity).toLocaleString('es-CL')}
                          </span>
                        </div>
                      </div>

                      {/* Remove button */}
                      <div className="flex items-start">
                        <button 
                          onClick={() => removeFromCart(item.cd.id)}
                          className="text-neutral-500 hover:text-white p-0.5 cursor-pointer"
                          title="Eliminar de carrito"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <Disc className="w-10 h-10 text-neutral-700 mx-auto animate-pulse mb-3" />
                  <p className="text-sm text-neutral-500">Tu cesta está vacía</p>
                  <p className="text-xs text-neutral-600 mt-1">Explora los CD's y añade música a tu pedido.</p>
                  <button
                    onClick={onClose}
                    className="mt-6 text-xs text-neutral-300 hover:text-white font-semibold cursor-pointer"
                  >
                    Seguir buscando
                  </button>
                </div>
              )}
            </div>

            {/* Footer and Summary */}
            <div className="border-t border-neutral-900 pt-5 space-y-4">
              <div className="space-y-1.5 text-sm font-mono text-neutral-400 text-left">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-neutral-200 font-semibold">{'$' + cartSubtotal.toLocaleString('es-CL')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío:</span>
                  <span>{shippingCost === 0 ? <strong className="text-white">Gratis</strong> : `$${shippingCost.toLocaleString('es-CL')}`}</span>
                </div>
                {cartSubtotal > 0 && cartSubtotal < 50000 && (
                  <p className="text-[10px] text-neutral-400 text-right mt-1 font-sans">
                    ¡Añade <strong>{'$' + (50000 - cartSubtotal).toLocaleString('es-CL')}</strong> más para envío gratuito!
                  </p>
                )}
                <div className="flex justify-between text-base border-t border-neutral-900 pt-3 mt-3 font-sans font-extrabold text-neutral-100">
                  <span>Total:</span>
                  <span className="text-white">{'$' + cartTotal.toLocaleString('es-CL')}</span>
                </div>
              </div>

              {/* Warning for mixed orders */}
              {cart.length > 0 && cart.some(item => item.cd.status === 'encargo') && (
                <div className="p-3 bg-neutral-900/40 border border-neutral-850 rounded-lg text-[10.5px] text-neutral-300 leading-relaxed text-left">
                  Este pedido contiene un CD por <strong>Encargo (Japón)</strong>. Todo el pedido se enviará junto una vez importado (estimado 1-2 meses).
                </div>
              )}

              <button
                onClick={onCheckout}
                disabled={cart.length === 0}
                className={`w-full py-3.5 rounded-lg text-sm font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md ${
                  cart.length > 0
                    ? 'bg-white hover:bg-neutral-200 text-black cursor-pointer hover:shadow-lg font-bold border border-white'
                    : 'bg-neutral-900 text-neutral-600 cursor-not-allowed border border-neutral-800/50'
                }`}
              >
                Confirmar Pedido <ArrowRight className="w-4.5 h-4.5" />
              </button>
              <p className="text-[10px] text-neutral-500 text-center">
                Los pedidos se asocian automáticamente a tu perfil de usuario.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
