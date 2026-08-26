import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  PlusCircle,
  TrendingUp,
  Table,
  BarChart3,
  ArrowRight,
  Receipt,
  PieChart,
  Calendar,
  AlertCircle,
  FileText
} from 'lucide-react';

export default function ExpenseDashboard() {
  const { expenses } = useApp();
  const navigate = useNavigate();

  const totalSpend = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const fertilizerSpend = expenses
    .filter(e => e.category.includes('Fertilizer'))
    .reduce((acc, curr) => acc + curr.amount, 0);
  const laborSpend = expenses
    .filter(e => e.category.includes('Labor'))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const budgetMonthly = 18000;
  const budgetUtilization = ((totalSpend / budgetMonthly) * 100).toFixed(0);

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
            <span>Farm Financial Control</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-on-surface-variant font-normal">Kharif / Rabi 2026</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface dark:text-white">
            Farm Expense & Input Cost Management
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <NavLink
            to="/expenses-list"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container dark:bg-slate-800 hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
          >
            <Table className="w-4 h-4 text-primary" />
            <span>Full Expense Ledger</span>
          </NavLink>

          <NavLink
            to="/expenses-analytics"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container dark:bg-slate-800 hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
          >
            <BarChart3 className="w-4 h-4 text-primary" />
            <span>Analytics & Variance</span>
          </NavLink>

          <NavLink
            to="/expenses-add"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add Expense</span>
          </NavLink>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-on-surface-variant mb-2">
            <span className="font-semibold uppercase tracking-wider">Total Season Spend</span>
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-on-surface dark:text-white">
            ₹{totalSpend.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-on-surface-variant mt-1">Across all 5 farm zones</p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-on-surface-variant mb-2">
            <span className="font-semibold uppercase tracking-wider">Fertilizer & Soil Burn</span>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
          </div>
          <div className="text-2xl font-bold text-on-surface dark:text-white">
            ₹{fertilizerSpend.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-primary dark:text-emerald-400 mt-1">
            {((fertilizerSpend / totalSpend) * 100).toFixed(0)}% of total input cost
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-on-surface-variant mb-2">
            <span className="font-semibold uppercase tracking-wider">Labor & Crews</span>
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
          </div>
          <div className="text-2xl font-bold text-on-surface dark:text-white">
            ₹{laborSpend.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-on-surface-variant mt-1">8 seasonal contracts cleared</p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-on-surface-variant mb-2">
            <span className="font-semibold uppercase tracking-wider">Budget Status</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300">
              {budgetUtilization}% Used
            </span>
          </div>
          <div className="text-2xl font-bold text-on-surface dark:text-white">
            ₹{(budgetMonthly - totalSpend).toLocaleString('en-IN', { minimumFractionDigits: 0 })} left
          </div>
          <div className="w-full bg-surface-container-high dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-primary h-full rounded-full" style={{ width: `${Math.min(100, budgetUtilization)}%` }}></div>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Transactions & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Recent Transactions Table */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
            <div>
              <h2 className="text-base font-bold text-on-surface dark:text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-primary" />
                <span>Recent Expense Transactions</span>
              </h2>
              <p className="text-xs text-on-surface-variant">Live audit ledger synchronized across field managers</p>
            </div>

            <NavLink
              to="/expenses-list"
              className="text-xs font-semibold text-primary dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>View All ({expenses.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-outline-variant/30 text-on-surface-variant uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-2.5 px-3">Item / Description</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {expenses.slice(0, 5).map((exp) => (
                  <tr
                    key={exp.id}
                    onClick={() => navigate(`/expenses-details/${exp.id}`)}
                    className="hover:bg-surface-container-low dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-3">
                      <div className="font-semibold text-on-surface dark:text-white group-hover:text-primary transition-colors">
                        {exp.item}
                      </div>
                      <span className="text-[10px] text-on-surface-variant">{exp.id} • {exp.field}</span>
                    </td>
                    <td className="py-3 px-3 text-on-surface-variant">{exp.category}</td>
                    <td className="py-3 px-3 text-on-surface-variant font-mono text-[11px]">{exp.date}</td>
                    <td className="py-3 px-3 font-bold text-sm text-on-surface dark:text-white">
                      ₹{exp.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {exp.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <NavLink
                        to={`/expenses-details/${exp.id}`}
                        className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-0.5"
                      >
                        <span>Voucher</span>
                        <ArrowRight className="w-3 h-3" />
                      </NavLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 4 Cols: Quick Actions & Spend Category Split */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-on-surface dark:text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-primary" />
              <span>Input Category Split</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Fertilizer & Soil</span>
                  <span>{((fertilizerSpend / totalSpend) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-surface-container-high dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${(fertilizerSpend / totalSpend) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Labor & Field Crew</span>
                  <span>{((laborSpend / totalSpend) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-surface-container-high dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(laborSpend / totalSpend) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Seeds, Fuel & Irrigation</span>
                  <span>{(100 - (fertilizerSpend + laborSpend) / totalSpend * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-surface-container-high dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${100 - (fertilizerSpend + laborSpend) / totalSpend * 100}%` }}></div>
                </div>
              </div>
            </div>

            <NavLink
              to="/expenses-analytics"
              className="block text-center text-xs font-semibold py-2.5 rounded-xl bg-primary/10 text-primary dark:bg-emerald-950 dark:text-emerald-300 hover:bg-primary/20 transition-all"
            >
              Open Full Expense Analytics →
            </NavLink>
          </div>

          {/* Quick Shortcuts */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Finance Shortcuts</h4>
            <NavLink
              to="/profitability"
              className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low dark:bg-slate-800 hover:bg-surface-container text-xs font-medium text-on-surface dark:text-slate-200 transition-colors"
            >
              <span>Net Profitability Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 text-primary" />
            </NavLink>
            <NavLink
              to="/crop-profitability"
              className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low dark:bg-slate-800 hover:bg-surface-container text-xs font-medium text-on-surface dark:text-slate-200 transition-colors"
            >
              <span>Crop Profit Comparison</span>
              <ArrowRight className="w-3.5 h-3.5 text-primary" />
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
