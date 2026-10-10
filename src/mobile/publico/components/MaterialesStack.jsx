import React from 'react';
import { MaterialCard } from './MaterialCard';

/**
 * Pila de materiales que gestiona los estados de carga (skeletons),
 * error, lista vacía y listado de tarjetas.
 */
export function MaterialesStack({
  materiales = [],
  cargando = false,
  error = null,
  onRetry
}) {
  // 1. Estado de carga inicial (Skeleton)
  if (cargando && materiales.length === 0) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg p-3.5 border border-slate-200 animate-pulse flex justify-between items-center"
          >
            <div className="w-32 h-4 bg-slate-200 rounded"></div>
            <div className="w-20 h-5 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Estado de error con reintento
  if (error && materiales.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-6 text-center space-y-2">
        <p className="text-xs text-slate-600">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-xs text-slate-900 underline font-medium"
          >
            Reintentar
          </button>
        )}
      </div>
    );
  }

  // 3. Estado de catálogo vacío o sin resultados de búsqueda
  if (materiales.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 border border-slate-200 text-center text-xs text-slate-500">
        No se encontraron materiales registrados.
      </div>
    );
  }

  // 4. Renderizado normal de la pila de materiales
  return (
    <section className="space-y-2">
      {materiales.map((item, index) => (
        <MaterialCard key={item.codigo || item.nombre || index} material={item} />
      ))}
    </section>
  );
}
