import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Table,
  Search,
  Filter,
  Download,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  MapPin,
  Sparkles,
  RefreshCw
} from 'lucide-react';

const fullPriceData = [
  { id: '1', commodity: 'Wheat (Sharbati)', variety: 'Lok-1 / High Protein', market: 'Indore Mandi', state: 'Madhya Pradesh', minPrice: 2480, maxPrice: 2750, modalPrice: 2640, arrivals: '1,450 MT', change: '+4.8%', isUp: true, date: '2026-08-16' },
  { id: '2', commodity: 'Wheat (Durum)', variety: 'Pusa Tejas / HI 8759', market: 'Ujjain Mandi', state: 'Madhya Pradesh', minPrice: 2320, maxPrice: 2580, modalPrice: 2490, arrivals: '980 MT', change: '+1.6%', isUp: true, date: '2026-08-16' },
  { id: '3', commodity: 'Soybean (Yellow)', variety: 'JS 9560', market: 'Dewas Mandi', state: 'Madhya Pradesh', minPrice: 4650, maxPrice: 5120, modalPrice: 4890, arrivals: '2,800 MT', change: '+5.8%', isUp: true, date: '2026-08-16' },
  { id: '4', commodity: 'Basmati Paddy', variety: 'Pusa 1121 Sella', market: 'Karnal Grain Market', state: 'Haryana', minPrice: 3500, maxPrice: 3950, modalPrice: 3750, arrivals: '3,200 MT', change: '+1.2%', isUp: true, date: '2026-08-16' },
  { id: '5', commodity: 'Maize (Yellow Feed)', variety: 'Hybrid Ganga-11', market: 'Chhindwara Mandi', state: 'Madhya Pradesh', minPrice: 2050, maxPrice: 2260, modalPrice: 2180, arrivals: '950 MT', change: '-1.4%', isUp: false, date: '2026-08-16' },
  { id: '6', commodity: 'Mustard / Rapeseed', variety: 'Pusa Bold', market: 'Jaipur Mandi', state: 'Rajasthan', minPrice: 5200, maxPrice: 5650, modalPrice: 5420, arrivals: '1,800 MT', change: '+2.1%', isUp: true, date: '2026-08-16' },
  { id: '7', commodity: 'Gram / Chickpea (Desi)', variety: 'JG-11', market: 'Bhopal Mandi', state: 'Madhya Pradesh', minPrice: 5600, maxPrice: 6050, modalPrice: 5850, arrivals: '720 MT', change: '-0.8%', isUp: false, date: '2026-08-16' },
  { id: '8', commodity: 'Cotton (Medium Staple)', variety: 'Bt Cotton Shankar-6', market: 'Rajkot Mandi', state: 'Gujarat', minPrice: 6900, maxPrice: 7450, modalPrice: 7200, arrivals: '1,120 MT', change: '+3.4%', isUp: true, date: '2026-08-16' },
  { id: '9', commodity: 'Pigeon Pea (Tur/Arhar)', variety: 'Asha / ICPL 87119', market: 'Gulbarga Mandi', state: 'Karnataka', minPrice: 9400, maxPrice: 10600, modalPrice: 10150, arrivals: '640 MT', change: '+0.5%', isUp: true, date: '2026-08-16' },
];

export default function MarketPriceTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortField, setSortField] = useState('modalPrice');
  const [sortAsc, setSortAsc] = useState(false);
  const { showToast } = useApp();
  const navigate = useNavigate();

  const handleExportCSV = () => {
    showToast('Exporting Market Price Table to CSV format...', 'info');
  };

  const filteredData = fullPriceData
    .filter(item => {
      const matchSearch = item.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.market.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.state.toLowerCase().includes(searchTerm.toLowerCase());
      if (selectedCategory === 'All') return matchSearch;
      if (selectedCategory === 'Wheat') return matchSearch && item.commodity.includes('Wheat');
      if (selectedCategory === 'Soybean') return matchSearch && item.commodity.includes('Soybean');
      if (selectedCategory === 'Paddy/Rice') return matchSearch && item.commodity.includes('Paddy');
      return matchSearch;
    })
    .sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Header with Back button */}
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
                Real-time Mandi Telemetry
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold">
                Live Data Stream
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-on-surface dark:text-white">
              National Market Price Table
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container dark:bg-slate-800 hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <NavLink
            to="/market-trends"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm transition-all"
          >
            <span>Compare Curves</span>
          </NavLink>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search crop, mandi, state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/40 text-xs text-on-surface dark:text-white focus:outline-none focus:border-primary"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {['All', 'Wheat', 'Soybean', 'Paddy/Rice'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container dark:bg-slate-800 text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-low/60 dark:bg-slate-800/80 border-b border-outline-variant/40 text-on-surface-variant font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Commodity & Variety</th>
                <th className="py-3 px-4">Market / Mandi</th>
                <th className="py-3 px-4">State</th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:text-primary"
                  onClick={() => { setSortField('modalPrice'); setSortAsc(!sortAsc); }}
                >
                  <div className="flex items-center gap-1">
                    <span>Modal Price</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Min / Max Range</th>
                <th className="py-3 px-4">24h Change</th>
                <th className="py-3 px-4">Daily Arrivals</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-surface-container-low/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-sm text-on-surface dark:text-white">{row.commodity}</div>
                    <div className="text-[11px] text-on-surface-variant">{row.variety}</div>
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant dark:text-slate-300">
                    <div className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{row.market}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant">{row.state}</td>
                  <td className="py-3.5 px-4 font-bold text-sm text-primary dark:text-emerald-400">
                    ₹{row.modalPrice.toLocaleString()} <span className="text-[10px] text-on-surface-variant font-normal">/qtl</span>
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant font-mono text-[11px]">
                    ₹{row.minPrice} - ₹{row.maxPrice}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center text-xs font-bold ${
                      row.isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {row.isUp ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                      {row.change}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-on-surface-variant">{row.arrivals}</td>
                  <td className="py-3.5 px-4 text-right">
                    <NavLink
                      to="/price-prediction"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary dark:bg-emerald-950 dark:text-emerald-300 text-xs font-semibold hover:bg-primary/20 transition-all"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>AI Model</span>
                    </NavLink>
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
