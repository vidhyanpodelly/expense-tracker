import React, { useEffect, useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils';
import { EmptyState } from '../components/EmptyState';
import { ExpenseCard } from '../components/ExpenseCard';
import { Wallet, TrendingUp, AlertCircle, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';

export const DashboardScreen = () => {
  const { summary, expenses, fetchExpenses, isLoading, deleteExpense } = useExpenses();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const recentExpenses = expenses.slice(0, 3);

  const confirmDelete = async () => {
    if (deleteId) {
      await deleteExpense(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hi, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-sm text-slate-500">Here's your financial overview</p>
        </div>
        <Link 
          to="/add" 
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="h-6 w-6" />
        </Link>
      </header>

      {/* Total Card */}
      <section className="relative overflow-hidden rounded-3xl bg-indigo-600 p-6 shadow-xl shadow-indigo-200">
        <div className="relative z-10">
          <p className="text-indigo-100 font-medium flex items-center gap-2">
            <Wallet className="h-4 w-4" /> Total Spent
          </p>
          <h2 className="mt-2 text-4xl font-bold text-white tracking-tight">
            {isLoading && !summary ? '...' : formatCurrency(summary?.total || 0)}
          </h2>
        </div>
        <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-indigo-800/20 blur-2xl"></div>
      </section>

      {/* Category Summary */}
      <section>
        <h3 className="mb-4 text-lg font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-indigo-500" /> By Category
        </h3>
        {!summary?.byCategory || Object.keys(summary.byCategory).length === 0 ? (
          <div className="rounded-2xl bg-slate-100 p-6 text-center text-sm text-slate-500">
            No expenses yet. Add some to see your breakdown.
          </div>
        ) : (
          <div className="space-y-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            {Object.entries(summary.byCategory)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 4)
              .map(([category, amount]) => {
                const percentage = summary.total > 0 ? ((amount / summary.total) * 100).toFixed(0) : 0;
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-700">{category}</span>
                      <span className="font-semibold text-slate-900">{formatCurrency(amount)}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div 
                        className="h-full rounded-full bg-indigo-500 transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </section>

      {/* Recent Expenses */}
      <section className="pb-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Recent Expenses</h3>
          <Link to="/expenses" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
            See all
          </Link>
        </div>
        
        {isLoading && recentExpenses.length === 0 ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 w-full animate-pulse rounded-2xl bg-slate-200"></div>
            ))}
          </div>
        ) : recentExpenses.length === 0 ? (
          <EmptyState 
            icon={AlertCircle} 
            title="No recent expenses" 
            description="You haven't added any expenses lately."
          />
        ) : (
          <div className="space-y-3">
            {recentExpenses.map(expense => (
              <ExpenseCard 
                key={expense._id} 
                expense={expense} 
                onEdit={(e) => navigate(`/edit/${e._id}`)}
                onDelete={(id) => setDeleteId(id)}
              />
            ))}
          </div>
        )}
      </section>

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
