import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ErrorBanner } from '../components/ErrorBanner';
import { CATEGORIES } from '../types';
import { ArrowLeft, DollarSign, Calendar, Tag, FileText } from 'lucide-react';

export const AddEditExpenseScreen = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { expenses, addExpense, updateExpense } = useExpenses();

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const expense = expenses.find(e => e._id === id);
      if (expense) {
        setAmount(expense.amount.toString());
        setCategory(expense.category);
        setDate(new Date(expense.date).toISOString().split('T')[0]);
        setNote(expense.note || '');
      } else {
        navigate('/'); // Invalid ID
      }
    }
  }, [id, isEdit, expenses, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }
    if (!category) {
      setError('Please select a category.');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        amount: Number(amount),
        category,
        date: new Date(date).toISOString(),
        note: note.trim()
      };

      if (isEdit) {
        await updateExpense(id!, payload);
      } else {
        await addExpense(payload);
      }
      navigate(-1);
    } catch (err: any) {
      setError(err.message || 'Failed to save expense');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-slate-50 animate-in slide-in-from-bottom-8 duration-300">
      <header className="sticky top-0 z-10 flex items-center bg-white/80 px-4 py-4 backdrop-blur-md border-b border-slate-200">
        <button 
          onClick={() => navigate(-1)} 
          className="mr-4 rounded-full p-2 text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold text-slate-900">{isEdit ? 'Edit Expense' : 'Add Expense'}</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <ErrorBanner message={error} />
        
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
          <Input
            label="Amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            icon={<DollarSign className="h-5 w-5 text-indigo-500" />}
            placeholder="0.00"
            className="text-2xl font-semibold"
            required
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Category</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Tag className="h-5 w-5" />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full rounded-xl border-0 py-3 pl-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white appearance-none"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            icon={<Calendar className="h-5 w-5" />}
            required
          />

          <Input
            label="Note (Optional)"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            icon={<FileText className="h-5 w-5" />}
            placeholder="What was this for?"
          />

          <div className="pt-4">
            <Button type="submit" className="w-full shadow-lg shadow-indigo-200" isLoading={isLoading}>
              {isEdit ? 'Save Changes' : 'Add Expense'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};
