import { apiRequest } from './client';

/**
 * Autentica un usuario con nombre de usuario y contraseña
 */
export async function loginUsuario(usuario, password) {
  const data = await apiRequest('/auth/login-json', {
    method: 'POST',
    body: JSON.stringify({ usuario, password })
  });

  if (data.access_token) {
    if (!data.user?.admin) {
      throw new Error('Acceso denegado: Este panel es exclusivo para administradores.');
    }
    localStorage.setItem('gc_token', data.access_token);
    localStorage.setItem('gc_user', JSON.stringify(data.user));
  }

  return data;
}

/**
 * Cierra la sesión activa del usuario
 */
export function logoutUsuario() {
  localStorage.removeItem('gc_token');
  localStorage.removeItem('gc_user');
}

/**
 * Obtiene el usuario almacenado en la sesión local
 */
export function getUsuarioActual() {
  const userJson = localStorage.getItem('gc_user');
  try {
    return userJson ? JSON.parse(userJson) : null;
  } catch {
    return null;
  }
}
