import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recycle, RotateCw } from 'lucide-react';
import { APP_INFO, ROUTES } from '../../../shared/constants/appConfig';
import { SucursalesChips } from './SucursalesChips';

/**
 * Cabecera corporativa de la aplicación cliente móvil con soporte nativo PWA.
 * Incluye un gesto secreto ("Easter egg"): pulsar 5 veces sobre "Green Circle"
 * y a continuación pulsar el botón de "Actualizar" redirige discretamente al login de administración.
 */
export function Header({ sucursales = [], onRefresh, isRefreshing = false }) {
  const navigate = useNavigate();
  const [tapCount, setTapCount] = useState(0);
  const [isArmed, setIsArmed] = useState(false);
  const resetTimerRef = useRef(null);

  // Limpiar temporizador al desmontar el componente
  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const handleTitleTap = () => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    const nextCount = tapCount + 1;
    setTapCount(nextCount);

    if (nextCount >= 5) {
      setIsArmed(true);
      // Micro-vibración háptica suave en dispositivos móviles compatibles
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        try {
          navigator.vibrate(40);
        } catch {
          // Ignorar si el navegador restringe la vibración
        }
      }

      // El secreto permanece armado durante 6 segundos esperando el toque en "Actualizar"
      resetTimerRef.current = setTimeout(() => {
        setTapCount(0);
        setIsArmed(false);
      }, 6000);
    } else {
      // Si no alcanza 5 toques en 3.5 segundos, se reinicia el contador
      resetTimerRef.current = setTimeout(() => {
        setTapCount(0);
        setIsArmed(false);
      }, 3500);
    }
  };

  const handleRefreshClick = (e) => {
    if (isArmed) {
      // Disparador secreto activado: limpiar estado y redirigir al login administrativo
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
      setTapCount(0);
      setIsArmed(false);
      navigate(ROUTES.MOBILE_ADMIN);
      return;
    }

    if (onRefresh) {
      onRefresh(e);
    }
  };

  return (
    <header
      className="bg-white border-b border-slate-200 px-5 py-4 sticky top-0 z-30 select-none"
      style={{ paddingTop: 'max(env(safe-area-inset-top), 1rem)' }}
    >
      <div className="flex items-center justify-between">
        <div
          onClick={handleTitleTap}
          className="flex items-center gap-3 cursor-pointer select-none"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleTitleTap();
            }
          }}
          title={APP_INFO.name}
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-800 flex items-center justify-center text-white shrink-0">
            <Recycle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-semibold text-slate-900 text-base tracking-tight">
              {APP_INFO.name}
            </h1>
            <p className="text-xs text-slate-500">{APP_INFO.subtitle}</p>
          </div>
        </div>

        {onRefresh && (
          <button
            type="button"
            onClick={handleRefreshClick}
            disabled={isRefreshing}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0 select-none"
            title="Actualizar catálogo de precios"
          >
            <RotateCw
              className={`w-3.5 h-3.5 ${
                isRefreshing ? 'animate-spin text-emerald-800' : 'text-slate-500'
              }`}
            />
            <span>{isRefreshing ? 'Actualizando...' : 'Actualizar'}</span>
          </button>
        )}
      </div>

      <SucursalesChips sucursales={sucursales} />
    </header>
  );
}
