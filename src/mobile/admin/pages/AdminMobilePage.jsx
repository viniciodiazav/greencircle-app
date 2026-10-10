import React from 'react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { useAdminData } from '../hooks/useAdminData';
import { AdminLoginPage } from './AdminLoginPage';
import { AdminDashboardPage } from './AdminDashboardPage';

/**
 * Contenedor principal del Panel Administrativo Móvil.
 * Maneja el flujo de autenticación JWT y renderiza el Dashboard o Login.
 */
export function AdminMobilePage() {
  const {
    user,
    isAuthenticated,
    cargando: cargandoAuth,
    errorLogin,
    login,
    logout
  } = useAdminAuth();

  const adminData = useAdminData(isAuthenticated);

  if (cargandoAuth) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center max-w-md mx-auto">
        <div className="text-xs text-slate-400 font-medium animate-pulse">
          Cargando entorno seguro...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginPage onLogin={login} error={errorLogin} />;
  }

  return (
    <AdminDashboardPage
      user={user}
      onLogout={logout}
      adminData={adminData}
    />
  );
}
