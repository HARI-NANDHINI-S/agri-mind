import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  TrendingDown,
  Table,
  BarChart3,
  Sparkles,
  ArrowRight,
  Search,
  Filter,
  ArrowUpRight,
  DollarSign,
  Activity,
  Layers,
  MapPin
} from 'lucide-react';

export const commodityList = [
  { id: 1, name: 'Wheat (Sharbati)', mandi: 'Indore Central Mandi', price: 2640, unit: '₹/qtl', change: '+4.8%', isUp: true, volume: '1,450 MT', grade: 'Grade-A' },
  { id: 2, name: 'Soybean (Yellow)', mandi: 'Ujjain Krishi Upaj Mandi', price: 4890, unit: '₹/qtl', change: '+5.8%', isUp: true, volume: '2,800 MT', grade: 'Standard' },
  { id: 3, name: 'Basmati Paddy 1121', mandi: 'Karnal Grain Market', price: 3750, unit: '₹/qtl', change: '+1.2%', isUp: true, volume: '3,200 MT', grade: 'Super' },
  { id: 4, name: 'Maize (Feed Grade)', mandi: 'Chhindwara Mandi', price: 2180, unit: '₹/qtl', change: '-1.4%', isUp: false, volume: '950 MT', grade: 'Grade-B' },
  { id: 5, name: 'Mustard (High Oil)', mandi: 'Jaipur Mandi', price: 5420, unit: '₹/qtl', change: '+2.1%', isUp: true, volume: '1,800 MT', grade: 'Premium' },
  { id: 6, name: 'Gram / Chana (Desi)', mandi: 'Bhopal Mandi', price: 5850, unit: '₹/qtl', change: '-0.8%', isUp: false, volume: '720 MT', grade: 'Standard' },
];

export default function MarketDashboard() {
  const [selectedCrop, setSelectedCrop] = useState('All');
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header with Title & Direct Navigation Links */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
            <span>Market Intelligence Hub</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-on-surface-variant font-normal">Indore & National Mandis</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface dark:text-white">
            Live Mandi Prices & Commodity Trends
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <NavLink
            to="/market-prices"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container dark:bg-slate-800 hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
          >
            <Table className="w-4 h-4 text-primary" />
            <span>Full Price Table</span>
          </NavLink>

          <NavLink
            to="/market-trends"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container dark:bg-slate-800 hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
          >
            <BarChart3 className="w-4 h-4 text-primary" />
            <span>Compare Trends</span>
          </NavLink>

          <NavLink
            to="/price-prediction"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Price AI Forecast</span>
          </NavLink>
        </div>
      </div>

      {/* Top Tickers Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-on-surface-variant mb-2">
            <span className="font-semibold uppercase tracking-wider">Agri-Commodity Index</span>
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-on-surface dark:text-white">2,842.10</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +2.4%
            </span>
          </div>
          <p className="text-[11px] text-on-surface-variant mt-1">Weighted 12-mandi composite index</p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-on-surface-variant mb-2">
            <span className="font-semibold uppercase tracking-wider">Top Gainer Today</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-on-surface dark:text-white">Soybean</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">+5.8%</span>
          </div>
          <p className="text-[11px] text-on-surface-variant mt-1">₹4,890/qtl (Ujjain Mandi)</p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-on-surface-variant mb-2">
            <span className="font-semibold uppercase tracking-wider">Active Farm Crop (Wheat)</span>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-on-surface dark:text-white">₹2,640</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">+4.8%</span>
          </div>
          <p className="text-[11px] text-on-surface-variant mt-1">₹215 above Govt MSP rate</p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-on-surface-variant mb-2">
            <span className="font-semibold uppercase tracking-wider">AI Forecast Signal</span>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-purple-600 dark:text-purple-400">HOLD / STAGGER</span>
          </div>
          <p className="text-[11px] text-on-surface-variant mt-1">Peak predicted in late August (+3.2%)</p>
        </div>
      </div>

      {/* Main Grid: Commodity Prices Table & Prediction Mini-Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Live Mandi Rates */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/30">
            <div>
              <h2 className="text-base font-bold text-on-surface dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Spot Mandi Rates & Inflow Volumes</span>
              </h2>
              <p className="text-xs text-on-surface-variant">Real-time modal trade price updates</p>
            </div>

            <NavLink
              to="/market-prices"
              className="text-xs font-semibold text-primary dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Explore Detailed Table</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-outline-variant/30 text-on-surface-variant uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-2.5 px-3">Commodity</th>
                  <th className="py-2.5 px-3">Mandi Location</th>
                  <th className="py-2.5 px-3">Modal Price</th>
                  <th className="py-2.5 px-3">24h Change</th>
                  <th className="py-2.5 px-3">Volume</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {commodityList.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-low dark:hover:bg-slate-800/60 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-on-surface dark:text-white">{item.name}</div>
                      <span className="text-[10px] text-on-surface-variant">{item.grade}</span>
                    </td>
                    <td className="py-3 px-3 text-on-surface-variant dark:text-slate-300">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-primary shrink-0" />
                        <span>{item.mandi}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-bold text-sm text-on-surface dark:text-white">
                      ₹{item.price.toLocaleString()} <span className="text-[10px] font-normal text-on-surface-variant">/qtl</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center text-xs font-bold ${
                        item.isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {item.isUp ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                        {item.change}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-on-surface-variant">{item.volume}</td>
                    <td className="py-3 px-3 text-right">
                      <NavLink
                        to="/price-prediction"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                      >
                        <span>Forecast</span>
                        <ArrowRight className="w-3 h-3" />
                      </NavLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 4 Cols: AI Price Recommendation Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-surface-container to-surface-container-low dark:from-emerald-950/60 dark:to-slate-900 border border-primary/30 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-on-surface dark:text-white">
                AI Selling Window Advisory
              </h3>
            </div>

            <p className="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed">
              Our LSTM Time-Series model predicts Indore wheat spot prices will reach <strong>₹2,685/qtl</strong> within 12 days (+₹45 upside).
            </p>

            <div className="p-3.5 rounded-xl bg-surface dark:bg-slate-800 border border-outline-variant/40 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-variant">Recommended Action:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Hold 60% of Harvest</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-variant">Projected Additional Gain:</span>
                <span className="font-bold text-on-surface dark:text-white">₹1,800 / Acre</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-variant">Model Confidence:</span>
                <span className="font-bold text-primary dark:text-emerald-400">92.4%</span>
              </div>
            </div>

            <NavLink
              to="/prediction-details"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm transition-all"
            >
              <span>Inspect AI Model Feature Weights</span>
              <ArrowRight className="w-4 h-4" />
            </NavLink>
          </div>

          {/* Quick links to comparison */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Related Analytics</h4>
            <NavLink
              to="/market-trends"
              className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low dark:bg-slate-800 hover:bg-surface-container text-xs font-medium text-on-surface dark:text-slate-200 transition-colors"
            >
              <span>Multi-Mandi Trend Overlay</span>
              <ArrowRight className="w-3.5 h-3.5 text-primary" />
            </NavLink>
            <NavLink
              to="/crop-profitability"
              className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low dark:bg-slate-800 hover:bg-surface-container text-xs font-medium text-on-surface dark:text-slate-200 transition-colors"
            >
              <span>Crop Margin Comparison</span>
              <ArrowRight className="w-3.5 h-3.5 text-primary" />
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
