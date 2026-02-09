
import { Category } from './types';

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.FACTURAS]: '#3b82f6', // Blue
  [Category.HIPOTECA]: '#6366f1', // Indigo
  [Category.COMIDA]: '#10b981',   // Green
  [Category.OCIO]: '#f59e0b',     // Amber
  [Category.EXTRAS]: '#ef4444',   // Red
};

export const CATEGORY_LABELS: Record<Category, string> = {
  [Category.FACTURAS]: 'Facturas',
  [Category.HIPOTECA]: 'Hipoteca',
  [Category.COMIDA]: 'Comida',
  [Category.OCIO]: 'Ocio',
  [Category.EXTRAS]: 'Extras',
};

export const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
