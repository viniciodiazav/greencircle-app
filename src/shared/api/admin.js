import { apiRequest } from './client';

/**
 * SERVICIOS ADMINISTRATIVOS PARA GESTIÓN DE MATERIALES, PRECIOS Y SUCURSALES
 * (Requieren token de autenticación de Administrador)
 */

// ==================== MATERIALES ====================

/**
 * Obtiene la lista completa de materiales del catálogo
 */
export async function getAdminMateriales() {
  return apiRequest('/materiales');
}

/**
 * Registra un nuevo material.
 * Por regla de negocio, nace inactivo (activo: false).
 */
export async function crearAdminMaterial(nombre) {
  return apiRequest('/materiales', {
    method: 'POST',
    body: JSON.stringify({
      nombre: nombre.trim(),
      activo: false
    })
  });
}

/**
 * Cambia el estado activo / inactivo de un material
 */
export async function toggleAdminMaterialActivo(codigo, activo) {
  return apiRequest(`/materiales/${encodeURIComponent(codigo)}/activo`, {
    method: 'PATCH',
    body: JSON.stringify({ activo })
  });
}

// ==================== PRECIOS ====================

/**
 * Obtiene los precios actuales vigentes de todos los materiales
 */
export async function getAdminPrecios() {
  return apiRequest('/precios');
}

/**
 * Asigna los precios iniciales de compra y venta al crear un material
 */
export async function fijarAdminPrecioInicial(codigo, precioCompra, precioVenta) {
  return apiRequest('/precios', {
    method: 'POST',
    body: JSON.stringify({
      codigo,
      precio_compra: parseFloat(precioCompra),
      precio_venta: parseFloat(precioVenta)
    })
  });
}

/**
 * Actualiza los precios vigentes de un material (SCD Tipo 2 en BD)
 */
export async function actualizarAdminPrecios(codigo, { precioCompra, precioVenta }) {
  const payload = {};
  if (precioCompra !== undefined && precioCompra !== null && precioCompra !== '') {
    payload.precio_compra = parseFloat(precioCompra);
  }
  if (precioVenta !== undefined && precioVenta !== null && precioVenta !== '') {
    payload.precio_venta = parseFloat(precioVenta);
  }

  return apiRequest(`/precios/${encodeURIComponent(codigo)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
}

// ==================== SUCURSALES ====================

/**
 * Obtiene la lista completa de sucursales con identificadores
 */
export async function getAdminSucursales() {
  return apiRequest('/sucursales');
}

/**
 * Registra una nueva sucursal
 */
export async function crearAdminSucursal({ nombre, url }) {
  return apiRequest('/sucursales', {
    method: 'POST',
    body: JSON.stringify({
      nombre: nombre.trim(),
      url: url ? url.trim() : null
    })
  });
}

/**
 * Actualiza el nombre o la url de una sucursal existente
 */
export async function actualizarAdminSucursal(id, { nombre, url }) {
  return apiRequest(`/sucursales/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      nombre: nombre ? nombre.trim() : undefined,
      url: url !== undefined ? (url ? url.trim() : null) : undefined
    })
  });
}

/**
 * Elimina físicamente una sucursal
 */
export async function eliminarAdminSucursal(id) {
  return apiRequest(`/sucursales/${id}`, {
    method: 'DELETE'
  });
}

// ==================== HISTÓRICOS DE PRECIOS ====================

/**
 * Consulta el histórico contable de precios de compra (SCD Tipo 2)
 */
export async function getHistoricoCompra({ limit = 10, skip = 0, codigo_material, solo_vigentes } = {}) {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit);
  if (skip) params.append('skip', skip);
  if (codigo_material) params.append('codigo_material', codigo_material);
  if (solo_vigentes !== undefined && solo_vigentes !== null) params.append('solo_vigentes', solo_vigentes);

  const query = params.toString() ? `?${params.toString()}` : '';
  return apiRequest(`/historicos-compra${query}`);
}

/**
 * Consulta el histórico contable de precios de venta (SCD Tipo 2)
 */
export async function getHistoricoVenta({ limit = 10, skip = 0, codigo_material, solo_vigentes } = {}) {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit);
  if (skip) params.append('skip', skip);
  if (codigo_material) params.append('codigo_material', codigo_material);
  if (solo_vigentes !== undefined && solo_vigentes !== null) params.append('solo_vigentes', solo_vigentes);

  const query = params.toString() ? `?${params.toString()}` : '';
  return apiRequest(`/historicos-venta${query}`);
}

