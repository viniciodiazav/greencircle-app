import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getAdminMateriales,
  getAdminPrecios,
  getAdminSucursales,
  crearAdminMaterial,
  fijarAdminPrecioInicial,
  toggleAdminMaterialActivo,
  actualizarAdminPrecios,
  crearAdminSucursal,
  actualizarAdminSucursal,
  eliminarAdminSucursal
} from '../../../shared/api';

/**
 * Hook para la gestión de datos del panel administrativo:
 * - Materiales y sus precios correspondientes
 * - Sucursales
 * - Mutaciones y recargas
 */
export function useAdminData(isAuthenticated) {
  const [materiales, setMateriales] = useState([]);
  const [preciosMap, setPreciosMap] = useState({});
  const [sucursales, setSucursales] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const cargarDatos = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setCargando(true);
      setError(null);

      const [matList, precList, sucList] = await Promise.all([
        getAdminMateriales(),
        getAdminPrecios(),
        getAdminSucursales()
      ]);

      // Mapear precios por código de material
      const mapa = {};
      (precList || []).forEach((p) => {
        mapa[p.codigo] = p;
      });

      setMateriales(matList || []);
      setPreciosMap(mapa);
      setSucursales(sucList || []);
    } catch (err) {
      setError(err.message || 'Error al cargar datos administrativos');
    } finally {
      setCargando(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Materiales enriquecidos con su precio vigente
  const materialesConPrecios = useMemo(() => {
    return materiales.map((m) => {
      const precioInfo = preciosMap[m.codigo];
      return {
        ...m,
        precio_compra: precioInfo?.precio_compra ?? null,
        precio_venta: precioInfo?.precio_venta ?? null,
        tiene_precios: Boolean(precioInfo && precioInfo.precio_compra !== null && precioInfo.precio_venta !== null)
      };
    });
  }, [materiales, preciosMap]);

  // Acción: Crear material con sus precios iniciales
  const crearMaterialConPrecios = async ({ nombre, precioCompra, precioVenta }) => {
    // 1. Crear material (nace con activo = false)
    const materialCreado = await crearAdminMaterial(nombre);

    // 2. Asignar precios iniciales
    await fijarAdminPrecioInicial(materialCreado.codigo, precioCompra, precioVenta);

    // 3. Refrescar catálogo
    await cargarDatos();
    return materialCreado;
  };

  // Acción: Activar o desactivar material con validación
  const cambiarEstadoActivo = async (codigo, nuevoEstado) => {
    await toggleAdminMaterialActivo(codigo, nuevoEstado);
    await cargarDatos();
  };

  // Acción: Actualizar precios de compra y venta
  const modificarPrecios = async (codigo, { precioCompra, precioVenta }) => {
    await actualizarAdminPrecios(codigo, { precioCompra, precioVenta });
    await cargarDatos();
  };

  // Acciones de sucursales
  const agregarSucursal = async ({ nombre, url }) => {
    const nueva = await crearAdminSucursal({ nombre, url });
    await cargarDatos();
    return nueva;
  };

  const modificarSucursal = async (id, { nombre, url }) => {
    const actualizada = await actualizarAdminSucursal(id, { nombre, url });
    await cargarDatos();
    return actualizada;
  };

  const borrarSucursal = async (id) => {
    await eliminarAdminSucursal(id);
    await cargarDatos();
  };

  return {
    materiales: materialesConPrecios,
    sucursales,
    cargando,
    error,
    refrescar: cargarDatos,
    crearMaterialConPrecios,
    cambiarEstadoActivo,
    modificarPrecios,
    agregarSucursal,
    modificarSucursal,
    borrarSucursal
  };
}
