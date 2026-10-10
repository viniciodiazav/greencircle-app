export * from './client';
export * from './publico';
export * from './auth';
export * from './admin';

// Retrocompatibilidad
export { getMaterialesPublicos as fetchMaterialesPublicos } from './publico';
export { getSucursalesPublicas as fetchSucursalesPublicas } from './publico';
