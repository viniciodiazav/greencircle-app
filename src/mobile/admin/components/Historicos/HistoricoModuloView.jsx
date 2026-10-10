import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getHistoricoCompra, getHistoricoVenta } from '../../../../shared/api';
import { HistoricoCard } from './HistoricoCard';
import { HistoricoLineChart } from './HistoricoLineChart';
import { CambiarLimiteModal } from './CambiarLimiteModal';

/**
 * Vista de módulo para consultar el histórico de precios (Compra o Venta)
 * Por defecto muestra los últimos 10 registros y permite al administrador
 * cambiar la cantidad de registros a consultar, así como alternar entre
 * vista de tarjetas (lista) y gráfica de líneas temporal.
 */
export function HistoricoModuloView({ tipo = 'compra', materialesMap = {} }) {
  const [limite, setLimite] = useState(10);
  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [modalLimite, setModalLimite] = useState(false);
  const [modoVista, setModoVista] = useState('lista'); // 'lista' | 'grafica'

  const cargarDatos = useCallback(async (cantLimite) => {
    try {
      setCargando(true);
      setError(null);
      const fetcher = tipo === 'compra' ? getHistoricoCompra : getHistoricoVenta;
      const data = await fetcher({ limit: cantLimite });
      setRegistros(data || []);
    } catch (err) {
      setError(err.message || 'Error al cargar registros históricos');
    } finally {
      setCargando(false);
    }
  }, [tipo]);

  // Carga inicial y cada vez que cambia el tipo o el límite
  useEffect(() => {
    cargarDatos(limite);
  }, [tipo, limite, cargarDatos]);

  // Filtrado reactivo en memoria
  const registrosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return registros;
    return registros.filter((r) => {
      const nombreMat = materialesMap[r.codigo_material]?.nombre || '';
      return (
        r.id.toLowerCase().includes(q) ||
        r.codigo_material.toLowerCase().includes(q) ||
        nombreMat.toLowerCase().includes(q)
      );
    });
  }, [registros, busqueda, materialesMap]);

  return (
    <div className="space-y-3.5">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
          {error}
        </div>
      )}

      {/* Barra de control: Buscador y Botón de Límite de Registros */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar por código, material o ID..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-400 transition-colors"
          />
          {busqueda && (
            <button
              type="button"
              onClick={() => setBusqueda('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 text-[11px] rounded-full active:scale-90"
            >
              ✕
            </button>
          )}
        </div>

        <button
          onClick={() => setModalLimite(true)}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shrink-0 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          title="Configurar cantidad de registros a mostrar"
        >
          <span>Ver {limite}</span>
        </button>
      </div>

      {/* Selector Segmentado de Modo de Visualización (Lista vs Gráfica) */}
      <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-xs font-medium select-none">
        <button
          type="button"
          onClick={() => setModoVista('lista')}
          className={`flex-1 py-1.5 rounded-md transition-all active:scale-[0.98] cursor-pointer ${
            modoVista === 'lista'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Lista ({registrosFiltrados.length})
        </button>
        <button
          type="button"
          onClick={() => setModoVista('grafica')}
          className={`flex-1 py-1.5 rounded-md transition-all active:scale-[0.98] cursor-pointer ${
            modoVista === 'grafica'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Gráfica de Líneas
        </button>
      </div>

      {/* Indicador de registros cargados */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
        <span>
          Mostrando {registrosFiltrados.length} de {registros.length} registros (límite: {limite})
        </span>
        <button
          onClick={() => cargarDatos(limite)}
          disabled={cargando}
          className="text-slate-700 hover:text-slate-950 underline font-medium cursor-pointer"
        >
          {cargando ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>

      {/* Visualización Condicional: Modo Gráfica o Modo Lista */}
      {modoVista === 'grafica' ? (
        <HistoricoLineChart
          registros={registrosFiltrados}
          materialesMap={materialesMap}
          tipo={tipo}
        />
      ) : (
        /* Pila de registros históricos */
        <div className="space-y-2.5">
          {cargando && registros.length === 0 ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-4 border border-slate-200 animate-pulse h-28"
                />
              ))}
            </div>
          ) : registrosFiltrados.length === 0 ? (
            <div className="bg-white rounded-xl p-8 border border-slate-200 text-center text-xs text-slate-500">
              {busqueda
                ? 'No se encontraron registros que coincidan con la búsqueda.'
                : 'No hay registros históricos disponibles.'}
            </div>
          ) : (
            registrosFiltrados.map((item) => {
              const material = materialesMap[item.codigo_material];
              return (
                <HistoricoCard
                  key={item.id}
                  registro={item}
                  nombreMaterial={material?.nombre}
                />
              );
            })
          )}
        </div>
      )}

      {/* Modal para configurar la cantidad de registros */}
      <CambiarLimiteModal
        isOpen={modalLimite}
        onClose={() => setModalLimite(false)}
        limiteActual={limite}
        onAplicar={(nuevaCantidad) => {
          setLimite(nuevaCantidad);
          cargarDatos(nuevaCantidad);
        }}
      />
    </div>
  );
}
