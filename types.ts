
export enum Category {
  FACTURAS = 'FACTURAS',
  HIPOTECA = 'HIPOTECA',
  COMIDA = 'COMIDA',
  OCIO = 'OCIO',
  EXTRAS = 'EXTRAS'
}

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: Category;
  description: string;
  date: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
}

export interface MonthlyStats {
  month: string;
  total: number;
  byCategory: Record<Category, number>;
}
