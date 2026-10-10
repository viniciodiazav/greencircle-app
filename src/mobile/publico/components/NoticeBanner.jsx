import React from 'react';
import { APP_INFO } from '../../../shared/constants/appConfig';

/**
 * Banner informativo en tono naranja suave que advierte
 * la condición de revisión de los precios publicados.
 */
export function NoticeBanner({ message = APP_INFO.disclaimer }) {
  return (
    <div className="px-3 py-2 bg-amber-50 border border-amber-200/90 rounded-lg text-center">
      <p className="text-xs text-amber-800 font-medium leading-relaxed">
        {message}
      </p>
    </div>
  );
}
