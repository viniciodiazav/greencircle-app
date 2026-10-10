import React from 'react';

/**
 * Campo de búsqueda sobrio para filtrar materiales
 */
export function SearchInput({ value, onChange, placeholder = 'Buscar material...' }) {
  return (
    <div className="relative">
      <input
        type="text"
        inputMode="search"
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-3.5 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 transition-colors"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 active:scale-90 text-xs rounded-full cursor-pointer"
          title="Limpiar búsqueda"
        >
          ✕
        </button>
      )}
    </div>
  );
}
