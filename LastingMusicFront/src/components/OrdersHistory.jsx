import React from 'react';
import { Truck, Clipboard, Disc, Compass, ArrowRight } from 'lucide-react';

export default function OrdersHistory({ orders, setActiveSection, showNotification }) {
  return (
    <section className="max-w-4xl mx-auto" aria-labelledby="orders-title">
      
      {/* Header */}
      <div className="mb-8 flex items-center justify-between border-b border-neutral-900 pb-4">
        <div className="text-left">
          <h1 id="orders-title" className="text-3xl font-extrabold tracking-tight">Historial de Pedidos</h1>
          <p className="text-sm text-neutral-400 mt-1 font-mono">Monitorea y rastrea el progreso de tus encargos de música</p>
        </div>
        <button 
          onClick={() => setActiveSection('store')}
          className="text-xs text-neutral-300 hover:text-white font-medium flex items-center gap-1 cursor-pointer"
        >
          Seguir Comprando <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {orders.length > 0 ? (
        <ul className="space-y-6">
          {orders.map((order) => (
            <li key={order.id} className="glass-panel border-neutral-800 rounded-xl overflow-hidden shadow-lg">
              {/* Order Header bar */}
              <div className="bg-neutral-900/60 px-6 py-4 border-b border-neutral-900 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-left">
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <div>
                    <span className="text-neutral-500 uppercase font-semibold">CÓDIGO DE PEDIDO</span>
                    <p className="text-sm font-bold text-neutral-200 mt-0.5">{order.id}</p>
                  </div>
                  <div>
                    <span className="text-neutral-500 uppercase font-semibold">FECHA DEL PEDIDO</span>
                    <p className="text-sm font-medium text-neutral-300 mt-0.5">{order.date}</p>
                  </div>
                  <div>
                    <span className="text-neutral-500 uppercase font-semibold">TOTAL DE ARTÍCULOS</span>
                    <p className="text-sm font-semibold text-neutral-300 mt-0.5">{order.items.reduce((acc, item) => acc + item.quantity, 0)} copias</p>
                  </div>
                </div>
                
                <div className="text-right sm:text-right">
                  <span className="text-neutral-500 uppercase font-semibold block">TOTAL EN FACTURA</span>
                  <span className="text-base font-extrabold text-white">{'$' + order.total.toLocaleString('es-CL')}</span>
                </div>
              </div>

              {/* Order Body / Content */}
              <div className="p-6">
                
                {/* Tracking / Progress Bar */}
                <div className="mb-8 bg-neutral-950/40 p-4 rounded-xl border border-neutral-900 text-left">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-white" />
                      <span className="text-xs text-neutral-400 font-mono">
                        Transportadora: <strong className="text-neutral-200">{order.carrier}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase">Cód. Seguimiento:</span>
                      <button 
                        type="button" 
                        className="text-xs font-mono font-bold text-neutral-200 flex items-center gap-1 hover:text-white cursor-pointer focus:outline-none focus-visible:underline bg-transparent border-none p-0" 
                        onClick={() => {
                          navigator.clipboard.writeText(order.trackingNumber);
                          showNotification("Número de tracking copiado al portapapeles!");
                        }}
                        title="Copiar código de seguimiento"
                      >
                        {order.trackingNumber} <Clipboard className="w-3 h-3 text-neutral-500 shrink-0" />
                      </button>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="space-y-2">
                    <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          order.status === 'delivered' 
                            ? 'bg-white' 
                            : order.status === 'in_transit'
                              ? 'bg-neutral-400' 
                              : 'bg-neutral-600'
                        }`} 
                        style={{ width: `${order.statusPercent}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-neutral-500 uppercase">
                      <span className={order.statusPercent >= 20 ? 'text-white font-bold' : ''}>Pedido Recibido</span>
                      <span className={order.statusPercent >= 50 ? 'text-white font-bold' : ''}>Enviado</span>
                      <span className={order.statusPercent >= 75 ? 'text-neutral-300 font-bold' : ''}>Aduana / En ruta</span>
                      <span className={order.statusPercent >= 100 ? 'text-white font-bold' : ''}>Entregado</span>
                    </div>
                  </div>

                  {/* Extra tracking status details */}
                  <div className="mt-4 pt-3.5 border-t border-neutral-900/60 flex items-center justify-between text-xs">
                    <span className="text-neutral-400">
                      Estado actual: <strong className={`font-semibold ${
                        order.status === 'delivered' 
                          ? 'text-white' 
                          : order.status === 'in_transit'
                            ? 'text-neutral-300' 
                            : 'text-neutral-400'
                      }`}>{order.statusLabel}</strong>
                    </span>
                    <span className="text-neutral-400 font-mono">
                      {order.status === 'delivered' ? 'Entregado el:' : 'Entrega aproximada:'} <strong className="text-neutral-200">{order.estimatedDelivery}</strong>
                    </span>
                  </div>
                </div>

                {/* Items in the order */}
                <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-4 text-left">Detalle de Artículos</h2>
                <ul className="divide-y divide-neutral-900">
                  {order.items.map((item) => (
                    <li key={item.id} className="py-3 flex items-center justify-between gap-4 text-left">
                      <div className="flex items-center gap-3">
                        <Disc className="w-8 h-8 text-neutral-700 shrink-0" />
                        <div>
                          <span className="text-sm font-semibold text-neutral-200 block truncate max-w-sm sm:max-w-md">{item.title}</span>
                          <span className="text-xs text-neutral-500 font-mono">{item.artist}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 font-mono text-xs">
                        <div className="text-right">
                          <span className="text-neutral-500">Cantidad:</span>
                          <span className="text-neutral-300 font-semibold ml-1.5">{item.quantity}</span>
                        </div>
                        <div className="text-right w-16">
                          <span className="text-neutral-300 font-semibold">{'$' + item.price.toLocaleString('es-CL')}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-20 rounded-2xl border border-neutral-900 bg-neutral-900/10">
          <Compass className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-400">No tienes pedidos registrados</h3>
          <p className="text-sm text-neutral-500 mt-1">
            Visita el catálogo, añade CD's a tu pedido y confírmalos para visualizarlos aquí.
          </p>
          <button
            onClick={() => setActiveSection('store')}
            className="mt-5 bg-white hover:bg-neutral-200 text-black text-xs font-bold py-2.5 px-5 rounded transition-all cursor-pointer border border-white"
          >
            Ir al catálogo
          </button>
        </div>
      )}
    </section>
  );
}
