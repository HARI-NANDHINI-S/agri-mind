import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Table,
  Search,
  Filter,
  PlusCircle,
  Download,
  Trash2,
  Eye,
  ArrowUpDown,
  ArrowLeft,
  FileText,
  CheckCircle2
} from 'lucide-react';

export default function ExpenseList() {
  const { expenses, deleteExpense, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortAsc, setSortAsc] = useState(false);
  const navigate = useNavigate();

  const categories = [
    'All',
    'Fertilizer & Soil',
    'Fuel & Machinery',
    'Seeds & Propagation',
    'Labor & Contracting',
    'Irrigation & Water',
    'Pesticides & Crop Health'
  ];

  const filteredExpenses = expenses
    .filter(exp => {
      const matchText = exp.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        exp.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        exp.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        exp.id.toLowerCase().includes(searchTerm.toLowerCase());
      if (categoryFilter === 'All') return matchText;
      return matchText && exp.category === categoryFilter;
    })
    .sort((a, b) => {
      if (sortAsc) return a.amount - b.amount;
      return b.amount - a.amount;
    });

  const handleExportCSV = () => {
    showToast('Exporting Expense Ledger to CSV file...', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/expenses')}
            className="w-10 h-10 rounded-full hover:bg-surface-container dark:hover:bg-slate-800 flex items-center justify-center text-on-surface-variant transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-primary uppercase tracking-widest">
                Expense Ledger
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-surface-container dark:bg-slate-800 text-on-surface-variant">
                {expenses.length} Records
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-on-surface dark:text-white">
              All Farm Expense Transactions
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container dark:bg-slate-800 hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <NavLink
            to="/expenses-add"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add Expense</span>
          </NavLink>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items, vendors, vouchers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/40 text-xs text-on-surface dark:text-white focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container dark:bg-slate-800 text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-low/60 dark:bg-slate-800/80 border-b border-outline-variant/40 text-on-surface-variant font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Voucher ID</th>
                <th className="py-3 px-4">Item & Field</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4">Date</th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:text-primary"
                  onClick={() => setSortAsc(!sortAsc)}
                >
                  <div className="flex items-center gap-1">
                    <span>Amount (₹)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-surface-container-low/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-primary dark:text-emerald-400">
                    {exp.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-sm text-on-surface dark:text-white">{exp.item}</div>
                    <div className="text-[11px] text-on-surface-variant">{exp.field}</div>
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant font-medium">{exp.category}</td>
                  <td className="py-3.5 px-4 text-on-surface-variant">{exp.vendor}</td>
                  <td className="py-3.5 px-4 text-on-surface-variant font-mono text-[11px]">{exp.date}</td>
                  <td className="py-3.5 px-4 font-bold text-sm text-on-surface dark:text-white">
                    ₹{exp.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {exp.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <NavLink
                        to={`/expenses-details/${exp.id}`}
                        className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
                        title="View Voucher Details"
                      >
                        <Eye className="w-4 h-4" />
                      </NavLink>
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/60 text-on-surface-variant hover:text-rose-600 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
