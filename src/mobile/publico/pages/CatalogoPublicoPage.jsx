import React from 'react';
import { useCatalogoPublico } from '../hooks/useCatalogoPublico';
import {
  Header,
  NoticeBanner,
  SearchInput,
  MaterialesStack
} from '../components';

/**
 * Página principal pública de clientes en dispositivos móviles.
 * Muestra el catálogo de materiales con precios de compra por kilo,
 * sucursales y aviso operativo.
 */
export function CatalogoPublicoPage() {
  const {
    materialesFiltrados,
    sucursales,
    busqueda,
    setBusqueda,
    cargando,
    error,
    recargar
  } = useCatalogoPublico();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col max-w-md mx-auto border-x border-slate-200">
      {/* 1. Cabecera con branding, chips de sucursales y botón de actualización */}
      <Header
        sucursales={sucursales}
        onRefresh={recargar}
        isRefreshing={cargando}
      />

      {/* 2. Contenedor principal */}
      <main className="flex-1 px-4 py-4 space-y-3.5">
        {/* Aviso en tono naranja cálido */}
        <NoticeBanner />

        {/* Buscador reactivo */}
        <SearchInput
          value={busqueda}
          onChange={setBusqueda}
          placeholder="Buscar material..."
        />

        {/* Pila de materiales con gestión de carga, error y lista */}
        <MaterialesStack
          materiales={materialesFiltrados}
          cargando={cargando}
          error={error}
          onRetry={recargar}
        />
      </main>
    </div>
  );
}
