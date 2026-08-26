import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Layers,
  Cpu,
  TrendingUp,
  CheckCircle2,
  Sliders,
  Sparkles,
  BarChart3,
  Download,
  Bot
} from 'lucide-react';

export default function PredictionDetails() {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [monsoonAdjustment, setMonsoonAdjustment] = useState(0);

  const featureWeights = [
    { feature: 'Global Export Demand & Tariff Policies', weight: 34, impact: 'Positive (+₹120)', description: 'Government open-quota for wheat flour & geopolitical grain deficits.' },
    { feature: 'Monsoon Withdrawal Radar Index', weight: 28, impact: 'Positive (+₹85)', description: 'Late dry spells in central belts increasing localized spot demand.' },
    { feature: 'Mandi Arrival Volume Momentum', weight: 22, impact: 'Neutral (0)', description: 'Supply arrivals in Indore running 4% below 5-year rolling average.' },
    { feature: 'Govt MSP Baseline Spread', weight: 16, impact: 'Positive (+₹45)', description: 'Spot market trading at healthy premium over statutory support floor.' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
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
              Model Explainability & Weights
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-on-surface dark:text-white">
              Wheat Price Prediction Details (LSTM v3.4)
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NavLink
            to="/models"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container dark:bg-slate-800 hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
          >
            <Cpu className="w-4 h-4 text-primary" />
            <span>Model Pipeline</span>
          </NavLink>
          <NavLink
            to="/ai-chat"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm transition-all"
          >
            <Bot className="w-4 h-4" />
            <span>Consult Copilot</span>
          </NavLink>
        </div>
      </div>

      {/* Model Performance Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-on-surface-variant uppercase">Model Architecture</span>
          <div className="text-lg font-bold text-on-surface dark:text-white mt-1">Multi-Head Bi-LSTM</div>
          <p className="text-xs text-primary dark:text-emerald-400 mt-1">With Attention Mechanism</p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-on-surface-variant uppercase">Backtested Accuracy</span>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">94.2% (R² = 0.94)</div>
          <p className="text-xs text-on-surface-variant mt-1">Mean Absolute Error: ±₹18.40/qtl</p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-on-surface-variant uppercase">Training Dataset</span>
          <div className="text-lg font-bold text-on-surface dark:text-white mt-1">12 Years (2014-2026)</div>
          <p className="text-xs text-on-surface-variant mt-1">42 National Mandi feeds synced</p>
        </div>
      </div>

      {/* Feature Importance Section */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm space-y-6">
        <div className="pb-4 border-b border-outline-variant/30">
          <h2 className="text-base font-bold text-on-surface dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            <span>Feature Importance & Causal Factors</span>
          </h2>
          <p className="text-xs text-on-surface-variant">
            Relative contribution of macro-economic, meteorological, and supply variables to the predicted ₹2,820/qtl peak.
          </p>
        </div>

        <div className="space-y-4">
          {featureWeights.map((fw, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-surface-container-low dark:bg-slate-800/60 border border-outline-variant/30 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <span className="font-bold text-on-surface dark:text-white text-sm">{fw.feature}</span>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-primary dark:text-emerald-400">{fw.impact}</span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-container-high dark:bg-slate-700 font-bold">
                    {fw.weight}% Weight
                  </span>
                </div>
              </div>

              <div className="w-full bg-surface-container-high dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: `${fw.weight}%` }}></div>
              </div>

              <p className="text-xs text-on-surface-variant dark:text-slate-400">{fw.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Scenario Simulation */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-surface-container to-surface-container-low dark:from-emerald-950/40 dark:to-slate-900 border border-primary/20 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-bold text-on-surface dark:text-white">
            What-If Scenario Simulation
          </h3>
        </div>

        <p className="text-xs text-on-surface-variant">
          Adjust rainfall variance to see calibrated model price adjustment in real-time.
        </p>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span>Rainfall Deficit / Surplus:</span>
            <span className="text-primary font-bold">{monsoonAdjustment > 0 ? `+${monsoonAdjustment}%` : `${monsoonAdjustment}%`}</span>
          </div>
          <input
            type="range"
            min="-30"
            max="30"
            value={monsoonAdjustment}
            onChange={(e) => setMonsoonAdjustment(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div className="p-3.5 rounded-xl bg-surface dark:bg-slate-800 border border-outline-variant/40 flex items-center justify-between text-xs">
          <span>Simulated Calibrated Price Target:</span>
          <span className="font-bold text-base text-primary dark:text-emerald-400">
            ₹{(2820 + monsoonAdjustment * 4.2).toFixed(0)} / qtl
          </span>
        </div>
      </div>
    </div>
  );
}
