import React, { useState } from 'react';
import { Disc, Trash2, Search } from 'lucide-react';

export default function AdminCDTable({ customCDs, onDeleteCD, onUpdateCD }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleStatusChange = (cd, newStatus) => {
    const waitTime = newStatus === 'disponible' ? '2-4 días' : newStatus === 'transito' ? '2-3 semanas' : '1-2 meses';
    onUpdateCD({ ...cd, status: newStatus, waitTime });
  };

  const filteredCDs = customCDs.filter(cd => 
    cd.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    cd.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cd.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="mt-12 glass-panel border-neutral-800 rounded-xl p-6 text-left" aria-labelledby="custom-cds-title">
      
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 id="custom-cds-title" className="text-lg font-bold tracking-tight flex items-center gap-2 text-neutral-100">
          <Disc className="w-5 h-5 text-white" /> Discos Añadidos por el Administrador ({customCDs.length})
        </h2>

        {customCDs.length > 0 && (
          <div className="relative max-w-xs w-full">
            <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-neutral-500">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              placeholder="Buscar en agregados..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-neutral-300 placeholder-neutral-500 focus:outline-none focus:border-white transition-all font-sans"
            />
          </div>
        )}
      </div>

      {customCDs.length > 0 ? (
        filteredCDs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-neutral-400 border-collapse">
              <caption className="sr-only">Lista de CD's creados por el administrador con opciones de edición y eliminación</caption>
              <thead>
                <tr className="border-b border-neutral-900 font-mono uppercase text-neutral-500 text-[10px]">
                  <th className="py-3 px-2">Álbum / Artista</th>
                  <th className="py-3 px-2">Género</th>
                  <th className="py-3 px-2 w-36">Estado</th>
                  <th className="py-3 px-2">Detalles</th>
                  <th className="py-3 px-2 text-right w-28">Precio</th>
                  <th className="py-3 px-2 text-center w-16">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {filteredCDs.map((cd) => (
                  <tr key={cd.id} className="hover:bg-neutral-900/20 transition-colors">
                    <td className="py-3.5 px-2">
                      <span className="font-bold text-neutral-200 block">{cd.title}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">{cd.artist}</span>
                    </td>
                    <td className="py-3.5 px-2 font-semibold text-neutral-300">{cd.genre}</td>
                    <td className="py-3.5 px-2">
                      <select
                        value={cd.status}
                        onChange={(e) => handleStatusChange(cd, e.target.value)}
                        className="bg-neutral-950 text-neutral-200 border border-neutral-800 rounded px-1.5 py-1 text-[10px] focus:outline-none focus:border-white cursor-pointer font-sans"
                      >
                        <option value="disponible">Disponible</option>
                        <option value="transito">En Tránsito</option>
                        <option value="encargo">Encargo</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-2 space-x-1.5 font-mono text-[9px]">
                      {cd.origin.includes('Japón') && <span className="text-neutral-300">Japón</span>}
                      {cd.hasObi && <span className="text-neutral-200 bg-neutral-900 px-1 py-0.5 border border-neutral-800 rounded">Con OBI</span>}
                      <span>{cd.releaseYear}</span>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <div className="flex items-center justify-end gap-1 font-mono">
                        <span className="text-neutral-500 text-xs">$</span>
                        <input
                          type="number"
                          value={cd.price}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            onUpdateCD({ ...cd, price: isNaN(val) ? 0 : val });
                          }}
                          className="bg-neutral-950 text-neutral-200 border border-neutral-800 rounded px-1.5 py-0.5 w-20 text-right text-xs focus:outline-none focus:border-white font-sans"
                          min="0"
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      <button
                        onClick={() => onDeleteCD(cd.id)}
                        className="text-neutral-500 hover:text-white p-1 cursor-pointer transition-colors focus:outline-none focus-visible:text-white"
                        title={`Eliminar disco ${cd.title}`}
                        type="button"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-neutral-500 font-mono text-xs">
            Ningún disco agregado coincide con la búsqueda.
          </div>
        )
      ) : (
        <div className="text-center py-10 text-neutral-500 font-mono text-xs">
          No has agregado discos personalizados aún. Usa el formulario de arriba.
        </div>
      )}
    </section>
  );
}
