import React, { useState, useEffect } from 'react';

/**
 * Modal para el alta de un nuevo material con TRIPLE VALIDACIÓN.
 * Dado que el nombre y código de un material son inmutables por regla estricta
 * de base de datos, este modal previene errores ortográficos o accidentales.
 */
export function NuevoMaterialModal({ isOpen, onClose, onCrear }) {
  const [paso, setPaso] = useState(1); // 1 = Captura, 2 = Triple Validación
  const [nombre, setNombre] = useState('');
  const [precioCompra, setPrecioCompra] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');

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

  // Estados de la Triple Validación (Paso 2)
  const [checkOrtografia, setCheckOrtografia] = useState(false);
  const [checkInmutabilidad, setCheckInmutabilidad] = useState(false);
  const [checkPrecios, setCheckPrecios] = useState(false);
  const [nombreConfirmacion, setNombreConfirmacion] = useState('');

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setPaso(1);
    setNombre('');
    setPrecioCompra('');
    setPrecioVenta('');
    setCheckOrtografia(false);
    setCheckInmutabilidad(false);
    setCheckPrecios(false);
    setNombreConfirmacion('');
    setError(null);
    setGuardando(false);
    onClose();
  };

  const nombreLimpio = nombre.trim();
  const esPaso1Valido =
    nombreLimpio.length >= 3 &&
    !isNaN(parseFloat(precioCompra)) &&
    parseFloat(precioCompra) >= 0 &&
    !isNaN(parseFloat(precioVenta)) &&
    parseFloat(precioVenta) >= 0;

  // Validación 2: 3 checks obligatorios
  const checksCompletos = checkOrtografia && checkInmutabilidad && checkPrecios;

  // Validación 3: Escribir el nombre exacto
  const confirmacionCoincide =
    nombreConfirmacion.trim().toLowerCase() === nombreLimpio.toLowerCase();

  const esPaso2Listo = checksCompletos && confirmacionCoincide;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!esPaso2Listo || guardando) return;

    try {
      setGuardando(true);
      setError(null);
      await onCrear({
        nombre: nombreLimpio,
        precioCompra: parseFloat(precioCompra),
        precioVenta: parseFloat(precioVenta)
      });
      resetForm();
    } catch (err) {
      setError(err.message || 'Error al crear el material');
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">
        {/* Cabecera */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              {paso === 1 ? 'Registrar Nuevo Material' : 'Triple Validación de Seguridad'}
            </h2>
            <p className="text-[11px] text-slate-500">
              {paso === 1 ? 'Paso 1 de 2: Ficha técnica' : 'Paso 2 de 2: Confirmación obligatoria'}
            </p>
          </div>
          <button
            onClick={resetForm}
            disabled={guardando}
            className="text-slate-400 hover:text-slate-700 text-sm font-medium"
          >
            ✕
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-5 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
              {error}
            </div>
          )}

          {paso === 1 ? (
            /* PASO 1: Captura de Datos */
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (esPaso1Valido) setPaso(2);
              }}
              className="space-y-3.5"
            >
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nombre del Material
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-500"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Nota: El nombre no podrá modificarse una vez guardado.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg transition-all active:scale-95 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!esPaso1Valido}
                  className="px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 rounded-lg transition-all active:scale-95 cursor-pointer"
                >
                  Continuar a Validación →
                </button>
              </div>
            </form>
          ) : (
            /* PASO 2: TRIPLE VALIDACIÓN */
            <div className="space-y-4">
              {/* Validación 1: Resumen de Ficha Técnica */}
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg space-y-1">
                <div className="text-[11px] font-semibold text-amber-900 uppercase tracking-wide">
                  1. Verificación de Ficha Técnica
                </div>
                <div className="text-xs text-slate-800 space-y-0.5">
                  <p>
                    <span className="font-medium text-slate-500">Material:</span>{' '}
                    <strong className="text-slate-950 font-bold">{nombreLimpio}</strong>
                  </p>
                  <p>
                    <span className="font-medium text-slate-500">Precio de Compra:</span>{' '}
                    ${parseFloat(precioCompra).toFixed(2)} / kg
                  </p>
                  <p>
                    <span className="font-medium text-slate-500">Precio de Venta:</span>{' '}
                    ${parseFloat(precioVenta).toFixed(2)} / kg
                  </p>
                  <p className="text-[11px] text-amber-800 pt-1 font-medium">
                    El material se creará en estado INACTIVO por seguridad.
                  </p>
                </div>
              </div>

              {/* Validación 2: Declaraciones de Inmutabilidad Obligatorias */}
              <div className="space-y-2 border border-slate-200 rounded-lg p-3 bg-slate-50">
                <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">
                  2. Declaraciones de Inmutabilidad
                </div>

                <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkOrtografia}
                    onChange={(e) => setCheckOrtografia(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-0"
                  />
                  <span>
                    He revisado meticulosamente la ortografía de <strong>"{nombreLimpio}"</strong>.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkInmutabilidad}
                    onChange={(e) => setCheckInmutabilidad(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-0"
                  />
                  <span>
                    Comprendo que el nombre y código son <strong>100% inmutables</strong> y permanecerán por siempre en la base de datos sin posibilidad de eliminación.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkPrecios}
                    onChange={(e) => setCheckPrecios(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-0"
                  />
                  <span>
                    Confirmo los precios iniciales de compra y venta fijados.
                  </span>
                </label>
              </div>

              {/* Validación 3: Escribir para Confirmar */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-800">
                  3. Confirmación Escrita: Escribe{' '}
                  <span className="text-emerald-800 font-bold underline">
                    {nombreLimpio}
                  </span>{' '}
                  para desbloquear
                </label>
                <input
                  type="text"
                  value={nombreConfirmacion}
                  onChange={(e) => setNombreConfirmacion(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                />
              </div>

              {/* Botones de acción final */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPaso(1)}
                  disabled={guardando}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg transition-all active:scale-95 cursor-pointer"
                >
                  ← Corregir datos
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!esPaso2Listo || guardando}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 disabled:bg-slate-300 rounded-lg transition-all active:scale-95 shadow-sm cursor-pointer"
                >
                  {guardando ? 'Guardando en BD...' : 'Crear Material Permanentemente'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
