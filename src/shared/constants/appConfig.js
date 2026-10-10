/**
 * Constantes globales de configuración de la plataforma Green Circle
 */
export const AUTO_REFRESH_INTERVAL_MS = 30000; // 30 segundos de actualización automática

export const APP_INFO = {
  name: 'Green Circle',
  subtitle: 'Centro de Acopio',
  disclaimer: 'Todos los precios están sujetos a revisión'
};

// Ruta privada y difícil de adivinar para el panel administrativo (secuencia de caracteres aleatorios).
// Puede personalizarse opcionalmente mediante la variable de entorno VITE_ADMIN_PATH en el frontend.
export const ADMIN_SLUG = (import.meta.env.VITE_ADMIN_PATH || 'gAca26vd8').replace(/^\/+/, '');

export const ROUTES = {
  MOBILE_PUBLIC: '/',
  MOBILE_ADMIN: `/${ADMIN_SLUG}`,
  PC_ROOT: '/pc'
};
