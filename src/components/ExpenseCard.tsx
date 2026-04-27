import React from 'react';
import { Expense } from '../types';
import { formatCurrency, formatDate } from '../utils';
import { Edit2, Trash2 } from 'lucide-react';

const categoryColors: Record<string, string> = {
  Food: 'bg-orange-100 text-orange-700',
  Transport: 'bg-blue-100 text-blue-700',
  Shopping: 'bg-pink-100 text-pink-700',
  Bills: 'bg-rose-100 text-rose-700',
  Entertainment: 'bg-purple-100 text-purple-700',
  Health: 'bg-emerald-100 text-emerald-700',
  Education: 'bg-indigo-100 text-indigo-700',
  Travel: 'bg-cyan-100 text-cyan-700',
  Other: 'bg-slate-100 text-slate-700',
};

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export const ExpenseCard = ({ expense, onEdit, onDelete }: ExpenseCardProps) => {
  return (
    <div className="group relative flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
              categoryColors[expense.category] || categoryColors.Other
            }`}
          >
            {expense.category}
          </span>
          <span className="text-sm text-slate-500">{formatDate(expense.date)}</span>
        </div>
        {expense.note && (
          <p className="text-sm font-medium text-slate-900 truncate max-w-[200px]">
            {expense.note}
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-base font-bold text-slate-900">
          {formatCurrency(expense.amount)}
        </span>
        <div className="flex flex-col gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(expense)} className="p-1 text-slate-400 hover:text-indigo-600">
            <Edit2 className="h-4 w-4" />
          </button>
          <button onClick={() => onDelete(expense._id)} className="p-1 text-slate-400 hover:text-rose-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
