import React, { useState, useMemo } from 'react';

const PALETA_COLORES = [
  { stroke: '#059669', bg: 'rgba(5, 150, 105, 0.12)', border: '#059669' }, // Esmeralda
  { stroke: '#0284c7', bg: 'rgba(2, 132, 199, 0.12)', border: '#0284c7' }, // Azul cielo
  { stroke: '#7c3aed', bg: 'rgba(124, 58, 237, 0.12)', border: '#7c3aed' }, // Violeta
  { stroke: '#d97706', bg: 'rgba(217, 119, 6, 0.12)', border: '#d97706' }, // Ámbar
  { stroke: '#dc2626', bg: 'rgba(220, 38, 38, 0.12)', border: '#dc2626' }  // Rojo sobrio
];

function formatearFechaCorta(isoString) {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const hora = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dia}/${mes} ${hora}:${min}`;
  } catch {
    return isoString;
  }
}

function formatearFechaCompleta(isoString) {
  if (!isoString) return 'Vigente';
  try {
    const d = new Date(isoString);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const anio = d.getFullYear();
    const hora = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${anio} ${hora}:${min}`;
  } catch {
    return isoString;
  }
}

/**
 * Gráfica de líneas SVG interactiva y responsiva para evolución de precios históricos.
 * Sin dependencias pesadas, optimizada para pantallas móviles.
 */
export function HistoricoLineChart({
  registros = [],
  materialesMap = {},
  tipo = 'compra'
}) {
  const [materialSeleccionado, setMaterialSeleccionado] = useState('todos');
  const [puntoActivo, setPuntoActivo] = useState(null);

  // Lista de códigos de materiales únicos presentes en los registros
  const codigosUnicos = useMemo(() => {
    const setCodigos = new Set();
    registros.forEach((r) => {
      if (r.codigo_material) setCodigos.add(r.codigo_material);
    });
    return Array.from(setCodigos);
  }, [registros]);

  // Si el material seleccionado ya no existe en el set, volver a 'todos'
  const materialFiltro = codigosUnicos.includes(materialSeleccionado)
    ? materialSeleccionado
    : 'todos';

  // Filtrar registros por material seleccionado
  const registrosFiltrados = useMemo(() => {
    if (materialFiltro === 'todos') return registros;
    return registros.filter((r) => r.codigo_material === materialFiltro);
  }, [registros, materialFiltro]);

  // Agrupar y ordenar cronológicamente (más antiguo -> más reciente) por material
  const seriesPorMaterial = useMemo(() => {
    const series = {};

    codigosUnicos.forEach((codigo, idx) => {
      if (materialFiltro !== 'todos' && materialFiltro !== codigo) return;

      const items = registros
        .filter((r) => r.codigo_material === codigo)
        .slice()
        .sort((a, b) => new Date(a.vigente_desde) - new Date(b.vigente_desde));

      if (items.length > 0) {
        series[codigo] = {
          codigo,
          nombre: materialesMap[codigo]?.nombre || codigo,
          items,
          color: PALETA_COLORES[idx % PALETA_COLORES.length]
        };
      }
    });

    return series;
  }, [registros, codigosUnicos, materialFiltro, materialesMap]);

  // Cálculo de estadísticas globales de los registros visibles
  const stats = useMemo(() => {
    const precios = registrosFiltrados.map((r) => Number(r.precio)).filter((p) => !isNaN(p));
    if (precios.length === 0) return { min: 0, max: 0, actual: 0, count: 0 };

    const min = Math.min(...precios);
    const max = Math.max(...precios);
    // El actual es el último en orden cronológico o el vigente
    const vigente = registrosFiltrados.find((r) => r.vigente_hasta === null);
    const actual = vigente ? Number(vigente.precio) : precios[0];

    return {
      min,
      max,
      actual,
      count: registrosFiltrados.length
    };
  }, [registrosFiltrados]);

  // Si no hay datos
  if (registros.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-500">
        No hay registros disponibles para graficar.
      </div>
    );
  }

  // Dimensiones del canvas SVG
  const width = 500;
  const height = 240;
  const pad = { top: 25, right: 25, bottom: 35, left: 55 };
  const graphWidth = width - pad.left - pad.right;
  const graphHeight = height - pad.top - pad.bottom;

  // Rango Y (precios)
  let yMin = stats.min;
  let yMax = stats.max;
  if (yMin === yMax) {
    yMin = Math.max(0, yMin - 1);
    yMax = yMax + 1;
  } else {
    const buffer = (yMax - yMin) * 0.12;
    yMin = Math.max(0, yMin - buffer);
    yMax = yMax + buffer;
  }
  const yRange = yMax - yMin || 1;

  // Escala Y
  const getY = (val) => {
    const normalized = (val - yMin) / yRange;
    return pad.top + graphHeight - normalized * graphHeight;
  };

  // Líneas horizontales de referencia Y
  const lineasGuiaY = [
    { valor: yMin, y: getY(yMin) },
    { valor: yMin + yRange * 0.5, y: getY(yMin + yRange * 0.5) },
    { valor: yMax, y: getY(yMax) }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3.5 shadow-xs select-none">
      {/* 1. Selector de Material (si hay más de 1 en los datos) */}
      {codigosUnicos.length > 1 && (
        <div className="space-y-1">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Filtrar material en gráfica
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => {
                setMaterialSeleccionado('todos');
                setPuntoActivo(null);
              }}
              className={`px-3 py-1 text-xs rounded-full border transition-all active:scale-95 whitespace-nowrap cursor-pointer ${
                materialFiltro === 'todos'
                  ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Todos ({codigosUnicos.length})
            </button>
            {codigosUnicos.map((codigo, idx) => {
              const nombre = materialesMap[codigo]?.nombre || codigo;
              const color = PALETA_COLORES[idx % PALETA_COLORES.length];
              const activo = materialFiltro === codigo;
              return (
                <button
                  key={codigo}
                  onClick={() => {
                    setMaterialSeleccionado(codigo);
                    setPuntoActivo(null);
                  }}
                  className={`px-3 py-1 text-xs rounded-full border transition-all active:scale-95 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    activo
                      ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: color.stroke }}
                  />
                  <span>{nombre}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Tarjetas de Métricas Rápidas */}
      <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-center">
        <div>
          <span className="text-[10px] text-slate-400 block uppercase">Mínimo</span>
          <span className="font-semibold text-slate-900 text-xs tabular-nums">
            ${stats.min.toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block uppercase">Máximo</span>
          <span className="font-semibold text-slate-900 text-xs tabular-nums">
            ${stats.max.toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block uppercase">Vigente</span>
          <span className="font-semibold text-emerald-800 text-xs tabular-nums">
            ${stats.actual.toFixed(2)}
          </span>
        </div>
      </div>

      {/* 3. Contenedor de la Gráfica SVG */}
      <div className="relative overflow-hidden bg-slate-50/50 border border-slate-100 rounded-lg p-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          {/* Definición de degradados para las áreas */}
          <defs>
            {Object.entries(seriesPorMaterial).map(([codigo, serie]) => (
              <linearGradient
                key={`grad-${codigo}`}
                id={`grad-${codigo}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={serie.color.stroke} stopOpacity="0.25" />
                <stop offset="100%" stopColor={serie.color.stroke} stopOpacity="0.0" />
              </linearGradient>
            ))}
          </defs>

          {/* Líneas horizontales de guía */}
          {lineasGuiaY.map((linea, idx) => (
            <g key={idx}>
              <line
                x1={pad.left}
                y1={linea.y}
                x2={width - pad.right}
                y2={linea.y}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={pad.left - 8}
                y={linea.y + 3}
                textAnchor="end"
                className="text-[10px] fill-slate-400 font-mono tabular-nums"
              >
                ${linea.valor.toFixed(2)}
              </text>
            </g>
          ))}

          {/* Renderizado de Series de Datos */}
          {Object.entries(seriesPorMaterial).map(([codigo, serie]) => {
            const items = serie.items;
            const count = items.length;

            // Coordenadas de los puntos
            const points = items.map((item, idx) => {
              const x =
                count === 1
                  ? pad.left + graphWidth / 2
                  : pad.left + (idx / (count - 1)) * graphWidth;
              const y = getY(Number(item.precio));
              return { x, y, item, serie };
            });

            // Construir d para polilínea
            const pathD = points.reduce((acc, pt, idx) => {
              return `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`;
            }, '');

            // Construir d para área sombreada
            const areaD =
              points.length > 1
                ? `${pathD} L ${points[points.length - 1].x} ${pad.top + graphHeight} L ${points[0].x} ${pad.top + graphHeight} Z`
                : '';

            return (
              <g key={codigo}>
                {/* Área bajo la curva */}
                {areaD && (
                  <path
                    d={areaD}
                    fill={`url(#grad-${codigo})`}
                  />
                )}

                {/* Línea principal */}
                {pathD && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke={serie.color.stroke}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Puntos individuales */}
                {points.map((pt, pIdx) => {
                  const esActivo = puntoActivo?.item?.id === pt.item.id;
                  return (
                    <g key={pIdx}>
                      {/* Zona táctil invisible amplia */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="14"
                        fill="transparent"
                        className="cursor-pointer"
                        onClick={() =>
                          setPuntoActivo(esActivo ? null : pt)
                        }
                      />
                      {/* Punto visible */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={esActivo ? 6 : 4}
                        fill="#ffffff"
                        stroke={serie.color.stroke}
                        strokeWidth={esActivo ? 3 : 2}
                        className="transition-all pointer-events-none"
                      />
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Eje X: Etiquetas de Fechas (primer y último punto) */}
          {registrosFiltrados.length > 0 && (
            <g>
              <line
                x1={pad.left}
                y1={pad.top + graphHeight}
                x2={width - pad.right}
                y2={pad.top + graphHeight}
                stroke="#cbd5e1"
                strokeWidth="1"
              />
              <text
                x={pad.left}
                y={height - 12}
                textAnchor="start"
                className="text-[9px] fill-slate-400 font-mono"
              >
                {formatearFechaCorta(registrosFiltrados[registrosFiltrados.length - 1]?.vigente_desde)}
              </text>
              <text
                x={width - pad.right}
                y={height - 12}
                textAnchor="end"
                className="text-[9px] fill-slate-400 font-mono"
              >
                {formatearFechaCorta(registrosFiltrados[0]?.vigente_desde)}
              </text>
            </g>
          )}
        </svg>

        {/* 4. Detalle flotante interactivo del punto pulsado */}
        {puntoActivo && (
          <div className="mt-2 p-3 bg-slate-900 text-white rounded-lg text-xs space-y-1 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-700 pb-1">
              <span className="font-semibold text-white">
                {puntoActivo.serie.nombre}
              </span>
              <button
                onClick={() => setPuntoActivo(null)}
                className="text-slate-400 hover:text-white text-xs p-0.5"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
              <div>
                <span className="text-slate-400 block">Precio {tipo}:</span>
                <span className="font-bold text-emerald-400 text-sm tabular-nums">
                  ${Number(puntoActivo.item.precio).toFixed(2)} / kg
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Estado:</span>
                <span className="font-medium text-slate-200">
                  {puntoActivo.item.vigente_hasta ? 'Cerrado' : 'Vigente actual'}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block">Periodo:</span>
                <span className="text-slate-300 font-mono text-[10px]">
                  {formatearFechaCompleta(puntoActivo.item.vigente_desde)} →{' '}
                  {puntoActivo.item.vigente_hasta
                    ? formatearFechaCompleta(puntoActivo.item.vigente_hasta)
                    : 'Actualidad'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Leyenda explicativa inferior */}
      <div className="text-[11px] text-slate-400 pt-1 text-center">
        <span>Toca cualquier punto para ver el detalle del cambio</span>
      </div>
    </div>
  );
}
