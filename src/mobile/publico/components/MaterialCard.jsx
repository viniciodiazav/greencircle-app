import React from 'react';

/**
 * Tarjeta individual para mostrar el nombre del material y su precio vigente por kilogramo
 */
export function MaterialCard({ material }) {
  const precioFormateado = material.precio
    ? Number(material.precio).toFixed(2)
    : '0.00';

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3.5 flex items-center justify-between transition-all hover:border-slate-300 active:scale-[0.99] select-none shadow-xs">
      <span className="font-medium text-slate-900 text-sm">
        {material.nombre}
      </span>

      <div className="text-right">
        <span className="font-semibold text-slate-900 text-sm tabular-nums">
          ${precioFormateado}
        </span>
        <span className="text-xs text-slate-500 ml-1">
          / kg
        </span>
      </div>
    </div>
  );
}
