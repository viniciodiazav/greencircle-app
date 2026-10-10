import React, { useState, useEffect } from 'react';

/**
 * Modal de confirmación para eliminar una sucursal.
 * Recuerda que las sucursales son la única entidad en el sistema que admite DELETE.
 */
export function EliminarSucursalModal({ sucursal, isOpen, onClose, onConfirm }) {
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState(null);

  // Bloqueo de scroll de fondo
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

  if (!isOpen || !sucursal) return null;

  const handleConfirm = async () => {
    try {
      setEliminando(true);
      setError(null);
      await onConfirm(sucursal.id);
      onClose();
    } catch (err) {
      setError(err.message || 'Error al eliminar la sucursal');
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden p-5 space-y-4 animate-scale-up">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Eliminar Sucursal
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            ¿Confirmas la eliminación definitiva de la sucursal{' '}
            <strong className="text-slate-950">"{sucursal.nombre}"</strong>?
          </p>
        </div>

        {error && (
          <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
            {error}
          </div>
        )}

        <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-800">
          Esta acción eliminará el centro de acopio de la base de datos y dejará de mostrarse en la cabecera pública de los clientes.
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={eliminando}
            className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg transition-all active:scale-95 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={eliminando}
            className="px-4 py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 disabled:bg-slate-300 rounded-lg transition-all active:scale-95 cursor-pointer"
          >
            {eliminando ? 'Eliminando...' : 'Eliminar Sucursal'}
          </button>
        </div>
      </div>
    </div>
  );
}
