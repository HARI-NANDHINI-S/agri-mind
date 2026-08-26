import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Sparkles,
  ArrowRight,
  Download,
  Calendar,
  Filter,
  Layers,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Sprout
} from 'lucide-react';

export default function PricePredictionDashboard() {
  const { showToast } = useApp();
  const navigate = useNavigate();
  const [activeCommodity, setActiveCommodity] = useState('Wheat');
  const [forecastHorizon, setForecastHorizon] = useState('30D');

  const watchlistPredictions = [
    {
      name: 'Wheat (Sharbati)',
      market: 'Indore Mandi',
      currentPrice: 2640,
      predictedPrice: 2820,
      gain: '+6.8%',
      confidence: '92%',
      trend: 'Bullish',
      horizon: '30 Days',
      drivers: 'Monsoon withdrawal delay + global export demand',
      action: 'Hold 60% surplus'
    },
    {
      name: 'Soybean (Yellow)',
      market: 'Ujjain Mandi',
      currentPrice: 4890,
      predictedPrice: 5250,
      gain: '+7.3%',
      confidence: '88%',
      trend: 'Strong Bullish',
      horizon: '30 Days',
      drivers: 'Crushing mill buying frenzy & high meal export parity',
      action: 'Staggered release'
    },
    {
      name: 'Basmati Paddy 1121',
      market: 'Karnal Mandi',
      currentPrice: 3750,
      predictedPrice: 3900,
      gain: '+4.0%',
      confidence: '95%',
      trend: 'Moderate Bullish',
      horizon: '30 Days',
      drivers: 'Middle-East trade quotas announced',
      action: 'Target sell at ₹3,880'
    },
    {
      name: 'Maize (Feed Grade)',
      market: 'Chhindwara Mandi',
      currentPrice: 2180,
      predictedPrice: 2120,
      gain: '-2.7%',
      confidence: '84%',
      trend: 'Bearish',
      horizon: '30 Days',
      drivers: 'Heavy southern arrivals beginning next week',
      action: 'Liquidate immediate'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
            <span>Machine Learning Price Intelligence</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-on-surface-variant font-normal">LSTM + Multi-Variate Satellite Radar</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface dark:text-white">
            AI Price Predictions & Harvesting Windows
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast('Exporting Price Forecast Dossier...', 'info')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container dark:bg-slate-800 hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Forecast</span>
          </button>
          <NavLink
            to="/prediction-details"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm transition-all"
          >
            <Layers className="w-4 h-4" />
            <span>Model Weights & Details</span>
          </NavLink>
        </div>
      </div>

      {/* Featured Prediction Hero Card */}
      <div className="p-6 lg:p-8 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-primary transition-all">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 dark:bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          {/* Left Hero Core Data */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Sprout className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on-surface dark:text-white">Sharbati Wheat</h3>
                  <p className="text-xs text-on-surface-variant">Indore Spot Market • Grade-A Milling</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> AI Calibrated
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-surface-container-low dark:bg-slate-800/60">
                <span className="text-[11px] text-on-surface-variant font-medium">Spot Price (Today)</span>
                <div className="text-2xl font-bold text-on-surface dark:text-white mt-1">₹2,640</div>
                <span className="text-[10px] text-on-surface-variant">/ quintal</span>
              </div>

              <div className="p-3.5 rounded-xl bg-primary/10 dark:bg-emerald-950/40 border border-primary/20">
                <span className="text-[11px] text-primary dark:text-emerald-300 font-semibold">Predicted Peak (30D)</span>
                <div className="text-2xl font-bold text-primary dark:text-emerald-400 mt-1 flex items-center gap-1">
                  ₹2,820
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-primary text-white ml-1">+6.8%</span>
                </div>
                <span className="text-[10px] text-on-surface-variant">Target Date: Sept 14</span>
              </div>
            </div>

            {/* Confidence Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-on-surface-variant">Confidence Score</span>
                <span className="text-primary dark:text-emerald-400">92% (High Reliability)</span>
              </div>
              <div className="w-full bg-surface-container-high dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <NavLink
                to="/prediction-details"
                className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold text-center hover:bg-primary-hover shadow-sm transition-all"
              >
                Inspect Feature Importance & Accuracy
              </NavLink>
            </div>
          </div>

          {/* Right Hero Visualization */}
          <div className="lg:col-span-7 p-6 rounded-xl bg-surface-container-low dark:bg-slate-800/60 border border-outline-variant/30 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-on-surface dark:text-white uppercase tracking-wider">
                30-Day Historical + Predictive Trajectory
              </h4>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1 text-on-surface-variant">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span> Historical
                </span>
                <span className="flex items-center gap-1 font-semibold text-primary dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> Forecast
                </span>
              </div>
            </div>

            {/* SVG Visual Price Curve */}
            <div className="h-44 w-full relative">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-b border-current w-full flex justify-end text-[10px]">₹2,900</div>
                <div className="border-b border-current w-full flex justify-end text-[10px]">₹2,750</div>
                <div className="border-b border-current w-full flex justify-end text-[10px]">₹2,600</div>
                <div className="border-b border-current w-full flex justify-end text-[10px]">₹2,450</div>
              </div>

              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 120">
                {/* Historical solid */}
                <polyline
                  fill="none"
                  stroke="#94A3B8"
                  strokeWidth="2.5"
                  points="0,85 50,80 100,75 150,78 200,60"
                />
                {/* Forecast dashed */}
                <polyline
                  fill="none"
                  stroke="#0D631B"
                  strokeWidth="3"
                  strokeDasharray="5 3"
                  points="200,60 250,45 300,32 350,22 400,10"
                />
                {/* Current node */}
                <circle cx="200" cy="60" r="5" fill="#0D631B" />
                {/* Peak node */}
                <circle cx="400" cy="10" r="5" fill="#10B981" />
              </svg>
            </div>

            <div className="flex justify-between text-[11px] text-on-surface-variant font-medium pt-2 border-t border-outline-variant/30">
              <span>Aug 1</span>
              <span>Aug 16 (Today)</span>
              <span>Aug 28</span>
              <span>Sept 14 (Target Peak)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Watchlist Predictions Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-on-surface dark:text-white">
            Crop Forecast Portfolio
          </h2>
          <NavLink to="/market-prices" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            <span>View All Mandi Crops</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {watchlistPredictions.map((pred, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm hover:border-primary transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-on-surface dark:text-white truncate">{pred.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    pred.gain.startsWith('+') 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {pred.gain}
                  </span>
                </div>

                <p className="text-[11px] text-on-surface-variant mb-3">{pred.market}</p>

                <div className="space-y-1.5 py-2 border-y border-outline-variant/20 text-xs">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Spot:</span>
                    <span className="font-semibold text-on-surface dark:text-white">₹{pred.currentPrice}/qtl</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Target (30D):</span>
                    <span className="font-bold text-primary dark:text-emerald-400">₹{pred.predictedPrice}/qtl</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-on-surface-variant">Confidence:</span>
                    <span className="font-semibold">{pred.confidence}</span>
                  </div>
                </div>

                <p className="text-[11px] text-on-surface-variant mt-2 leading-relaxed italic">
                  "{pred.drivers}"
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-outline-variant/20 flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">{pred.action}</span>
                <NavLink
                  to="/prediction-details"
                  className="text-xs text-primary font-semibold hover:underline flex items-center gap-0.5"
                >
                  Details →
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
