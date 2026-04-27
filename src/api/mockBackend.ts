import { v4 as uuidv4 } from 'uuid';
import { Expense, Summary } from '../types';

// Simulate network latency
const delay = (ms: number = 600) => new Promise(resolve => setTimeout(resolve, ms));

const getStorage = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(`mock_db_${key}`);
  return data ? JSON.parse(data) : defaultValue;
};

const setStorage = <T>(key: string, value: T) => {
  localStorage.setItem(`mock_db_${key}`, JSON.stringify(value));
};

// Simulated API
export const api = {
  auth: {
    async register(data: any) {
      await delay();
      const users = getStorage<any[]>('users', []);
      if (users.find(u => u.email === data.email)) {
        throw new Error('User already exists');
      }
      const newUser = { id: uuidv4(), name: data.name, email: data.email, password: data.password };
      users.push(newUser);
      setStorage('users', users);
      const token = `fake-jwt-token-${newUser.id}`;
      return { token, user: { id: newUser.id, name: newUser.name, email: newUser.email } };
    },
    async login(data: any) {
      await delay();
      const users = getStorage<any[]>('users', []);
      const user = users.find(u => u.email === data.email && u.password === data.password);
      if (!user) throw new Error('Invalid credentials');
      const token = `fake-jwt-token-${user.id}`;
      return { token, user: { id: user.id, name: user.name, email: user.email } };
    },
    async getMe(token: string) {
      await delay();
      const userId = token.replace('fake-jwt-token-', '');
      const users = getStorage<any[]>('users', []);
      const user = users.find(u => u.id === userId);
      if (!user) throw new Error('Not authorized');
      return { id: user.id, name: user.name, email: user.email };
    }
  },
  expenses: {
    async getAll(token: string): Promise<Expense[]> {
      await delay();
      const userId = token.replace('fake-jwt-token-', '');
      const expenses = getStorage<Expense[]>('expenses', []);
      return expenses
        .filter(e => e.userId === userId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    async create(token: string, data: Partial<Expense>): Promise<Expense> {
      await delay();
      const userId = token.replace('fake-jwt-token-', '');
      const expenses = getStorage<Expense[]>('expenses', []);
      const newExpense: Expense = {
        _id: uuidv4(),
        userId,
        amount: Number(data.amount),
        category: data.category!,
        date: data.date || new Date().toISOString(),
        note: data.note || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      expenses.push(newExpense);
      setStorage('expenses', expenses);
      return newExpense;
    },
    async update(token: string, id: string, data: Partial<Expense>): Promise<Expense> {
      await delay();
      const userId = token.replace('fake-jwt-token-', '');
      const expenses = getStorage<Expense[]>('expenses', []);
      const index = expenses.findIndex(e => e._id === id && e.userId === userId);
      if (index === -1) throw new Error('Expense not found');
      
      expenses[index] = { ...expenses[index], ...data, updatedAt: new Date().toISOString() };
      setStorage('expenses', expenses);
      return expenses[index];
    },
    async delete(token: string, id: string): Promise<void> {
      await delay();
      const userId = token.replace('fake-jwt-token-', '');
      let expenses = getStorage<Expense[]>('expenses', []);
      const exists = expenses.find(e => e._id === id && e.userId === userId);
      if (!exists) throw new Error('Expense not found');
      
      expenses = expenses.filter(e => e._id !== id);
      setStorage('expenses', expenses);
    },
    async getSummary(token: string): Promise<Summary> {
      await delay(400);
      const userId = token.replace('fake-jwt-token-', '');
      const expenses = getStorage<Expense[]>('expenses', []);
      const userExpenses = expenses.filter(e => e.userId === userId);
      
      const total = userExpenses.reduce((sum, e) => sum + e.amount, 0);
      const byCategory = userExpenses.reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount;
        return acc;
      }, {} as Record<string, number>);
      
      return { total, byCategory };
    }
  }
};
