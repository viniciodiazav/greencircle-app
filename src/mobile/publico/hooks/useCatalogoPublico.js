import { useState, useEffect, useMemo, useCallback } from 'react';
import { getMaterialesPublicos, getSucursalesPublicas } from '../../../shared/api';
import { AUTO_REFRESH_INTERVAL_MS } from '../../../shared/constants/appConfig';

/**
 * Hook para la vista pública de clientes móviles:
 * - Carga inicial
 * - Auto-actualización silenciosa cada 30 segundos
 * - Búsqueda en tiempo real
 */
export function useCatalogoPublico() {
  const [materiales, setMateriales] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarDatos = useCallback(async (silencioso = false) => {
    try {
      if (!silencioso) {
        setCargando(true);
      }
      setError(null);

      const [matData, sucData] = await Promise.all([
        getMaterialesPublicos(),
        getSucursalesPublicas()
      ]);

      setMateriales(matData || []);
      setSucursales(sucData || []);
    } catch (err) {
      if (!silencioso) {
        setError(err.message || 'No fue posible cargar la información');
      }
    } finally {
      if (!silencioso) {
        setCargando(false);
      }
    }
  }, []);

  useEffect(() => {
    cargarDatos(false);

    const intervalo = setInterval(() => {
      cargarDatos(true);
    }, AUTO_REFRESH_INTERVAL_MS);

    return () => clearInterval(intervalo);
  }, [cargarDatos]);

  const materialesFiltrados = useMemo(() => {
    const query = busqueda.trim().toLowerCase();
    if (!query) return materiales;
    return materiales.filter((m) =>
      m.nombre.toLowerCase().includes(query)
    );
  }, [materiales, busqueda]);

  return {
    materiales,
    materialesFiltrados,
    sucursales,
    busqueda,
    setBusqueda,
    cargando,
    error,
    recargar: () => cargarDatos(false)
  };
}
