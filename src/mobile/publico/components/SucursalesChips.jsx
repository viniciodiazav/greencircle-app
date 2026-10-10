import React from 'react';

/**
 * Muestra las sucursales registradas como botones/chips horizontales
 * con enlaces directos a sus mapas o ubicaciones.
 */
export function SucursalesChips({ sucursales = [] }) {
  if (!sucursales.length) return null;

  return (
    <div className="mt-3 pt-3 border-t border-slate-100">
      <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">
        Sucursales
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {sucursales.map((suc, idx) => (
          <a
            key={idx}
            href={suc.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-medium rounded transition-all active:scale-95 select-none whitespace-nowrap"
          >
            {suc.nombre}
          </a>
        ))}
      </div>
    </div>
  );
}
