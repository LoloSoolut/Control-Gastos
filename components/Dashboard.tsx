import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, Expense, Category } from '../types';
import { CATEGORY_COLORS, CATEGORY_LABELS, MONTHS_ES } from '../constants';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import AiInsights from './AiInsights';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchExpenses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching expenses:', error);
    } else {
      setExpenses(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, [user.id]);

  // Filtrado de datos del mes seleccionado
  const currentMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  const totalCurrent = currentMonthExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Datos para el gráfico de pastel
  const pieData = Object.values(Category).map(cat => ({
    name: CATEGORY_LABELS[cat],
    value: currentMonthExpenses
      .filter(e => e.category === cat)
      .reduce((acc, curr) => acc + curr.amount, 0),
    color: CATEGORY_COLORS[cat]
  })).filter(item => item.value > 0);

  // Lógica de comparación con mes anterior
  const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
  const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
  const prevMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
  });
  const totalPrev = prevMonthExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const diff = totalCurrent - totalPrev;
  const percentageDiff = totalPrev === 0 ? 0 : ((diff / totalPrev) * 100).toFixed(1);

  // Datos para el gráfico de barras (últimos 6 meses)
  const barData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const m = d.getMonth();
    const y = d.getFullYear();
    const monthlyTotal = expenses
      .filter(e => {
        const ed = new Date(e.date);
        return ed.getMonth() === m && ed.getFullYear() === y;
      })
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    return {
      name: MONTHS_ES[m],
      total: monthlyTotal
    };
  });

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resumen Financiero</h1>
          <p className="text-gray-500 mt-1">Hola. Aquí tienes tus estadísticas de {MONTHS_ES[selectedMonth]} {selectedYear}.</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {MONTHS_ES.map((m, idx) => (
              <option key={`month-${idx}`} value={idx}>{m}</option>
            ))}
          </select>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {[2024, 2025].map(y => (
              <option key={`year-${y}`} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Gasto Total Mes</p>
            <p className="text-2xl font-bold text-gray-900">{totalCurrent.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className={`p-3 rounded-xl ${diff <= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {diff <= 0 ? <TrendingDown size={24} /> : <TrendingUp size={24} />}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Vs. Mes Anterior</p>
            <p className={`text-2xl font-bold ${diff <= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {diff > 0 ? '+' : ''}{diff.toFixed(2)}€ ({percentageDiff}%)
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Transacciones</p>
            <p className="text-2xl font-bold text-gray-900">{currentMonthExpenses.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Distribución por Categoría</h3>
          <div className="h-64">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    formatter={(value: number) => `${value.toFixed(2)}€`}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 italic">No hay datos para este periodo</div>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Histórico Últimos 6 Meses</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
          </div>
        </div>
      </div>

      <AiInsights expenses={currentMonthExpenses} total={totalCurrent} />
    </div>
  );
};

export default Dashboard;