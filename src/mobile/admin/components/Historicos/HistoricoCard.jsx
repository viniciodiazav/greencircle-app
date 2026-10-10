import React from 'react';

function formatearFecha(isoString) {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const anio = d.getFullYear();
    const hora = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${anio} ${hora}:${min}`;
  } catch {
    return isoString;
  }
}

/**
 * Tarjeta individual para mostrar un registro del historial contable SCD Tipo 2
 */
export function HistoricoCard({ registro, nombreMaterial }) {
  const esVigente = registro.vigente_hasta === null;
  const precioFormateado = registro.precio
    ? Number(registro.precio).toFixed(2)
    : '0.00';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2.5 shadow-xs">
      {/* Cabecera del registro: ID y Badge de Vigencia */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="font-mono text-xs font-semibold text-slate-800">
            #{registro.id}
          </span>
          <h4 className="font-semibold text-slate-900 text-sm leading-tight mt-0.5">
            {nombreMaterial || registro.codigo_material}
          </h4>
          <span className="font-mono text-[11px] text-slate-400 block">
            {registro.codigo_material}
          </span>
        </div>

        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-medium border shrink-0 ${
            esVigente
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}
        >
          {esVigente ? 'Vigente actual' : 'Cerrado'}
        </span>
      </div>

      {/* Precio registrado */}
      <div className="p-2 bg-slate-50 rounded-lg flex items-baseline justify-between">
        <span className="text-[11px] text-slate-500">Precio asentado:</span>
        <span className="font-semibold text-slate-900 text-sm tabular-nums">
          ${precioFormateado} <span className="text-xs text-slate-400 font-normal">/ kg</span>
        </span>
      </div>

      {/* Fechas de vigencia (SCD Tipo 2) */}
      <div className="text-[11px] text-slate-500 grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
        <div>
          <span className="block text-[10px] text-slate-400 uppercase tracking-wider">
            Vigente desde
          </span>
          <span className="font-mono text-slate-700">
            {formatearFecha(registro.creado_en)}
          </span>
        </div>

        <div>
          <span className="block text-[10px] text-slate-400 uppercase tracking-wider">
            Vigente hasta
          </span>
          <span className="font-mono text-slate-700">
            {esVigente ? 'Actualidad' : formatearFecha(registro.vigente_hasta)}
          </span>
        </div>
      </div>
    </div>
  );
}
