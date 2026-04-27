import React, { useEffect, useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { ExpenseCard } from '../components/ExpenseCard';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { Search, ListFilter, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ExpensesScreen = () => {
  const { expenses, fetchExpenses, isLoading, deleteExpense } = useExpenses();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const confirmDelete = async () => {
    if (deleteId) {
      await deleteExpense(deleteId);
      setDeleteId(null);
    }
  };

  const filteredExpenses = expenses.filter(e => 
    e.category.toLowerCase().includes(search.toLowerCase()) || 
    (e.note && e.note.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-300">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">All Expenses</h1>
      </header>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search by category or note..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full rounded-2xl border-0 py-3 pl-10 pr-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <ListFilter className="h-5 w-5 text-slate-400" />
        </div>
      </div>

      <div className="space-y-3 pb-6">
        {isLoading && expenses.length === 0 ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 w-full animate-pulse rounded-2xl bg-slate-200"></div>
          ))
        ) : filteredExpenses.length === 0 ? (
          <EmptyState 
            icon={AlertCircle} 
            title="No expenses found" 
            description={search ? "Try a different search term" : "Add some expenses to see them here"}
          />
        ) : (
          filteredExpenses.map(expense => (
            <ExpenseCard 
              key={expense._id} 
              expense={expense} 
              onEdit={(e) => navigate(`/edit/${e._id}`)}
              onDelete={(id) => setDeleteId(id)}
            />
          ))
        )}
      </div>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Expense">
        <p className="text-slate-600 mb-6">Are you sure you want to delete this expense? This action cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" className="flex-1" onClick={confirmDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
};
