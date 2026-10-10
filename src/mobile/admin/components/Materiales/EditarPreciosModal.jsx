import React, { useState, useEffect } from 'react';

/**
 * Modal para actualizar los precios vigentes de compra y venta de un material.
 * Al actualizarse, PostgreSQL audita el cambio cerrando el periodo anterior
 * y creando un nuevo registro histórico (SCD Tipo 2).
 */
export function EditarPreciosModal({ material, isOpen, onClose, onGuardar }) {
  const [precioCompra, setPrecioCompra] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (material) {
      setPrecioCompra(material.precio_compra !== null ? String(material.precio_compra) : '');
      setPrecioVenta(material.precio_venta !== null ? String(material.precio_venta) : '');
      setError(null);
    }
  }, [material]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pc = parseFloat(precioCompra);
    const pv = parseFloat(precioVenta);

    if (isNaN(pc) || pc < 0 || isNaN(pv) || pv < 0) {
      setError('Los precios deben ser números válidos mayores o iguales a cero.');
      return;
    }

    try {
      setGuardando(true);
      setError(null);
      await onGuardar(material.codigo, {
        precioCompra: pc,
        precioVenta: pv
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Error al actualizar precios');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden p-5 space-y-4 animate-scale-up">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Actualizar Precios
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Material: <strong className="text-slate-900">{material.nombre}</strong>
          </p>
        </div>

        {error && (
          <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Precio Compra ($/kg)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              inputMode="decimal"
              value={precioCompra}
              onChange={(e) => setPrecioCompra(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Precio Venta ($/kg)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              inputMode="decimal"
              value={precioVenta}
              onChange={(e) => setPrecioVenta(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={guardando}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg transition-all active:scale-95 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 rounded-lg transition-all active:scale-95 cursor-pointer"
            >
              {guardando ? 'Actualizando...' : 'Guardar Precios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
