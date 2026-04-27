export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Expense {
  _id: string;
  userId: string;
  amount: number;
  category: string;
  date: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Summary {
  total: number;
  byCategory: Record<string, number>;
}

export const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Travel',
  'Other'
];
