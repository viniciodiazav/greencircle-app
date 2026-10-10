import React from 'react';
import { Menu, Recycle } from 'lucide-react';

/**
 * Cabecera con botón de menú hamburguesa para el panel administrativo
 */
export function AdminHeader({ onOpenMenu, tituloModulo = 'Materiales' }) {
  return (
    <header
      className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 select-none"
      style={{ paddingTop: 'max(env(safe-area-inset-top), 0.75rem)' }}
    >
      <div className="flex items-center gap-3">
        {/* Botón de Menú Hamburguesa */}
        <button
          type="button"
          onClick={onOpenMenu}
          className="p-1.5 -ml-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all active:scale-95 cursor-pointer"
          title="Abrir menú de opciones"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-800 flex items-center justify-center text-white shrink-0">
            <Recycle className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-900 leading-tight">
              {tituloModulo}
            </h1>
            <p className="text-[10px] text-slate-400">Green Circle</p>
          </div>
        </div>
      </div>
    </header>
  );
}
