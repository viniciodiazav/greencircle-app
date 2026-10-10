import React, { useState } from 'react';
import { Recycle } from 'lucide-react';

/**
 * Pantalla de inicio de sesión exclusiva para administradores.
 * Minimalista, sobria y desacoplada de la interfaz pública de clientes.
 */
export function AdminLoginPage({ onLogin, error }) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [ingresando, setIngresando] = useState(false);
  const [errorLocal, setErrorLocal] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuario.trim() || !password) return;

    try {
      setIngresando(true);
      setErrorLocal(null);
      await onLogin(usuario.trim(), password);
    } catch (err) {
      setErrorLocal(err.message || 'Credenciales inválidas');
    } finally {
      setIngresando(false);
    }
  };

  const errorMessage = errorLocal || error;

  return (
    <div
      className="min-h-screen bg-slate-100 flex flex-col justify-center px-4 max-w-md mx-auto border-x border-slate-200 select-none"
      style={{
        paddingTop: 'max(env(safe-area-inset-top), 2rem)',
        paddingBottom: 'max(env(safe-area-inset-bottom), 2rem)'
      }}
    >
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-5 animate-scale-up">
        {/* Cabecera de autenticación */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center mx-auto">
            <Recycle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-900 tracking-tight">
              Green Circle
            </h1>
            <p className="text-xs text-slate-500">
              Acceso a Administración
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Usuario
            </label>
            <input
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="username"
              spellCheck="false"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={ingresando || !usuario.trim() || !password}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg transition-all active:scale-[0.98] shadow-xs cursor-pointer"
          >
            {ingresando ? 'Validando credenciales...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
