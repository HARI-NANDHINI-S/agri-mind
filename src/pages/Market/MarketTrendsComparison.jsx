import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  Filter,
  CheckCircle2
} from 'lucide-react';

export default function MarketTrendsComparison() {
  const navigate = useNavigate();
  const [activeRange, setActiveRange] = useState('6M');
  const [selectedMandi, setSelectedMandi] = useState(['Indore', 'Ujjain', 'Bhopal']);

  const mandis = [
    { name: 'Indore Mandi', color: 'bg-emerald-500', hex: '#10B981', current: '₹2,640', trend: '+14.2% 6mo' },
    { name: 'Ujjain Mandi', color: 'bg-blue-500', hex: '#3B82F6', current: '₹2,590', trend: '+11.8% 6mo' },
    { name: 'Bhopal Mandi', color: 'bg-amber-500', hex: '#F59E0B', current: '₹2,510', trend: '+9.4% 6mo' },
    { name: 'Kota Grain Terminal', color: 'bg-purple-500', hex: '#8B5CF6', current: '₹2,615', trend: '+13.1% 6mo' },
  ];

  const monthLabels = ['Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026 (Now)'];

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
              Comparative Price Analytics
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-on-surface dark:text-white">
              Multi-Mandi Price Trends Overlay
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface-container-low dark:bg-slate-800 p-1 rounded-xl border border-outline-variant/40">
            {['1M', '3M', '6M', '1Y'].map((range) => (
              <button
                key={range}
                onClick={() => setActiveRange(range)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  activeRange === range
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <NavLink
            to="/price-prediction"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI 90-Day Forecast</span>
          </NavLink>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
          <div>
            <h2 className="text-base font-bold text-on-surface dark:text-white">
              Sharbati Wheat Price Trajectory (₹ / Quintal)
            </h2>
            <p className="text-xs text-on-surface-variant">Comparative price convergence across regional trade hubs</p>
          </div>

          {/* Mandi Legend Filter Chips */}
          <div className="flex flex-wrap gap-2">
            {mandis.map((m) => (
              <div
                key={m.name}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/30 text-xs font-medium text-on-surface dark:text-slate-200"
              >
                <div className={`w-2.5 h-2.5 rounded-full ${m.color}`}></div>
                <span>{m.name}</span>
                <span className="font-bold ml-1">{m.current}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SVG Multi-Line Chart Canvas */}
        <div className="w-full bg-surface-container-low/50 dark:bg-slate-800/40 rounded-xl p-6 relative">
          <div className="h-64 w-full relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="border-b border-current w-full flex justify-end text-[10px] pr-2">₹2,800</div>
              <div className="border-b border-current w-full flex justify-end text-[10px] pr-2">₹2,600</div>
              <div className="border-b border-current w-full flex justify-end text-[10px] pr-2">₹2,400</div>
              <div className="border-b border-current w-full flex justify-end text-[10px] pr-2">₹2,200</div>
              <div className="border-b border-current w-full flex justify-end text-[10px] pr-2">₹2,000</div>
            </div>

            {/* SVG Visual Curves */}
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 200">
              {/* Indore Curve (Green) */}
              <polyline
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
                points="0,150 100,140 200,110 300,90 400,60 500,30"
              />
              {/* Ujjain Curve (Blue) */}
              <polyline
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2.5"
                strokeDasharray="4 2"
                points="0,165 100,150 200,125 300,105 400,80 500,50"
              />
              {/* Bhopal Curve (Amber) */}
              <polyline
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2.5"
                points="0,175 100,160 200,145 300,130 400,110 500,85"
              />
            </svg>
          </div>

          {/* Month labels along X Axis */}
          <div className="flex justify-between text-xs text-on-surface-variant pt-3 border-t border-outline-variant/30 font-medium">
            {monthLabels.map((m, idx) => (
              <span key={idx}>{m}</span>
            ))}
          </div>
        </div>

        {/* Key Arbitrage & Spread Insights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-surface-container-low dark:bg-slate-800/60 border border-outline-variant/30">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase">Highest Arbitrage Spread</span>
            <div className="text-lg font-bold text-on-surface dark:text-white mt-1">₹130 / qtl</div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">Indore Mandi vs Bhopal Mandi</p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low dark:bg-slate-800/60 border border-outline-variant/30">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase">Transport Cost Buffer</span>
            <div className="text-lg font-bold text-on-surface dark:text-white mt-1">₹42 / qtl</div>
            <p className="text-xs text-on-surface-variant mt-0.5">Truck freight 45 MT capacity (60km radius)</p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low dark:bg-slate-800/60 border border-outline-variant/30">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase">Net Arbitrage Profit</span>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">+₹88 / qtl</div>
            <p className="text-xs text-on-surface-variant mt-0.5">Net benefit after logistics deduction</p>
          </div>
        </div>
      </div>
    </div>
  );
}
