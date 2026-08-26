import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sprout,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  PlusCircle,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function CropProfitabilityComparison() {
  const navigate = useNavigate();

  const crops = [
    {
      name: 'Sharbati Wheat',
      field: 'Field 4B & 4A (45 Acres)',
      profitPerAcre: '₹90,000',
      breakeven: '₹2,100 / qtl',
      yieldEst: '22 qtl / ac',
      risk: 'Low Risk',
      riskColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      insight: 'Stable domestic demand. Soil moisture in Field 4A is optimal for early tillering, increasing projected harvest yield.',
      mandiRate: '₹2,640',
      linkForecast: '/price-prediction'
    },
    {
      name: 'Hybrid Sweet Corn / Maize',
      field: 'Field 2A (30 Acres)',
      profitPerAcre: '₹1,15,000',
      breakeven: '₹1,850 / qtl',
      yieldEst: '30 qtl / ac',
      risk: 'Medium Risk',
      riskColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      insight: 'Higher potential gross margin but requires precise irrigation timing during pollination. Staggered fertigation advised.',
      mandiRate: '₹2,180',
      linkForecast: '/price-prediction'
    },
    {
      name: 'Yellow Soybean',
      field: 'Field 3A (50 Acres)',
      profitPerAcre: '₹82,000',
      breakeven: '₹4,100 / qtl',
      yieldEst: '16.5 qtl / ac',
      risk: 'Low Risk',
      riskColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      insight: 'Strong crushing demand in regional solvent extraction plants. Lower chemical input costs due to natural nitrogen fixation.',
      mandiRate: '₹4,890',
      linkForecast: '/price-prediction'
    },
    {
      name: 'Basmati Paddy 1121',
      field: 'Plot 7 (60 Acres)',
      profitPerAcre: '₹1,05,000',
      breakeven: '₹3,200 / qtl',
      yieldEst: '25 qtl / ac',
      risk: 'Medium Risk',
      riskColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      insight: 'High export realization. Requires continuous standing water monitoring to prevent stem borer pest infestation.',
      mandiRate: '₹3,750',
      linkForecast: '/price-prediction'
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
              Comparative Agronomy Economics
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-on-surface dark:text-white">
              Crop Profitability & Margin Comparison
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NavLink
            to="/profitability"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container dark:bg-slate-800 hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
          >
            <span>Overview Dashboard</span>
          </NavLink>
          <NavLink
            to="/expenses-add"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Log Crop Expense</span>
          </NavLink>
        </div>
      </div>

      {/* Grid of Crop Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {crops.map((crop, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm hover:border-primary transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-on-surface dark:text-white">{crop.name}</h3>
                    <p className="text-xs text-on-surface-variant">{crop.field}</p>
                  </div>
                </div>

                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${crop.riskColor}`}>
                  {crop.risk}
                </span>
              </div>

              {/* Profit metrics */}
              <div className="py-4 space-y-1">
                <span className="text-xs text-on-surface-variant">Expected Net Profit / Acre</span>
                <div className="text-3xl font-bold text-primary dark:text-emerald-400">
                  {crop.profitPerAcre}
                </div>
              </div>

              {/* Data grid */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-surface-container-low dark:bg-slate-800/60 text-xs">
                <div>
                  <span className="text-[10px] text-on-surface-variant block">Break-even</span>
                  <strong className="text-on-surface dark:text-white">{crop.breakeven}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-on-surface-variant block">Est. Yield</span>
                  <strong className="text-on-surface dark:text-white">{crop.yieldEst}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-on-surface-variant block">Spot Mandi</span>
                  <strong className="text-emerald-600 dark:text-emerald-400">{crop.mandiRate}</strong>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-surface dark:bg-slate-800/40 border border-outline-variant/30 flex items-start gap-2 text-xs">
                <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-on-surface-variant dark:text-slate-300 leading-relaxed">{crop.insight}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between">
              <NavLink
                to="/price-prediction"
                className="text-xs font-semibold text-primary dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>View 30-Day Price Curve</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </NavLink>
              <NavLink
                to="/expenses-add"
                className="px-3 py-1.5 rounded-lg bg-surface-container dark:bg-slate-800 text-xs font-semibold text-on-surface hover:bg-surface-container-high transition-colors"
              >
                Log Cost
              </NavLink>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
