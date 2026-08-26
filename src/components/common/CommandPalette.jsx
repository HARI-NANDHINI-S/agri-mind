import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  BrainCircuit, 
  Bot, 
  TrendingUp, 
  DollarSign, 
  ShieldAlert, 
  Bell, 
  Settings, 
  PlusCircle, 
  Table, 
  BarChart3, 
  Users, 
  Cpu, 
  FileText,
  X,
  Compass
} from 'lucide-react';

export const allNavigationItems = [
  { title: 'AgriMind Intelligence Overview', path: '/intelligence', category: 'Intelligence', icon: BrainCircuit, keywords: 'overview dashboard summary crops satellite ndvi yield' },
  { title: 'AI Assistant Chat', path: '/ai-chat', category: 'Intelligence', icon: Bot, keywords: 'ai copilot agronomist ask chat prompt bot' },
  { title: 'AI Analysis & Insights', path: '/ai-insights', category: 'Intelligence', icon: SparklesIcon, keywords: 'disease diagnosis pathology anomaly detection' },
  
  { title: 'Market Dashboard', path: '/market', category: 'Market & Prices', icon: TrendingUp, keywords: 'mandi prices live commodities rates tickers' },
  { title: 'Market Price Table', path: '/market-prices', category: 'Market & Prices', icon: Table, keywords: 'table search mandi rates modal minimum maximum' },
  { title: 'Market Trends Comparison', path: '/market-trends', category: 'Market & Prices', icon: BarChart3, keywords: 'trends curve comparison historical variance' },
  { title: 'Price Prediction Dashboard', path: '/price-prediction', category: 'Market & Prices', icon: TrendingUp, keywords: 'prediction forecast future prices 30 60 90 days' },
  { title: 'Prediction Details & Weights', path: '/prediction-details', category: 'Market & Prices', icon: FileText, keywords: 'feature importance accuracy ml weights' },

  { title: 'Profitability Dashboard', path: '/profitability', category: 'Farm Finance', icon: DollarSign, keywords: 'roi margin revenue net profit per acre' },
  { title: 'Crop Profitability Comparison', path: '/crop-profitability', category: 'Farm Finance', icon: BarChart3, keywords: 'wheat corn soybean rice margin comparison' },
  { title: 'Expense Dashboard', path: '/expenses', category: 'Farm Finance', icon: DollarSign, keywords: 'expenses spending budget cost cashflow' },
  { title: 'Expense List & Ledger', path: '/expenses-list', category: 'Farm Finance', icon: Table, keywords: 'list transactions receipts vouchers filter' },
  { title: 'Add New Expense', path: '/expenses-add', category: 'Farm Finance', icon: PlusCircle, keywords: 'create new log purchase invoice receipt' },
  { title: 'Expense Analytics & Variance', path: '/expenses-analytics', category: 'Farm Finance', icon: BarChart3, keywords: 'burn rate budget variance category breakdown' },
  { title: 'Expense Details Voucher', path: '/expenses-details/EXP-8842', category: 'Farm Finance', icon: FileText, keywords: 'voucher invoice audit approval' },

  { title: 'Risk Assessment Details', path: '/risk-assessment', category: 'Risk & Monitoring', icon: ShieldAlert, keywords: 'risk climate drought pest volatility assessment' },
  { title: 'Alert Details (Yellow Rust)', path: '/alerts-detail/rust-field-4b', category: 'Risk & Monitoring', icon: ShieldAlert, keywords: 'alert warning critical urgency action plan' },
  { title: 'Notification Center', path: '/notifications', category: 'Risk & Monitoring', icon: Bell, keywords: 'notifications alerts updates inbox' },
  { title: 'Notification Preferences', path: '/notification-preferences', category: 'Risk & Monitoring', icon: Settings, keywords: 'preferences sms whatsapp email settings alerts' },

  { title: 'Admin Dashboard', path: '/admin', category: 'Admin & System', icon: Settings, keywords: 'admin system health api telemetry metrics' },
  { title: 'Model Management', path: '/models', category: 'Admin & System', icon: Cpu, keywords: 'models ai ml pipeline retrain accuracy' },
  { title: 'User & Team Management', path: '/users', category: 'Admin & System', icon: Users, keywords: 'users team permissions agronomist workers' },
];

function SparklesIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

export default function CommandPalette() {
  const { isCommandPaletteOpen, setIsCommandPaletteOpen } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const filteredItems = allNavigationItems.filter(item => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return item.title.toLowerCase().includes(q) || 
           item.category.toLowerCase().includes(q) || 
           item.keywords.toLowerCase().includes(q);
  });

  const handleSelect = (path) => {
    navigate(path);
    setIsCommandPaletteOpen(false);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4 animate-fade-in">
      <div 
        className="bg-surface dark:bg-slate-900 border border-outline-variant dark:border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-outline-variant dark:border-slate-800 bg-surface-container-lowest dark:bg-slate-900">
          <Search className="w-5 h-5 text-primary dark:text-emerald-400 mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Search pages, actions, tools, insights (e.g. 'expenses', 'mandi', 'rust', 'yield')..."
            className="w-full bg-transparent border-none text-on-surface dark:text-white placeholder:text-on-surface-variant/60 focus:outline-none text-base"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            autoFocus
          />
          <button 
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 text-on-surface-variant hover:text-on-surface rounded-md ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick List Results */}
        <div className="overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-on-surface-variant">
              <Compass className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No matching AgriMind modules found for "{query}"</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleSelect(item.path)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                    idx === selectedIndex 
                      ? 'bg-primary/10 dark:bg-primary-container/30 text-primary dark:text-emerald-300 font-medium' 
                      : 'hover:bg-surface-container-high dark:hover:bg-slate-800 text-on-surface dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-container dark:bg-slate-800 flex items-center justify-center text-primary dark:text-emerald-400 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{item.title}</div>
                      <div className="text-xs text-on-surface-variant dark:text-slate-400">{item.category} • {item.path}</div>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-surface-container-high dark:bg-slate-800 text-on-surface-variant font-mono">Jump ↵</span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 border-t border-outline-variant/60 dark:border-slate-800 bg-surface-container-low dark:bg-slate-950 flex items-center justify-between text-xs text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span className="bg-surface-container-high dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-[10px]">ESC</span>
            <span>to close</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-surface-container-high dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-[10px]">Ctrl + K</span>
            <span>Global Search</span>
          </div>
        </div>
      </div>
    </div>
  );
}
