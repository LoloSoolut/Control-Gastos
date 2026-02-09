
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Expense, Category } from '../types';
import { Sparkles, BrainCircuit } from 'lucide-react';

interface AiInsightsProps {
  expenses: Expense[];
  total: number;
}

const AiInsights: React.FC<AiInsightsProps> = ({ expenses, total }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateInsights = async () => {
    if (expenses.length === 0) return;
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const summary = expenses.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
      }, {} as Record<string, number>);

      const prompt = `Analiza mis gastos de este mes y dame un consejo financiero corto y motivador en español. 
      Total gastado: ${total}€. 
      Desglose por categorías: ${JSON.stringify(summary)}. 
      Sé breve, directo y usa un tono profesional pero amable.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setInsight(response.text || 'No se pudo generar el consejo en este momento.');
    } catch (error) {
      console.error('Error generating AI insights:', error);
      setInsight('Configura tu API_KEY para recibir consejos inteligentes de ahorro.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (expenses.length > 0 && !insight) {
      generateInsights();
    }
  }, [expenses]);

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <BrainCircuit size={120} />
      </div>
      
      <div className="relative z-10 flex items-start gap-4">
        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
          <Sparkles className="text-yellow-300 w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold">Consejo de Ahorro Inteligente</h3>
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-pulse flex space-x-2">
                <div className="h-2 w-2 bg-white/50 rounded-full"></div>
                <div className="h-2 w-2 bg-white/50 rounded-full"></div>
                <div className="h-2 w-2 bg-white/50 rounded-full"></div>
              </div>
              <span className="text-sm text-indigo-100">Analizando tus patrones...</span>
            </div>
          ) : (
            <p className="text-indigo-50 leading-relaxed text-sm md:text-base">
              {insight || 'Añade algunos gastos para que la IA pueda analizar tu comportamiento financiero.'}
            </p>
          )}
          {!loading && (
            <button 
                onClick={generateInsights}
                className="text-xs text-white/70 hover:text-white underline mt-2 transition-colors"
            >
                Actualizar consejo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiInsights;
