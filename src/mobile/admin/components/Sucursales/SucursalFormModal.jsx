import React, { useState, useEffect } from 'react';

/**
 * Modal para crear o editar una sucursal (nombre y url)
 */
export function SucursalFormModal({ sucursal, isOpen, onClose, onGuardar }) {
  const [nombre, setNombre] = useState('');
  const [url, setUrl] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  const esEdicion = Boolean(sucursal);

  useEffect(() => {
    if (sucursal) {
      setNombre(sucursal.nombre || '');
      setUrl(sucursal.url || '');
    } else {
      setNombre('');
      setUrl('');
    }
    setError(null);
  }, [sucursal, isOpen]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nombreLimpio = nombre.trim();
    if (!nombreLimpio) {
      setError('El nombre de la sucursal es obligatorio.');
      return;
    }

    try {
      setGuardando(true);
      setError(null);
      await onGuardar({
        nombre: nombreLimpio,
        url: url.trim() || null
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Error al guardar la sucursal');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden p-5 space-y-4 animate-scale-up">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            {esEdicion ? 'Editar Sucursal' : 'Nueva Sucursal'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {esEdicion
              ? 'Modifica el nombre o enlace de la sucursal'
              : 'Registra un nuevo centro de acopio'}
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
              Nombre de la Sucursal
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Enlace de Ubicación (URL Google Maps)
            </label>
            <input
              type="url"
              inputMode="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
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
              {guardando ? 'Guardando...' : esEdicion ? 'Actualizar' : 'Crear Sucursal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
