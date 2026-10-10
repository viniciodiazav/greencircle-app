import React, { useEffect } from 'react';
import { X, Recycle } from 'lucide-react';

/**
 * Menú lateral desplegable (Drawer / Menú de Hamburguesa)
 * Permite navegar entre todos los módulos del panel administrativo.
 */
export function AdminDrawer({
  isOpen,
  onClose,
  moduloActivo,
  onSeleccionarModulo,
  countMateriales = 0,
  countSucursales = 0,
  user,
  onLogout
}) {
  // Bloquear desplazamiento del fondo mientras el drawer esté abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSeleccionar = (modulo) => {
    onSeleccionarModulo(modulo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex select-none">
      {/* Fondo oscuro con desenfoque / Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Contenedor del Menú Lateral */}
      <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between z-50 animate-slide-in">
        {/* Parte Superior */}
        <div className="flex-1 overflow-y-auto">
          {/* Cabecera del Drawer con soporte de notch */}
          <div
            className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50"
            style={{ paddingTop: 'max(env(safe-area-inset-top), 1rem)' }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
                <Recycle className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900 leading-tight">
                  Green Circle
                </h2>
                <p className="text-[11px] text-slate-500">Administración</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors active:scale-95"
              title="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Ficha de Usuario */}
          <div className="p-4 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-semibold text-xs">
                {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {user?.nombre ? `${user.nombre} ${user.apellido || ''}` : 'Administrador'}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  @{user?.usuario || 'admin'}
                </p>
              </div>
            </div>
          </div>

          {/* Lista de Módulos */}
          <div className="p-3 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Módulos Activos
            </div>

            {/* Módulo: Materiales */}
            <button
              onClick={() => handleSeleccionar('materiales')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all active:scale-[0.98] ${
                moduloActivo === 'materiales'
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span>Catálogo de Materiales</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full ${
                  moduloActivo === 'materiales'
                    ? 'bg-slate-800 text-slate-200'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {countMateriales}
              </span>
            </button>

            {/* Módulo: Sucursales */}
            <button
              onClick={() => handleSeleccionar('sucursales')}
              className={`w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all active:scale-[0.98] ${
                moduloActivo === 'sucursales'
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span>Sucursales</span>
            </button>

            {/* Módulo: Historial de Precios de Compra */}
            <button
              onClick={() => handleSeleccionar('historico_compra')}
              className={`w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all active:scale-[0.98] ${
                moduloActivo === 'historico_compra'
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span>Historial Precios Compra</span>
            </button>

            {/* Módulo: Historial de Precios de Venta */}
            <button
              onClick={() => handleSeleccionar('historico_venta')}
              className={`w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all active:scale-[0.98] ${
                moduloActivo === 'historico_venta'
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span>Historial Precios Venta</span>
            </button>
          </div>
        </div>

        {/* Parte Inferior: Cerrar Sesión con soporte para barra de inicio de iPhone */}
        <div
          className="p-4 border-t border-slate-200 bg-slate-50 space-y-2"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 1rem)' }}
        >
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full py-2 px-3 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-200/70 border border-slate-300 rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Cerrar sesión
          </button>
          <p className="text-[10px] text-center text-slate-400">
            Green Circle — Administración v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
