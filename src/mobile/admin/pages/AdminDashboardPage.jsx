import React, { useState, useMemo } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { AdminDrawer } from '../components/AdminDrawer';
import { MaterialAdminItem } from '../components/Materiales/MaterialAdminItem';
import { NuevoMaterialModal } from '../components/Materiales/NuevoMaterialModal';
import { EditarPreciosModal } from '../components/Materiales/EditarPreciosModal';
import { ToggleActivoModal } from '../components/Materiales/ToggleActivoModal';
import { SucursalAdminItem } from '../components/Sucursales/SucursalAdminItem';
import { SucursalFormModal } from '../components/Sucursales/SucursalFormModal';
import { EliminarSucursalModal } from '../components/Sucursales/EliminarSucursalModal';
import { HistoricoModuloView } from '../components/Historicos/HistoricoModuloView';

/**
 * Dashboard administrativo móvil para gestionar materiales, precios y sucursales.
 */
export function AdminDashboardPage({ user, onLogout, adminData }) {
  const {
    materiales,
    sucursales,
    cargando,
    error,
    crearMaterialConPrecios,
    cambiarEstadoActivo,
    modificarPrecios,
    agregarSucursal,
    modificarSucursal,
    borrarSucursal
  } = adminData;

  const [tabActiva, setTabActiva] = useState('materiales'); // 'materiales' | 'sucursales'
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  // Modales de Materiales
  const [modalNuevoMaterial, setModalNuevoMaterial] = useState(false);
  const [materialAEditarPrecios, setMaterialAEditarPrecios] = useState(null);
  const [materialAToggleActivo, setMaterialAToggleActivo] = useState(null);

  // Modales de Sucursales
  const [modalSucursalForm, setModalSucursalForm] = useState(false);
  const [sucursalAEditar, setSucursalAEditar] = useState(null);
  const [sucursalAEliminar, setSucursalAEliminar] = useState(null);

  // Mensaje de éxito temporal
  const [mensajeExito, setMensajeExito] = useState(null);

  const mostrarExito = (msg) => {
    setMensajeExito(msg);
    setTimeout(() => setMensajeExito(null), 4000);
  };

  // Filtrado de materiales
  const materialesFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return materiales;
    return materiales.filter(
      (m) =>
        m.nombre.toLowerCase().includes(q) ||
        m.codigo.toLowerCase().includes(q)
    );
  }, [materiales, busqueda]);

  // Filtrado de sucursales
  const sucursalesFiltradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return sucursales;
    return sucursales.filter((s) => s.nombre.toLowerCase().includes(q));
  }, [sucursales, busqueda]);

  // Diccionario de materiales para asociar código con nombre en los históricos
  const materialesMap = useMemo(() => {
    const mapa = {};
    (materiales || []).forEach((m) => {
      mapa[m.codigo] = m;
    });
    return mapa;
  }, [materiales]);

  const titulos = {
    materiales: 'Materiales',
    sucursales: 'Sucursales',
    historico_compra: 'Historial Precios Compra',
    historico_venta: 'Historial Precios Venta'
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col max-w-md mx-auto border-x border-slate-200">
      {/* 1. Cabecera con Botón de Menú Hamburguesa */}
      <AdminHeader
        onOpenMenu={() => setMenuAbierto(true)}
        tituloModulo={titulos[tabActiva] || 'Administración'}
      />

      {/* 2. Menú Lateral Desplegable (Drawer) */}
      <AdminDrawer
        isOpen={menuAbierto}
        onClose={() => setMenuAbierto(false)}
        moduloActivo={tabActiva}
        onSeleccionarModulo={(mod) => {
          setTabActiva(mod);
          setBusqueda('');
        }}
        countMateriales={materiales.length}
        countSucursales={sucursales.length}
        user={user}
        onLogout={onLogout}
      />

      {/* 3. Contenido Principal */}
      <main className="flex-1 p-4 space-y-3.5 pb-8">
        {/* Toast flotante nativo de confirmación */}
        {mensajeExito && (
          <div
            className="fixed left-1/2 -translate-x-1/2 z-50 max-w-[90vw] flex items-center gap-2.5 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-full shadow-2xl border border-slate-700 animate-slide-up select-none"
            style={{ bottom: 'max(env(safe-area-inset-bottom), 1.5rem)' }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="font-medium truncate">{mensajeExito}</span>
            <button
              onClick={() => setMensajeExito(null)}
              className="ml-1 text-slate-400 hover:text-white p-0.5 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Error general */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
            {error}
          </div>
        )}

        {/* Barra superior con Buscador y Botón de Creación (Solo para Materiales y Sucursales) */}
        {(tabActiva === 'materiales' || tabActiva === 'sucursales') && (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={
                  tabActiva === 'materiales'
                    ? 'Buscar por nombre o código...'
                    : 'Buscar sucursal...'
                }
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 transition-colors"
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

            {tabActiva === 'materiales' ? (
              <button
                onClick={() => setModalNuevoMaterial(true)}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shrink-0 transition-all active:scale-95 cursor-pointer"
              >
                + Material
              </button>
            ) : (
              <button
                onClick={() => {
                  setSucursalAEditar(null);
                  setModalSucursalForm(true);
                }}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shrink-0 transition-all active:scale-95 cursor-pointer"
              >
                + Sucursal
              </button>
            )}
          </div>
        )}

        {/* ================= SECCIÓN DE MATERIALES ================= */}
        {tabActiva === 'materiales' && (
          <div className="space-y-2.5">
            {cargando && materiales.length === 0 ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl p-4 border border-slate-200 animate-pulse h-28" />
                ))}
              </div>
            ) : materialesFiltrados.length === 0 ? (
              <div className="bg-white rounded-xl p-8 border border-slate-200 text-center text-xs text-slate-500">
                {busqueda
                  ? 'No se encontraron materiales que coincidan con la búsqueda.'
                  : 'No hay materiales registrados en el catálogo.'}
              </div>
            ) : (
              materialesFiltrados.map((item) => (
                <MaterialAdminItem
                  key={item.codigo}
                  material={item}
                  onEditarPrecios={(mat) => setMaterialAEditarPrecios(mat)}
                  onToggleActivo={(mat) => setMaterialAToggleActivo(mat)}
                />
              ))
            )}
          </div>
        )}

        {/* ================= SECCIÓN DE SUCURSALES ================= */}
        {tabActiva === 'sucursales' && (
          <div className="space-y-2.5">
            {cargando && sucursales.length === 0 ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-xl p-4 border border-slate-200 animate-pulse h-20" />
                ))}
              </div>
            ) : sucursalesFiltradas.length === 0 ? (
              <div className="bg-white rounded-xl p-8 border border-slate-200 text-center text-xs text-slate-500">
                {busqueda
                  ? 'No se encontraron sucursales que coincidan con la búsqueda.'
                  : 'No hay sucursales registradas.'}
              </div>
            ) : (
              sucursalesFiltradas.map((suc) => (
                <SucursalAdminItem
                  key={suc.id}
                  sucursal={suc}
                  onEditar={(s) => {
                    setSucursalAEditar(s);
                    setModalSucursalForm(true);
                  }}
                  onEliminar={(s) => setSucursalAEliminar(s)}
                />
              ))
            )}
          </div>
        )}

        {/* ================= SECCIÓN HISTÓRICO DE COMPRA ================= */}
        {tabActiva === 'historico_compra' && (
          <HistoricoModuloView
            tipo="compra"
            materialesMap={materialesMap}
          />
        )}

        {/* ================= SECCIÓN HISTÓRICO DE VENTA ================= */}
        {tabActiva === 'historico_venta' && (
          <HistoricoModuloView
            tipo="venta"
            materialesMap={materialesMap}
          />
        )}
      </main>

      {/* ================= MODALES DE MATERIALES ================= */}
      <NuevoMaterialModal
        isOpen={modalNuevoMaterial}
        onClose={() => setModalNuevoMaterial(false)}
        onCrear={async (datos) => {
          const res = await crearMaterialConPrecios(datos);
          mostrarExito(`Material "${res.nombre}" registrado exitosamente en estado inactivo.`);
        }}
      />

      <EditarPreciosModal
        material={materialAEditarPrecios}
        isOpen={Boolean(materialAEditarPrecios)}
        onClose={() => setMaterialAEditarPrecios(null)}
        onGuardar={async (codigo, precios) => {
          await modificarPrecios(codigo, precios);
          mostrarExito('Precios actualizados y registrados en el histórico correctamente.');
        }}
      />

      <ToggleActivoModal
        material={materialAToggleActivo}
        isOpen={Boolean(materialAToggleActivo)}
        onClose={() => setMaterialAToggleActivo(null)}
        onConfirm={async (codigo, nuevoEstado) => {
          await cambiarEstadoActivo(codigo, nuevoEstado);
          mostrarExito(
            nuevoEstado
              ? 'Material activado y visible al público.'
              : 'Material desactivado y ocultado del público.'
          );
        }}
      />

      {/* ================= MODALES DE SUCURSALES ================= */}
      <SucursalFormModal
        sucursal={sucursalAEditar}
        isOpen={modalSucursalForm}
        onClose={() => {
          setModalSucursalForm(false);
          setSucursalAEditar(null);
        }}
        onGuardar={async (datos) => {
          if (sucursalAEditar) {
            await modificarSucursal(sucursalAEditar.id, datos);
            mostrarExito('Sucursal actualizada correctamente.');
          } else {
            await agregarSucursal(datos);
            mostrarExito('Nueva sucursal creada con éxito.');
          }
        }}
      />

      <EliminarSucursalModal
        sucursal={sucursalAEliminar}
        isOpen={Boolean(sucursalAEliminar)}
        onClose={() => setSucursalAEliminar(null)}
        onConfirm={async (id) => {
          await borrarSucursal(id);
          mostrarExito('Sucursal eliminada del sistema.');
        }}
      />
    </div>
  );
}
