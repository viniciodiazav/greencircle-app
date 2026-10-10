import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../shared/constants/appConfig';

// Módulo Móvil (Público y Admin)
import { CatalogoPublicoPage } from '../mobile/publico/pages/CatalogoPublicoPage';
import { AdminMobilePage } from '../mobile/admin/pages/AdminMobilePage';

// Módulo PC (Desktop Operativo)
import { PcDashboardPage } from '../pc/pages/PcDashboardPage';

/**
 * Enrutador principal de la aplicación Green Circle.
 * El acceso al panel administrativo está resguardado en una ruta privada y difícil de adivinar.
 */
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 📱 1. Vistas Móviles */}
        {/* Vista pública del cliente (Lista de precios y sucursales) */}
        <Route path={ROUTES.MOBILE_PUBLIC} element={<CatalogoPublicoPage />} />

        {/* Panel administrativo móvil en ruta discreta e ininteligible */}
        <Route path={ROUTES.MOBILE_ADMIN} element={<AdminMobilePage />} />
        <Route path={`${ROUTES.MOBILE_ADMIN}/*`} element={<AdminMobilePage />} />

        {/* Trampa / Honeypot: Si intentan adivinar /admin o /login, redirige inmediatamente a la vista pública */}
        <Route path="/admin" element={<Navigate to="/" replace />} />
        <Route path="/admin/*" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<Navigate to="/" replace />} />

        {/* 🖥️ 2. Vista PC / Desktop (Fase Operativa) */}
        <Route path={ROUTES.PC_ROOT} element={<PcDashboardPage />} />
        <Route path={`${ROUTES.PC_ROOT}/*`} element={<PcDashboardPage />} />

        {/* 3. Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
