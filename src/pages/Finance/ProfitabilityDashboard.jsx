import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  TrendingUp,
  Sprout,
  ShieldCheck,
  Download,
  Calendar,
  Layers,
  ArrowRight,
  PlusCircle,
  AlertTriangle,
  Droplets,
  CheckCircle2,
  PieChart
} from 'lucide-react';

export default function ProfitabilityDashboard() {
  const { showToast, activeFarm } = useApp();
  const navigate = useNavigate();

  const performingFields = [
    { field: 'North 40 - Sector 4A', crop: 'Sharbati Wheat', yieldVal: '24.2 qtl/ac', profitMargin: '42.4%', status: 'Optimal', isPositive: true },
    { field: 'South Ridge - Sector 2A', crop: 'Hybrid Maize', yieldVal: '32.0 qtl/ac', profitMargin: '38.1%', status: 'High Yield', isPositive: true },
    { field: 'Valley Basin - Sector 3A', crop: 'Yellow Soybean', yieldVal: '16.5 qtl/ac', profitMargin: '35.6%', status: 'Stable', isPositive: true },
    { field: 'East Plot - Sector 1C', crop: 'Chickpea (Desi)', yieldVal: '14.0 qtl/ac', profitMargin: '28.2%', status: 'Moderate', isPositive: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
            <span>Farm Economics & Gross Margins</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-on-surface-variant font-normal">Season: 2026</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface dark:text-white">
            Farm Profitability & ROI Analysis
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast('Exporting Profitability Statement...', 'info')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container dark:bg-slate-800 hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Statement</span>
          </button>
          <NavLink
            to="/crop-profitability"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm transition-all"
          >
            <Sprout className="w-4 h-4" />
            <span>Compare Crops</span>
          </NavLink>
        </div>
      </div>

      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Expected Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-on-surface dark:text-white">₹64.8 Lakh</div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+8.4% vs last harvest</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Operating Input Cost</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-on-surface dark:text-white">₹42.2 Lakh</div>
          <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+2.1% (Controlled burn)</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Net Profit Margin</span>
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <PieChart className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-primary dark:text-emerald-400">34.8%</div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+2.4% margin expansion</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Crop Profitability & Risk Score */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: High Performing Fields */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
            <div>
              <h2 className="text-base font-bold text-on-surface dark:text-white">Field-by-Field Economic Performance</h2>
              <p className="text-xs text-on-surface-variant">Estimated net margin per acre by sector</p>
            </div>
            <NavLink to="/crop-profitability" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              <span>Compare All Crops</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-outline-variant/30 text-on-surface-variant uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-2.5 px-3">Field Name</th>
                  <th className="py-2.5 px-3">Crop Variety</th>
                  <th className="py-2.5 px-3">Est. Yield</th>
                  <th className="py-2.5 px-3">Net Margin</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {performingFields.map((f, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-low dark:hover:bg-slate-800/60 transition-colors">
                    <td className="py-3 px-3 font-semibold text-on-surface dark:text-white">{f.field}</td>
                    <td className="py-3 px-3 text-on-surface-variant">{f.crop}</td>
                    <td className="py-3 px-3 font-bold">{f.yieldVal}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary dark:text-emerald-400">{f.profitMargin}</span>
                        <div className="w-16 bg-surface-container-high dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: f.profitMargin }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {f.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 4 Cols: Risk Assessment Widget */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
            <h3 className="text-sm font-bold text-on-surface dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Risk & Volatility Index</span>
            </h3>
            <NavLink to="/risk-assessment" className="text-xs font-semibold text-primary hover:underline">
              Details →
            </NavLink>
          </div>

          <div className="flex flex-col items-center justify-center py-4 border-b border-outline-variant/20">
            <div className="w-24 h-24 rounded-full border-4 border-emerald-500 flex flex-col items-center justify-center bg-emerald-50 dark:bg-emerald-950/40">
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Low</span>
              <span className="text-[10px] text-on-surface-variant">Risk Level</span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant">Weather Volatility:</span>
              <span className="text-xs font-bold text-amber-600 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950">Medium</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant">Water Supply:</span>
              <span className="text-xs font-bold text-emerald-600 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950">Low Risk</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant">Pest / Yellow Rust:</span>
              <span className="text-xs font-bold text-rose-600 px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950">Active Watch</span>
            </div>
          </div>

          <NavLink
            to="/alerts-detail/rust-field-4b"
            className="block text-center text-xs font-semibold py-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-all"
          >
            Mitigate Active Rust Alert →
          </NavLink>
        </div>
      </div>
    </div>
  );
}
