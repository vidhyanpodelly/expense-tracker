import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { Expense, Summary } from '../types';
import { api } from '../api/mockBackend';
import { useAuth } from './AuthContext';

interface ExpenseState {
  expenses: Expense[];
  summary: Summary | null;
  isLoading: boolean;
  error: string | null;
}

type Action =
  | { type: 'SET_LOADING' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'FETCH_SUCCESS'; payload: { expenses: Expense[]; summary: Summary } }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'UPDATE_SUMMARY'; payload: Summary }
  | { type: 'CLEAR_ERROR' };

const initialState: ExpenseState = {
  expenses: [],
  summary: null,
  isLoading: false,
  error: null,
};

const expenseReducer = (state: ExpenseState, action: Action): ExpenseState => {
  switch (action.type) {
    case 'SET_LOADING': return { ...state, isLoading: true, error: null };
    case 'SET_ERROR': return { ...state, isLoading: false, error: action.payload };
    case 'CLEAR_ERROR': return { ...state, error: null };
    case 'FETCH_SUCCESS': return { ...state, isLoading: false, expenses: action.payload.expenses, summary: action.payload.summary };
    case 'ADD_EXPENSE': return { ...state, expenses: [action.payload, ...state.expenses] };
    case 'UPDATE_EXPENSE': return {
      ...state,
      expenses: state.expenses.map(e => (e._id === action.payload._id ? action.payload : e))
    };
    case 'DELETE_EXPENSE': return {
      ...state,
      expenses: state.expenses.filter(e => e._id !== action.payload)
    };
    case 'UPDATE_SUMMARY': return { ...state, summary: action.payload };
    default: return state;
  }
};

interface ExpenseContextType extends ExpenseState {
  fetchExpenses: () => Promise<void>;
  addExpense: (data: Partial<Expense>) => Promise<void>;
  updateExpense: (id: string, data: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState);
  const { token } = useAuth();

  const handleNetworkError = (error: unknown, fallbackMessage: string) => {
    if (!navigator.onLine) {
      dispatch({ type: 'SET_ERROR', payload: 'You are offline. Cannot sync changes.' });
    } else {
      const msg = error instanceof Error ? error.message : fallbackMessage;
      dispatch({ type: 'SET_ERROR', payload: msg });
    }
    throw error;
  };

  const refreshSummary = async () => {
    if (!token) return;
    try {
      const summary = await api.expenses.getSummary(token);
      dispatch({ type: 'UPDATE_SUMMARY', payload: summary });
    } catch (e) {
      console.error('Failed to update summary', e);
    }
  };

  const fetchExpenses = useCallback(async () => {
    if (!token) return;
    dispatch({ type: 'SET_LOADING' });
    try {
      if (!navigator.onLine) {
        // Simple offline cache reading
        const cachedEx = localStorage.getItem('cached_expenses');
        const cachedSum = localStorage.getItem('cached_summary');
        if (cachedEx && cachedSum) {
          dispatch({ type: 'FETCH_SUCCESS', payload: { expenses: JSON.parse(cachedEx), summary: JSON.parse(cachedSum) }});
          dispatch({ type: 'SET_ERROR', payload: 'Offline mode: Showing cached data.' });
          return;
        } else {
          throw new Error('No internet connection and no cached data available.');
        }
      }
      
      const [expenses, summary] = await Promise.all([
        api.expenses.getAll(token),
        api.expenses.getSummary(token)
      ]);
      
      localStorage.setItem('cached_expenses', JSON.stringify(expenses));
      localStorage.setItem('cached_summary', JSON.stringify(summary));
      
      dispatch({ type: 'FETCH_SUCCESS', payload: { expenses, summary } });
    } catch (error) {
      handleNetworkError(error, 'Failed to fetch expenses');
    }
  }, [token]);

  const addExpense = async (data: Partial<Expense>) => {
    if (!token) return;
    try {
      if (!navigator.onLine) throw new Error('Offline');
      const newExpense = await api.expenses.create(token, data);
      dispatch({ type: 'ADD_EXPENSE', payload: newExpense });
      await refreshSummary();
    } catch (error) {
      handleNetworkError(error, 'Failed to add expense');
    }
  };

  const updateExpense = async (id: string, data: Partial<Expense>) => {
    if (!token) return;
    try {
      if (!navigator.onLine) throw new Error('Offline');
      const updated = await api.expenses.update(token, id, data);
      dispatch({ type: 'UPDATE_EXPENSE', payload: updated });
      await refreshSummary();
    } catch (error) {
      handleNetworkError(error, 'Failed to update expense');
    }
  };

  const deleteExpense = async (id: string) => {
    if (!token) return;
    try {
      if (!navigator.onLine) throw new Error('Offline');
      await api.expenses.delete(token, id);
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
      await refreshSummary();
    } catch (error) {
      handleNetworkError(error, 'Failed to delete expense');
    }
  };

  return (
    <ExpenseContext.Provider value={{ ...state, fetchExpenses, addExpense, updateExpense, deleteExpense }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) throw new Error('useExpenses must be used within ExpenseProvider');
  return context;
};
