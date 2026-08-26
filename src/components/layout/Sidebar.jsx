import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  BrainCircuit,
  Bot,
  Sparkles,
  TrendingUp,
  Table,
  BarChart3,
  DollarSign,
  PlusCircle,
  ShieldAlert,
  Bell,
  Settings,
  Cpu,
  Users,
  Sprout,
  ChevronRight,
  PieChart,
  Layers
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { unreadCount, activeFarm } = useApp();
  const location = useLocation();

  const navGroups = [
    {
      label: 'INTELLIGENCE CORE',
      items: [
        { name: 'Intelligence Suite', path: '/intelligence', icon: BrainCircuit, exact: true },
        { name: 'AI Agronomist Chat', path: '/ai-chat', icon: Bot, badge: 'Live' },
        { name: 'AI Analysis & Insights', path: '/ai-insights', icon: Sparkles },
      ]
    },
    {
      label: 'MARKET & COMMODITY',
      items: [
        { name: 'Market Dashboard', path: '/market', icon: TrendingUp },
        { name: 'Market Price Table', path: '/market-prices', icon: Table },
        { name: 'Trends Comparison', path: '/market-trends', icon: BarChart3 },
        { name: 'Price Prediction', path: '/price-prediction', icon: PieChart },
        { name: 'Prediction Details', path: '/prediction-details', icon: Layers },
      ]
    },
    {
      label: 'FINANCE & PROFIT',
      items: [
        { name: 'Profitability Dashboard', path: '/profitability', icon: DollarSign },
        { name: 'Crop Comparison', path: '/crop-profitability', icon: Sprout },
        { name: 'Expense Dashboard', path: '/expenses', icon: DollarSign },
        { name: 'Expense List', path: '/expenses-list', icon: Table },
        { name: 'Add Expense', path: '/expenses-add', icon: PlusCircle, highlight: true },
        { name: 'Expense Analytics', path: '/expenses-analytics', icon: BarChart3 },
      ]
    },
    {
      label: 'MONITORING & RISKS',
      items: [
        { name: 'Risk Assessment', path: '/risk-assessment', icon: ShieldAlert },
        { name: 'Alert Details', path: '/alerts-detail/rust-field-4b', icon: ShieldAlert, alertBadge: '1 Urgent' },
        { name: 'Notification Center', path: '/notifications', icon: Bell, badgeCount: unreadCount },
        { name: 'Notification Settings', path: '/notification-preferences', icon: Settings },
      ]
    },
    {
      label: 'ADMIN & SYSTEM',
      items: [
        { name: 'Admin Dashboard', path: '/admin', icon: Settings },
        { name: 'Model Management', path: '/models', icon: Cpu },
        { name: 'User Management', path: '/users', icon: Users },
      ]
    }
  ];

  return (
    <aside 
      className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-72 bg-surface-container-lowest dark:bg-slate-900 border-r border-outline-variant/50 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-outline-variant/40 dark:border-slate-800 flex items-center justify-between">
        <NavLink to="/intelligence" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Sprout className="w-6 h-6 text-on-primary" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-primary dark:text-emerald-400">AgriMind</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary dark:bg-emerald-950 dark:text-emerald-300">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant dark:text-slate-400 font-medium">Precision Intelligence</p>
          </div>
        </NavLink>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </div>

      {/* Active Farm Badge */}
      <div className="px-4 py-3 mx-3 my-2 rounded-xl bg-surface-container-low dark:bg-slate-800/60 border border-outline-variant/30">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-on-surface-variant dark:text-slate-400 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Active Field
          </span>
          <span className="text-[10px] font-semibold text-primary dark:text-emerald-400">Telemetry Live</span>
        </div>
        <p className="text-xs font-semibold text-on-surface dark:text-slate-100 truncate">{activeFarm.currentField}</p>
      </div>

      {/* Navigation Links Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="px-3 text-[10px] font-bold tracking-wider text-on-surface-variant/70 dark:text-slate-400 uppercase">
              {group.label}
            </div>
            {group.items.map((item, iIdx) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path + '/'));

              return (
                <NavLink
                  key={iIdx}
                  to={item.path}
                  onClick={() => onClose && onClose()}
                  className={({ isActive: linkActive }) => {
                    const active = linkActive || isActive;
                    return `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                      active
                        ? 'bg-primary text-white shadow-sm font-semibold'
                        : item.highlight
                        ? 'text-primary dark:text-emerald-400 bg-primary/5 dark:bg-emerald-950/40 hover:bg-primary/10'
                        : 'text-on-surface-variant dark:text-slate-300 hover:bg-surface-container-high dark:hover:bg-slate-800 hover:text-on-surface'
                    }`;
                  }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.badge && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                        {item.badge}
                      </span>
                    )}
                    {item.alertBadge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-700 dark:text-rose-300">
                        {item.alertBadge}
                      </span>
                    )}
                    {item.badgeCount > 0 && (
                      <span className="text-[10px] font-bold w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center group-[.bg-primary]:bg-white group-[.bg-primary]:text-primary">
                        {item.badgeCount}
                      </span>
                    )}
                  </div>
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Sidebar Footer AI Quick Card */}
      <div className="p-3 border-t border-outline-variant/40 dark:border-slate-800 bg-surface-container-low/50 dark:bg-slate-950/40">
        <NavLink
          to="/ai-chat"
          className="flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-container text-white shadow-md hover:brightness-105 transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold leading-tight">Agronomist AI</p>
            <p className="text-[10px] text-white/80 truncate">Ask about rust, yield, rainfall</p>
          </div>
          <ChevronRight className="w-4 h-4 text-white/80 shrink-0" />
        </NavLink>
      </div>
    </aside>
  );
}
