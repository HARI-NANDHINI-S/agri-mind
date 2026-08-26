import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  BrainCircuit,
  Bot,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Droplets,
  Sun,
  Wind,
  Layers,
  ArrowRight,
  PlusCircle,
  BarChart3,
  DollarSign,
  CheckCircle2,
  Calendar,
  Activity,
  ArrowUpRight,
  Sprout
} from 'lucide-react';

export default function AgriMindIntelligence() {
  const { activeFarm, unreadCount } = useApp();
  const navigate = useNavigate();

  const metrics = [
    {
      title: 'NDVI Vegetation Index',
      value: '0.78',
      status: 'Optimal Health',
      change: '+4.2% vs last week',
      isPositive: true,
      icon: Sprout,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/50'
    },
    {
      title: 'Soil Moisture (0-30cm)',
      value: '28.4%',
      status: 'Adequate Moisture',
      change: 'Rain forecast in 48h',
      isPositive: true,
      icon: Droplets,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/50'
    },
    {
      title: 'Yield Forecast (Wheat)',
      value: '22.8 qtl/ac',
      status: '94% ML Confidence',
      change: '+1.4 qtl above regional avg',
      isPositive: true,
      icon: BrainCircuit,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/50'
    },
    {
      title: 'Est. Net Margin / Acre',
      value: '₹34,200',
      status: 'Positive ROI (38%)',
      change: 'Indore Mandi at ₹2,640',
      isPositive: true,
      icon: DollarSign,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="rounded-2xl bg-gradient-to-r from-primary via-emerald-800 to-primary-container p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-8">
          <BrainCircuit className="w-64 h-64 text-white" />
        </div>
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
            <span>AgriMind Precision AI • Active Monitoring</span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Intelligence Overview: {activeFarm.name}
          </h1>

          <p className="text-white/80 text-sm leading-relaxed">
            Multi-spectral satellite telemetry, soil IoT sensors, and mandi market predictive models are synchronizing in real-time for <strong className="text-white">{activeFarm.currentField}</strong>.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <NavLink
              to="/ai-chat"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-primary font-semibold text-xs hover:bg-white/90 shadow-md transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>Ask AI Agronomist</span>
            </NavLink>

            <NavLink
              to="/ai-insights"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold text-xs transition-all border border-white/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>View Deep Insights</span>
            </NavLink>

            <NavLink
              to="/alerts-detail/rust-field-4b"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/80 hover:bg-rose-500 text-white font-semibold text-xs transition-all shadow-md"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Active Alert (Yellow Rust)</span>
            </NavLink>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-on-surface-variant dark:text-slate-400">{m.title}</span>
                <div className={`p-2 rounded-xl ${m.bg}`}>
                  <Icon className={`w-4 h-4 ${m.color}`} />
                </div>
              </div>

              <div>
                <div className="text-2xl font-bold tracking-tight text-on-surface dark:text-white mb-1">
                  {m.value}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-primary dark:text-emerald-400">{m.status}</span>
                  <span className="text-on-surface-variant dark:text-slate-400 text-[11px]">{m.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Satellite & Field Health Breakdown */}
        <div className="lg:col-span-8 space-y-6">
          {/* Field Health & Satellite Telemetry Card */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-outline-variant/30">
              <div>
                <h2 className="text-base font-bold text-on-surface dark:text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" />
                  <span>Field Telemetry & Micro-Climate Matrix</span>
                </h2>
                <p className="text-xs text-on-surface-variant dark:text-slate-400">
                  Sentinel-2 multi-spectral overlay and on-ground weather station telemetry.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <NavLink
                  to="/risk-assessment"
                  className="text-xs font-semibold text-primary dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>Risk Diagnostic</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </NavLink>
              </div>
            </div>

            {/* Visual Heatmap / Field Zone Simulation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <div className="flex justify-between items-center text-xs text-emerald-800 dark:text-emerald-300 font-semibold mb-1">
                  <span>Sector 4A (High Canopy)</span>
                  <span className="text-[10px] bg-emerald-200 dark:bg-emerald-800 px-1.5 py-0.5 rounded">NDVI 0.84</span>
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">Nitrogen balance optimal. Photosynthetic vigor at peak.</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                <div className="flex justify-between items-center text-xs text-amber-800 dark:text-amber-300 font-semibold mb-1">
                  <span>Sector 4B (North Ridge)</span>
                  <span className="text-[10px] bg-amber-200 dark:bg-amber-800 px-1.5 py-0.5 rounded">NDVI 0.69</span>
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-400">Early rust warning spore index. Scheduled spray needed.</p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                <div className="flex justify-between items-center text-xs text-blue-800 dark:text-blue-300 font-semibold mb-1">
                  <span>Sector 4C (Lowland)</span>
                  <span className="text-[10px] bg-blue-200 dark:bg-blue-800 px-1.5 py-0.5 rounded">NDVI 0.79</span>
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-400">High soil moisture retention. Good root profile.</p>
              </div>
            </div>

            {/* Weather & Micro-climate widgets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-surface-container-low dark:bg-slate-800/60">
              <div className="flex items-center gap-3">
                <Sun className="w-6 h-6 text-amber-500 shrink-0" />
                <div>
                  <p className="text-[11px] text-on-surface-variant dark:text-slate-400">Temperature</p>
                  <p className="text-sm font-bold text-on-surface dark:text-white">29.4°C</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Droplets className="w-6 h-6 text-blue-500 shrink-0" />
                <div>
                  <p className="text-[11px] text-on-surface-variant dark:text-slate-400">Relative Humidity</p>
                  <p className="text-sm font-bold text-on-surface dark:text-white">76%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Wind className="w-6 h-6 text-teal-500 shrink-0" />
                <div>
                  <p className="text-[11px] text-on-surface-variant dark:text-slate-400">Wind Speed</p>
                  <p className="text-sm font-bold text-on-surface dark:text-white">12 km/h WNW</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Activity className="w-6 h-6 text-emerald-500 shrink-0" />
                <div>
                  <p className="text-[11px] text-on-surface-variant dark:text-slate-400">Rain Prob.</p>
                  <p className="text-sm font-bold text-on-surface dark:text-white">65% (Weekend)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Connectivity Navigation Hub */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <NavLink
              to="/market"
              className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 hover:border-primary transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-sm font-bold text-on-surface dark:text-white mb-1">Mandi Market Hub</h3>
              <p className="text-xs text-on-surface-variant dark:text-slate-400">
                Track live commodity prices, spot rates, and 30-day forecast curves.
              </p>
            </NavLink>

            <NavLink
              to="/profitability"
              className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 hover:border-primary transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-sm font-bold text-on-surface dark:text-white mb-1">Profitability & ROI</h3>
              <p className="text-xs text-on-surface-variant dark:text-slate-400">
                Gross margin per acre, crop revenue vs operational expenses.
              </p>
            </NavLink>

            <NavLink
              to="/expenses"
              className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 hover:border-primary transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-sm font-bold text-on-surface dark:text-white mb-1">Expense Manager</h3>
              <p className="text-xs text-on-surface-variant dark:text-slate-400">
                Log invoices, view breakdown by fertilizer, seeds, fuel & labor.
              </p>
            </NavLink>
          </div>
        </div>

        {/* Right Column: AI Actionable Feed & Quick Alerts */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Recommended Protocols */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <h3 className="text-sm font-bold text-on-surface dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>AI Action Checklist</span>
              </h3>
              <NavLink to="/ai-insights" className="text-xs font-semibold text-primary hover:underline">
                All (4)
              </NavLink>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-surface-container-low dark:bg-slate-800/60 border border-outline-variant/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400">High Urgency</span>
                  <span className="text-[10px] text-on-surface-variant">Due in 48h</span>
                </div>
                <p className="text-xs font-medium text-on-surface dark:text-white">
                  Spray Propiconazole (1ml/L) in Sector 4B to halt Yellow Rust spore germination.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <NavLink
                    to="/alerts-detail/rust-field-4b"
                    className="text-[11px] font-semibold text-primary dark:text-emerald-400 hover:underline"
                  >
                    View Protocol →
                  </NavLink>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low dark:bg-slate-800/60 border border-outline-variant/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Fertigation</span>
                  <span className="text-[10px] text-on-surface-variant">Saturday</span>
                </div>
                <p className="text-xs font-medium text-on-surface dark:text-white">
                  Apply Urea (45kg/ac) top dressing prior to Sunday 18mm rain event.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <NavLink
                    to="/expenses-add"
                    className="text-[11px] font-semibold text-primary dark:text-emerald-400 hover:underline"
                  >
                    Log Purchase →
                  </NavLink>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low dark:bg-slate-800/60 border border-outline-variant/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Market Opportunity</span>
                  <span className="text-[10px] text-on-surface-variant">Active</span>
                </div>
                <p className="text-xs font-medium text-on-surface dark:text-white">
                  Indore wheat futures up +4.8%. Model suggests selling 40 tonnes by Aug 22.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <NavLink
                    to="/price-prediction"
                    className="text-[11px] font-semibold text-primary dark:text-emerald-400 hover:underline"
                  >
                    Check Prediction Curve →
                  </NavLink>
                </div>
              </div>
            </div>
          </div>

          {/* Quick AI Prompt Trigger */}
          <div className="p-5 rounded-2xl bg-primary/5 dark:bg-emerald-950/40 border border-primary/20 space-y-3">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary dark:text-emerald-400" />
              <h4 className="text-xs font-bold text-primary dark:text-emerald-300 uppercase tracking-wider">
                Agronomist Quick Query
              </h4>
            </div>
            <p className="text-xs text-on-surface-variant dark:text-slate-300">
              Need immediate diagnosis on leaf spots or fertilizer calibration?
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask about crops, soil, chemicals..."
                className="w-full text-xs px-3 py-2 rounded-xl bg-surface dark:bg-slate-900 border border-outline-variant/50 text-on-surface dark:text-white focus:outline-none focus:border-primary"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    navigate('/ai-chat', { state: { initialPrompt: e.target.value } });
                  }
                }}
              />
              <NavLink
                to="/ai-chat"
                className="px-3 py-2 rounded-xl bg-primary text-white text-xs font-semibold shrink-0 hover:bg-primary-hover transition-colors"
              >
                Ask
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
