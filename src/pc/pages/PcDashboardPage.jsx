import React from 'react';
import { Monitor, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Vista reservada para la plataforma de escritorio (PC) en Green Circle.
 * Diseñada para alojar en la siguiente fase las funciones operativas
 * de báscula, pesajes, tickets y stock.
 */
export function PcDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-white">
            <Monitor className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-semibold text-slate-900 text-sm">
              Green Circle — Estación de Trabajo PC
            </h1>
            <p className="text-xs text-slate-500">Módulo Operativo de Escritorio</p>
          </div>
        </div>
        <Link
          to="/"
          className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Ver vista móvil
        </Link>
      </header>

      <main className="flex-1 p-8 flex flex-col items-center justify-center text-center">
        <div className="max-w-md bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-3">
          <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <Monitor className="w-6 h-6" />
          </div>
          <h2 className="text-base font-semibold text-slate-900">
            Módulo PC en Construcción
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Esta sección está reservada para la fase operativa de escritorio: conexión con básculas, tickets de pesaje, control de caja e inventario masivo.
          </p>
        </div>
      </main>
    </div>
  );
}
