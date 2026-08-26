import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Sparkles,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Bot,
  PlusCircle,
  Download,
  Share2,
  Layers,
  Calendar,
  DollarSign
} from 'lucide-react';

export default function AiAnalysisInsight() {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [selectedCostCategory, setSelectedCostCategory] = useState(null);

  const costComparison = [
    { name: 'Fertilizer', current: 42, previous: 30, unit: '$k', variance: '+40%' },
    { name: 'Labor', current: 27, previous: 20, unit: '$k', variance: '+35%' },
    { name: 'Water / Drip', current: 22, previous: 10, unit: '$k', variance: '+120%' },
    { name: 'Equipment', current: 16, previous: 15, unit: '$k', variance: '+6.6%' },
  ];

  const handleExport = () => {
    showToast('Exporting AI Insight diagnostic report as PDF...', 'info');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header with Back button and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full hover:bg-surface-container dark:hover:bg-slate-800 flex items-center justify-center text-on-surface-variant transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-primary uppercase tracking-widest">
                AI Assistant Insight
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold">
                High Priority
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-on-surface dark:text-white">
              Farm Performance & Input Cost Diagnostic
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container dark:bg-slate-800 hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
          <NavLink
            to="/ai-chat"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm transition-all"
          >
            <Bot className="w-4 h-4" />
            <span>Discuss with AI</span>
          </NavLink>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Executive Summary & Cost Comparison Chart */}
        <div className="lg:col-span-8 space-y-6">
          {/* Executive Summary Card */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-outline-variant/30">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-on-surface dark:text-white">Executive Summary</h2>
            </div>
            <p className="text-sm text-on-surface-variant dark:text-slate-300 leading-relaxed">
              Based on the multi-spectral telemetry from Sector 4 and 7, overall vegetative health is trending positively (NDVI 0.78). However, input costs have risen by <strong>24.6%</strong> compared to the previous season, primarily driven by fertilizer applications and supplementary irrigation during the early dry spell. Yield predictions remain stable at <strong>22.8 qtl/acre</strong>, confirming the interventions protected the crop, but cost-efficiency metrics require optimization heading into harvest.
            </p>
          </div>

          {/* Interactive Cost Comparison Bar Chart */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-secondary dark:text-emerald-400" />
                <h2 className="text-base font-bold text-on-surface dark:text-white">
                  Cost Comparison: Current vs Previous Season
                </h2>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-primary"></div>
                  <span className="text-on-surface-variant">Current Season</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-slate-300 dark:bg-slate-600"></div>
                  <span className="text-on-surface-variant">Previous Season</span>
                </div>
              </div>
            </div>

            {/* Simulated interactive bar chart */}
            <div className="bg-surface-container-low dark:bg-slate-800/60 rounded-xl p-6 relative min-h-[300px] flex items-end justify-around gap-4 pb-8">
              {/* Y Axis markings */}
              <div className="absolute left-3 top-4 bottom-8 flex flex-col justify-between text-right text-[11px] font-mono text-on-surface-variant pr-2 pointer-events-none">
                <span>$50k</span>
                <span>$40k</span>
                <span>$30k</span>
                <span>$20k</span>
                <span>$10k</span>
                <span>$0</span>
              </div>

              {/* Grid lines */}
              <div className="absolute left-14 right-4 top-4 bottom-8 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-t border-current w-full"></div>
                <div className="border-t border-current w-full"></div>
                <div className="border-t border-current w-full"></div>
                <div className="border-t border-current w-full"></div>
                <div className="border-t border-current w-full"></div>
              </div>

              {/* Bars */}
              {costComparison.map((cat, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedCostCategory(cat)}
                  className="z-10 flex flex-col items-center gap-2 group cursor-pointer w-20 pl-8"
                >
                  <div className="flex items-end gap-1.5 w-full h-[200px]">
                    {/* Prev season bar */}
                    <div 
                      style={{ height: `${(cat.previous / 50) * 100}%` }}
                      className="w-1/2 bg-slate-300 dark:bg-slate-600 rounded-t-md group-hover:opacity-80 transition-all"
                      title={`Previous: $${cat.previous}k`}
                    />
                    {/* Current season bar */}
                    <div 
                      style={{ height: `${(cat.current / 50) * 100}%` }}
                      className="w-1/2 bg-primary rounded-t-md group-hover:bg-primary-hover transition-all relative"
                      title={`Current: $${cat.current}k (${cat.variance})`}
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded hidden group-hover:block whitespace-nowrap shadow-md">
                        ${cat.current}k
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-on-surface dark:text-slate-300">{cat.name}</span>
                  <span className="text-[10px] text-rose-500 font-bold">{cat.variance}</span>
                </div>
              ))}
            </div>

            {selectedCostCategory && (
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between text-xs text-primary dark:text-emerald-300">
                <span>Selected: <strong>{selectedCostCategory.name}</strong> (Current: ${selectedCostCategory.current}k vs Prev: ${selectedCostCategory.previous}k)</span>
                <NavLink to="/expenses-analytics" className="font-semibold underline">
                  View Analytics →
                </NavLink>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recommendations & Action Checklist */}
        <div className="lg:col-span-4 space-y-6">
          {/* Actionable Recommendation Card */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-amber-300 dark:border-amber-700/60 shadow-sm relative overflow-hidden space-y-4">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500"></div>

            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="text-sm font-bold text-on-surface dark:text-white">
                Actionable Optimization
              </h2>
            </div>

            <p className="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed">
              Fertilizer application costs have exceeded the projected baseline by <strong>18%</strong>. It is highly recommended to transition to Variable-Rate Application (VRA) for Sector 7 to optimize nitrogen distribution according to soil organic matter sensors.
            </p>

            <div className="pt-2 border-t border-outline-variant/30 space-y-2">
              <NavLink
                to="/expenses-add"
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Log VRA Calibrated Expense</span>
              </NavLink>

              <NavLink
                to="/crop-profitability"
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-surface-container dark:bg-slate-800 text-xs font-semibold text-on-surface dark:text-slate-200 hover:bg-surface-container-high transition-colors"
              >
                <span>Compare Crop Margins</span>
              </NavLink>
            </div>
          </div>

          {/* Key Observations */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Telemetry Key Observations
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-on-surface dark:text-white">NDVI Uniformity:</span>
                  <p className="text-on-surface-variant dark:text-slate-400">Canopy index is 8% above 3-year historical average.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-on-surface dark:text-white">Rainfall Timing:</span>
                  <p className="text-on-surface-variant dark:text-slate-400">Predicted weekend showers will save 12,000L irrigation fuel.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-on-surface dark:text-white">Spore Moisture Threshold:</span>
                  <p className="text-on-surface-variant dark:text-slate-400">Relative humidity above 75% requires fungicide prophylaxis.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
