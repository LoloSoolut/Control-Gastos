
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, Category } from '../types';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../constants';
// Fix: Use namespace import for react-router-dom
import * as Router from 'react-router-dom';
import { 
  Save, X, Receipt, Home, Utensils, 
  Palmtree, Sparkles 
} from 'lucide-react';

interface ExpenseFormProps {
  user: User;
}

const CATEGORY_ICONS: Record<Category, React.ElementType> = {
  [Category.FACTURAS]: Receipt,
  [Category.HIPOTECA]: Home,
  [Category.COMIDA]: Utensils,
  [Category.OCIO]: Palmtree,
  [Category.EXTRAS]: Sparkles,
};

const ExpenseForm: React.FC<ExpenseFormProps> = ({ user }) => {
  const navigate = Router.useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category: Category.FACTURAS,
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount) return;
    
    setLoading(true);

    const { error } = await supabase
      .from('expenses')
      .insert([
        {
          user_id: user.id,
          amount: parseFloat(formData.amount),
          category: formData.category,
          description: formData.description,
          date: formData.date,
        },
      ]);

    if (error) {
      alert('Error al guardar el gasto: ' + error.message);
    } else {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-indigo-50/50 to-white">
          <h2 className="text-2xl font-black text-gray-900">Añadir Gasto</h2>
          <p className="text-gray-500 mt-1 font-medium">Registra una nueva transacción de forma rápida.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Cantidad (€)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">€</span>
                  <input
                    required
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full pl-9 pr-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-xl font-bold text-gray-900"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Fecha</label>
                <input
                  required
                  type="date"
                  className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium text-gray-700"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-700 ml-1">Selecciona una Categoría</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {Object.values(Category).map((cat) => {
                  const Icon = CATEGORY_ICONS[cat];
                  const isSelected = formData.category === cat;
                  const color = CATEGORY_COLORS[cat];
                  
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 group ${
                        isSelected 
                          ? 'border-transparent shadow-lg scale-105' 
                          : 'border-gray-100 hover:border-gray-200 bg-gray-50/50 grayscale opacity-70 hover:grayscale-0 hover:opacity-100'
                      }`}
                      style={{ 
                        backgroundColor: isSelected ? color : undefined,
                        color: isSelected ? 'white' : '#64748b'
                      }}
                    >
                      <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'animate-bounce' : 'group-hover:scale-110 transition-transform'}`} />
                      <span className="text-[10px] font-black uppercase tracking-wider">
                        {CATEGORY_LABELS[cat]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Descripción</label>
              <textarea
                placeholder="Ej. Cena en el centro, factura de luz, etc."
                rows={2}
                className="w-full px-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium text-gray-700 resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border-2 border-gray-100 text-gray-500 font-bold hover:bg-gray-50 transition-all active:scale-95"
            >
              <X size={20} />
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"
            >
              <Save size={20} />
              {loading ? 'Guardando...' : 'Confirmar Gasto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
