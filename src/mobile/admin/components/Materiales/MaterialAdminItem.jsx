import React from 'react';

/**
 * Tarjeta individual de material en el panel administrativo.
 * Integra un switch interactivo para activar/desactivar y botón para editar precios.
 */
export function MaterialAdminItem({ material, onToggleActivo, onEditarPrecios }) {
  const precioCompra = material.precio_compra !== null
    ? `$${Number(material.precio_compra).toFixed(2)}`
    : 'Sin precio';

  const precioVenta = material.precio_venta !== null
    ? `$${Number(material.precio_venta).toFixed(2)}`
    : 'Sin precio';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
      {/* Cabecera de la tarjeta: Nombre, Código y Switch Interactivo */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-900 text-sm leading-tight truncate">
            {material.nombre}
          </h3>
          <span className="font-mono text-[11px] text-slate-400 block mt-0.5">
            {material.codigo}
          </span>
        </div>

        {/* Switch deslizable Activo / Inactivo */}
        <button
          type="button"
          role="switch"
          aria-checked={material.activo}
          onClick={() => onToggleActivo(material)}
          className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer select-none"
          title={material.activo ? 'Desactivar material' : 'Activar material'}
        >
          <span
            className={`text-xs font-medium transition-colors ${
              material.activo ? 'text-emerald-800' : 'text-slate-400'
            }`}
          >
            {material.activo ? 'Activo' : 'Inactivo'}
          </span>

          <span
            className={`relative inline-flex h-5 w-10 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out border ${
              material.activo
                ? 'bg-emerald-800 border-emerald-900'
                : 'bg-slate-300 border-slate-400'
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform duration-200 ease-in-out ${
                material.activo ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </span>
        </button>
      </div>

      {/* Precios Vigentes (con separación decimal por punto '.') */}
      <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-lg text-xs">
        <div>
          <span className="text-[11px] text-slate-500 block">Compra (pago al cliente)</span>
          <span className="font-semibold text-slate-900 tabular-nums">
            {precioCompra} <span className="text-[10px] text-slate-400 font-normal">/ kg</span>
          </span>
        </div>

        <div>
          <span className="text-[11px] text-slate-500 block">Venta (salida)</span>
          <span className="font-semibold text-slate-900 tabular-nums">
            {precioVenta} <span className="text-[10px] text-slate-400 font-normal">/ kg</span>
          </span>
        </div>
      </div>

      {/* Acción única inferior: Editar Precios */}
      <div className="flex items-center justify-end pt-1 border-t border-slate-100">
        <button
          onClick={() => onEditarPrecios(material)}
          className="text-xs text-slate-700 hover:text-slate-900 font-medium px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-all active:scale-95 cursor-pointer"
        >
          Editar Precios
        </button>
      </div>
    </div>
  );
}
