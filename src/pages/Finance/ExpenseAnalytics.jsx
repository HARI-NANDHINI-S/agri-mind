import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  BarChart3,
  TrendingDown,
  TrendingUp,
  PieChart,
  PlusCircle,
  Download,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function ExpenseAnalytics() {
  const navigate = useNavigate();
  const { expenses, showToast } = useApp();
  const [selectedMonth, setSelectedMonth] = useState('August 2026');

  const monthlyBreakdown = [
    { month: 'Apr', spend: 8400, budget: 10000 },
    { month: 'May', spend: 12200, budget: 14000 },
    { month: 'Jun', spend: 16500, budget: 15000 },
    { month: 'Jul', spend: 14200, budget: 16000 },
    { month: 'Aug (Current)', spend: 6630, budget: 18000 },
  ];

  const categoryVariance = [
    { name: 'Fertilizer & Soil', actual: 4250, budgeted: 3500, variance: '+21.4%', status: 'Over Budget', isWarning: true },
    { name: 'Labor & Contracting', actual: 2880, budgeted: 3200, variance: '-10.0%', status: 'Under Budget', isWarning: false },
    { name: 'Fuel & Machinery', actual: 1440, budgeted: 1600, variance: '-10.0%', status: 'Under Budget', isWarning: false },
    { name: 'Irrigation & Drip Maintenance', actual: 960, budgeted: 800, variance: '+20.0%', status: 'Over Budget', isWarning: true },
    { name: 'Seeds & Propagation', actual: 2360, budgeted: 2400, variance: '-1.6%', status: 'On Target', isWarning: false },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full hover:bg-surface-container dark:hover:bg-slate-800 flex items-center justify-center text-on-surface-variant transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[11px] font-bold text-primary uppercase tracking-widest">
              Financial Intelligence
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-on-surface dark:text-white">
              Farm Expense Analytics & Budget Variance
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast('Exporting Financial Variance Report...', 'info')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container dark:bg-slate-800 hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Analytics</span>
          </button>
          <NavLink
            to="/expenses-add"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Log Expense</span>
          </NavLink>
        </div>
      </div>

      {/* Monthly Burn Rate Chart Card */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
          <div>
            <h2 className="text-base font-bold text-on-surface dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span>Monthly Burn Rate: Actual vs Allocated Budget</span>
            </h2>
            <p className="text-xs text-on-surface-variant">Tracking operating capital deployment across the production season</p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-primary"></div>
              <span className="text-on-surface-variant font-medium">Actual Spend</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-slate-300 dark:bg-slate-600"></div>
              <span className="text-on-surface-variant font-medium">Budget Target</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="w-full bg-surface-container-low/50 dark:bg-slate-800/40 rounded-xl p-6 relative min-h-[260px] flex items-end justify-around gap-6 pb-8">
          {monthlyBreakdown.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 group w-24">
              <div className="flex items-end gap-2 w-full h-[180px]">
                {/* Spend bar */}
                <div
                  style={{ height: `${(item.spend / 20000) * 100}%` }}
                  className="w-1/2 bg-primary rounded-t-md group-hover:bg-primary-hover transition-all relative"
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded hidden group-hover:block whitespace-nowrap">
                    ₹{item.spend}
                  </div>
                </div>
                {/* Budget bar */}
                <div
                  style={{ height: `${(item.budget / 20000) * 100}%` }}
                  className="w-1/2 bg-slate-300 dark:bg-slate-600 rounded-t-md group-hover:opacity-80 transition-all relative"
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded hidden group-hover:block whitespace-nowrap">
                    Budget ₹{item.budget}
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold text-on-surface dark:text-slate-300">{item.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Variance Table */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
          <h3 className="text-sm font-bold text-on-surface dark:text-white">
            Category-wise Budget vs Actual Variance
          </h3>
          <span className="text-xs text-on-surface-variant font-medium">August 2026 Cycle</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-outline-variant/30 text-on-surface-variant uppercase text-[10px] font-bold">
              <tr>
                <th className="py-2.5 px-3">Expense Category</th>
                <th className="py-2.5 px-3">Actual Spend</th>
                <th className="py-2.5 px-3">Budget Allocated</th>
                <th className="py-2.5 px-3">Variance (%)</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">AI Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {categoryVariance.map((row, idx) => (
                <tr key={idx} className="hover:bg-surface-container-low dark:hover:bg-slate-800/60 transition-colors">
                  <td className="py-3 px-3 font-semibold text-on-surface dark:text-white">{row.name}</td>
                  <td className="py-3 px-3 font-bold">₹{row.actual.toLocaleString()}</td>
                  <td className="py-3 px-3 text-on-surface-variant">₹{row.budgeted.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <span className={`font-bold ${row.isWarning ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {row.variance}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      row.isWarning 
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' 
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-on-surface-variant">
                    {row.isWarning ? (
                      <NavLink to="/ai-insights" className="text-primary font-semibold hover:underline">
                        Apply VRA Protocol →
                      </NavLink>
                    ) : (
                      <span className="text-emerald-600 font-semibold">Optimal</span>
                    )}
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
