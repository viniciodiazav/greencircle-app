import { useState, useEffect, useCallback } from 'react';
import { loginUsuario, logoutUsuario, getUsuarioActual } from '../../../shared/api/auth';

/**
 * Hook para gestionar el estado de autenticación del administrador
 */
export function useAdminAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorLogin, setErrorLogin] = useState(null);

  // Inicialización de sesión desde localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('gc_token');
    const savedUser = getUsuarioActual();

    if (savedToken && savedUser?.admin) {
      setToken(savedToken);
      setUser(savedUser);
    } else {
      setToken(null);
      setUser(null);
      logoutUsuario();
    }
    setCargando(false);
  }, []);

  const login = useCallback(async (usuario, password) => {
    try {
      setErrorLogin(null);
      const data = await loginUsuario(usuario, password);
      setToken(data.access_token);
      setUser(data.user);
      return data;
    } catch (err) {
      setErrorLogin(err.message || 'Error al autenticar usuario');
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    logoutUsuario();
    setToken(null);
    setUser(null);
  }, []);

  return {
    user,
    token,
    isAuthenticated: Boolean(token && user?.admin),
    cargando,
    errorLogin,
    login,
    logout
  };
}
