import React from 'react';

/**
 * Tarjeta individual de sucursal en el panel administrativo
 */
export function SucursalAdminItem({ sucursal, onEditar, onEliminar }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5 shadow-xs">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-slate-900 text-sm leading-tight">
            {sucursal.nombre}
          </h3>
          {sucursal.url ? (
            <a
              href={sucursal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-800 hover:underline block truncate max-w-[240px] mt-0.5"
            >
              {sucursal.url}
            </a>
          ) : (
            <span className="text-xs text-slate-400 block mt-0.5">
              Sin enlace registrado
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
        <button
          onClick={() => onEditar(sucursal)}
          className="text-xs text-slate-700 hover:text-slate-900 font-medium px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-all active:scale-95 cursor-pointer"
        >
          Editar
        </button>

        <button
          onClick={() => onEliminar(sucursal)}
          className="text-xs text-red-700 hover:text-red-900 font-medium px-3 py-1.5 rounded-lg border border-red-200 hover:border-red-300 transition-all active:scale-95 cursor-pointer"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
