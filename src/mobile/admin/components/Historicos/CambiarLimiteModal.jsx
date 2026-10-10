import React, { useState, useEffect } from 'react';

/**
 * Modal para que el administrador configure la cantidad de registros a visualizar
 */
export function CambiarLimiteModal({ isOpen, onClose, limiteActual = 10, onAplicar }) {
  const [cantidad, setCantidad] = useState(String(limiteActual));
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

  if (!isOpen) return null;

  const handleAplicar = (e) => {
    e.preventDefault();
    const num = parseInt(cantidad, 10);
    if (isNaN(num) || num < 1) {
      setError('Ingresa un número entero mayor a 0.');
      return;
    }
    if (num > 500) {
      setError('El límite máximo permitido es de 500 registros.');
      return;
    }
    onAplicar(num);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs select-none">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xs overflow-hidden p-4 space-y-3 animate-scale-up">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Cantidad de Registros
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Indica cuántos registros deseas ver en pantalla.
          </p>
        </div>

        {error && (
          <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleAplicar} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Número de registros
            </label>
            <input
              type="number"
              min="1"
              max="500"
              inputMode="numeric"
              value={cantidad}
              onChange={(e) => {
                setCantidad(e.target.value);
                setError(null);
              }}
              required
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-500"
            />
          </div>

          {/* Accesos rápidos */}
          <div className="flex gap-1.5 pt-1">
            {[10, 25, 50, 100].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setCantidad(String(val))}
                className={`flex-1 py-1 text-xs rounded border transition-all active:scale-95 cursor-pointer ${
                  cantidad === String(val)
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {val}
              </button>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg transition-all active:scale-95 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all active:scale-95 cursor-pointer"
            >
              Mostrar Registros
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
