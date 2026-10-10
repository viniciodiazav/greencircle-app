import { apiRequest } from './client';

/**
 * Obtiene el catálogo público de materiales activos (solo nombre y precio compra)
 */
export async function getMaterialesPublicos() {
  return apiRequest('/publico/materiales');
}

/**
 * Obtiene el listado público de sucursales activas (solo nombre y url)
 */
export async function getSucursalesPublicas() {
  return apiRequest('/publico/sucursales');
}
