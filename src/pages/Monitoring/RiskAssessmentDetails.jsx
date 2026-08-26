import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  ShieldAlert,
  AlertTriangle,
  Droplets,
  Sun,
  TrendingDown,
  Sparkles,
  Bot,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function RiskAssessmentDetails() {
  const navigate = useNavigate();
  const { activeFarm } = useApp();

  const riskCategories = [
    {
      category: 'Biological & Pest Outbreak',
      level: 'High Risk (Score: 78/100)',
      color: 'bg-rose-500',
      badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
      description: 'Yellow Rust spore concentration elevated due to 76% relative humidity and optimal 22°C canopy micro-climate.',
      action: 'Execute preventive Propiconazole spray on Field 4B before Saturday rain event.',
      link: '/alerts-detail/rust-field-4b'
    },
    {
      category: 'Meteorological & Rainfall Volatility',
      level: 'Moderate Risk (Score: 45/100)',
      color: 'bg-amber-500',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      description: 'Radar indicates 18-22mm scattered precipitation over weekend. Low flood risk, high soil enrichment opportunity.',
      action: 'Schedule fertilizer top dressing 24 hours prior to maximize soil assimilation.',
      link: '/ai-insights'
    },
    {
      category: 'Market Price Volatility',
      level: 'Low Risk (Score: 24/100)',
      color: 'bg-emerald-500',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      description: 'Indore Mandi wheat prices trending strong (+4.8%). High demand from processing units and flour mills.',
      action: 'Hold surplus inventory to capture projected ₹2,820/qtl peak in late August.',
      link: '/price-prediction'
    },
    {
      category: 'Irrigation & Groundwater Depletion',
      level: 'Low Risk (Score: 18/100)',
      color: 'bg-emerald-500',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      description: 'Drip lines operating at 94% efficiency. Tube-well aquifer levels recharged by early monsoon precipitation.',
      action: 'Standard weekly filter backwash scheduled for Monday.',
      link: '/expenses'
    }
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
              Comprehensive Farm Security
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-on-surface dark:text-white">
              Farm Risk Matrix & Diagnostic
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NavLink
            to="/ai-chat"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm transition-all"
          >
            <Bot className="w-4 h-4" />
            <span>AI Risk Consultation</span>
          </NavLink>
        </div>
      </div>

      {/* Top Composite Score Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
          <div>
            <h2 className="text-lg font-bold text-on-surface dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span>Overall Composite Farm Risk Index: 38/100 (Controlled)</span>
            </h2>
            <p className="text-xs text-on-surface-variant">
              Multi-spectral anomaly detection combined with micro-weather and commodity price curves for {activeFarm.name}.
            </p>
          </div>

          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Operational Stability: High
          </span>
        </div>

        {/* Risk meter bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-on-surface-variant font-semibold">
            <span>0 (Minimal Risk)</span>
            <span>38 (Current)</span>
            <span>100 (Extreme Hazard)</span>
          </div>
          <div className="w-full bg-surface-container-high dark:bg-slate-800 h-3 rounded-full overflow-hidden flex">
            <div className="bg-emerald-500 h-full" style={{ width: '38%' }}></div>
          </div>
        </div>
      </div>

      {/* Risk Category Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {riskCategories.map((rc, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm hover:border-primary transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                <h3 className="font-bold text-base text-on-surface dark:text-white">{rc.category}</h3>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${rc.badgeColor}`}>
                  {rc.level}
                </span>
              </div>

              <p className="text-xs text-on-surface-variant dark:text-slate-300 mt-3 leading-relaxed">
                {rc.description}
              </p>

              <div className="mt-4 p-3 rounded-xl bg-surface-container-low dark:bg-slate-800/60 border border-outline-variant/30 space-y-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">Recommended Mitigation</span>
                <p className="text-xs text-on-surface dark:text-white font-medium">{rc.action}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-outline-variant/30 flex justify-end">
              <NavLink
                to={rc.link}
                className="text-xs font-semibold text-primary dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Action Protocol</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </NavLink>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
