
import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Wallet, Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning', text: string } | null>(null);

  const configured = isSupabaseConfigured();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configured) {
      setMessage({ 
        type: 'warning', 
        text: '⚠️ Supabase no está configurado. Debes añadir tu URL y Anon Key en lib/supabase.ts' 
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { error } = isLogin 
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else if (!isLogin) {
        setMessage({ type: 'success', text: '¡Registro con éxito! Por favor verifica tu email o inicia sesión.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Error de conexión: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-indigo-600 rounded-2xl shadow-xl mb-6 transform -rotate-6">
            <Wallet className="text-white w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">SmartSpend</h1>
          <p className="text-gray-500 mt-2 font-medium">Toma el control de tu futuro financiero</p>
        </div>

        {!configured && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3 text-amber-800 text-sm italic">
            <AlertCircle className="shrink-0" size={20} />
            <p>
              <strong>Falta configuración:</strong> Edita <code>lib/supabase.ts</code> con tus credenciales de Supabase para poder iniciar sesión.
            </p>
          </div>
        )}

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-indigo-100 border border-indigo-50">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>

          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  required
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-xl text-sm font-medium ${
                message.type === 'error' ? 'bg-red-50 text-red-600' : 
                message.type === 'warning' ? 'bg-amber-50 text-amber-600' :
                'bg-green-50 text-green-600'
              }`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !configured}
              className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transform active:scale-95 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
            >
              {loading ? 'Procesando...' : isLogin ? 'Entrar' : 'Registrarme'}
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        </div>
        
        <p className="text-center text-xs text-gray-400 mt-8">
          SmartSpend v1.0 • Gestión Segura de Gastos con Supabase
        </p>
      </div>
    </div>
  );
};

export default Auth;
