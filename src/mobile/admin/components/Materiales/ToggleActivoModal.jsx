import React, { useState, useEffect } from 'react';

/**
 * Modal compacto de confirmación para activar o desactivar un material.
 */
export function ToggleActivoModal({ material, isOpen, onClose, onConfirm }) {
  const [procesando, setProcesando] = useState(false);
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

  if (!isOpen || !material) return null;

  const seraActivo = !material.activo;
  const puedeActivar = material.tiene_precios && material.precio_compra !== null;

  const handleConfirm = async () => {
    if (seraActivo && !puedeActivar) return;
    try {
      setProcesando(true);
      setError(null);
      await onConfirm(material.codigo, seraActivo);
      onClose();
    } catch (err) {
      setError(err.message || 'Error al cambiar estado');
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs select-none">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xs overflow-hidden p-4 space-y-3 animate-scale-up">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            {seraActivo ? '¿Activar material?' : '¿Desactivar material?'}
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            {seraActivo ? (
              puedeActivar ? (
                <>¿Estás seguro de activar <strong>"{material.nombre}"</strong>? Pasará a mostrarse a los clientes.</>
              ) : (
                <>El material <strong>"{material.nombre}"</strong> requiere precios de compra y venta antes de activarse.</>
              )
            ) : (
              <>¿Estás seguro de desactivar <strong>"{material.nombre}"</strong>? Dejará de mostrarse en la lista pública.</>
            )}
          </p>
        </div>

        {error && (
          <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={procesando}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg transition-all active:scale-95 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={procesando || (seraActivo && !puedeActivar)}
            className={`px-3.5 py-1.5 text-xs font-semibold text-white rounded-lg transition-all active:scale-95 cursor-pointer ${
              seraActivo
                ? 'bg-emerald-800 hover:bg-emerald-900 disabled:bg-slate-300'
                : 'bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300'
            }`}
          >
            {procesando ? 'Procesando...' : seraActivo ? 'Activar' : 'Desactivar'}
          </button>
        </div>
      </div>
    </div>
  );
}
