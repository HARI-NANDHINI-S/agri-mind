import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Plus,
  Bot,
  Menu,
  ChevronDown,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  UserCheck,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function Header({ onToggleSidebar }) {
  const { 
    theme, 
    toggleTheme, 
    activeFarm, 
    setActiveFarm, 
    unreadCount, 
    notifications, 
    markAllNotificationsAsRead,
    setIsCommandPaletteOpen 
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isFarmMenuOpen, setIsFarmMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const notifRef = useRef(null);
  const farmRef = useRef(null);
  const userRef = useRef(null);
  const navigate = useNavigate();

  const farms = [
    { id: 'farm-01', name: 'Green Acres Agri-Hub', field: 'Field 4B (Wheat - 45 Acres)', loc: 'Indore, MP' },
    { id: 'farm-02', name: 'Narmada Valley Estate', field: 'Block 2 (Soybean - 80 Acres)', loc: 'Hoshangabad, MP' },
    { id: 'farm-03', name: 'Punjab Agro Fields', field: 'Plot 7 (Basmati Rice - 60 Acres)', loc: 'Ludhiana, PB' },
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setIsNotifOpen(false);
      if (farmRef.current && !farmRef.current.contains(e.target)) setIsFarmMenuOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setIsUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-surface-container-lowest/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-outline-variant/40 dark:border-slate-800 px-4 lg:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu & Global Search Trigger */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div 
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-surface-container-low dark:bg-slate-800/80 border border-outline-variant/40 dark:border-slate-700 hover:border-primary/50 text-on-surface-variant cursor-pointer transition-all group"
        >
          <Search className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors" />
          <span className="text-xs text-on-surface-variant/80 truncate">
            Search intelligence, crops, mandi prices, actions...
          </span>
          <kbd className="hidden sm:inline-flex items-center gap-1 ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-container-high dark:bg-slate-700 text-on-surface-variant">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Farm / Field Selector */}
        <div className="relative" ref={farmRef}>
          <button
            onClick={() => setIsFarmMenuOpen(!isFarmMenuOpen)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/40 hover:bg-surface-container transition-all text-xs font-medium text-on-surface dark:text-slate-200"
          >
            <MapPin className="w-3.5 h-3.5 text-primary dark:text-emerald-400 shrink-0" />
            <div className="text-left">
              <p className="font-semibold text-xs leading-none">{activeFarm.name}</p>
              <p className="text-[10px] text-on-surface-variant dark:text-slate-400 mt-0.5">{activeFarm.currentField}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant ml-1" />
          </button>

          {isFarmMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-surface dark:bg-slate-900 border border-outline-variant dark:border-slate-700 shadow-dropdown p-2 z-50 animate-fade-in">
              <div className="px-3 py-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                Select Active Farm / Field
              </div>
              {farms.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setActiveFarm(prev => ({ ...prev, name: f.name, currentField: f.field, location: f.loc }));
                    setIsFarmMenuOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between ${
                    activeFarm.name === f.name 
                      ? 'bg-primary/10 text-primary dark:bg-emerald-950 dark:text-emerald-300 font-semibold' 
                      : 'hover:bg-surface-container dark:hover:bg-slate-800 text-on-surface dark:text-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-semibold">{f.name}</div>
                    <div className="text-[11px] text-on-surface-variant opacity-80">{f.field}</div>
                    <div className="text-[10px] text-primary dark:text-emerald-400">{f.loc}</div>
                  </div>
                  {activeFarm.name === f.name && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Add Expense Button */}
        <NavLink
          to="/expenses-add"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Expense</span>
        </NavLink>

        {/* Ask AI Copilot button */}
        <NavLink
          to="/ai-chat"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 dark:bg-emerald-950 text-primary dark:text-emerald-300 text-xs font-semibold hover:bg-primary/20 transition-all border border-primary/20"
        >
          <Bot className="w-4 h-4" />
          <span className="hidden md:inline">Ask AI</span>
        </NavLink>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface dark:hover:bg-slate-800 transition-colors"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface dark:hover:bg-slate-800 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-surface"></span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-surface dark:bg-slate-900 border border-outline-variant dark:border-slate-700 shadow-dropdown p-3 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/40 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-on-surface dark:text-white">Live Field Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-[11px] font-medium text-primary hover:underline"
                >
                  Mark all read
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto py-2 space-y-2">
                {notifications.slice(0, 4).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setIsNotifOpen(false);
                      if (n.link) navigate(n.link);
                    }}
                    className={`p-2.5 rounded-xl text-xs cursor-pointer transition-all border ${
                      !n.read 
                        ? 'bg-primary/5 dark:bg-emerald-950/40 border-primary/20' 
                        : 'bg-surface-container-low dark:bg-slate-800/40 border-transparent hover:border-outline-variant'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-on-surface dark:text-white text-xs truncate max-w-[200px]">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-on-surface-variant shrink-0">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant dark:text-slate-300 line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-outline-variant/40 dark:border-slate-800 flex justify-between items-center text-xs">
                <NavLink
                  to="/notification-preferences"
                  onClick={() => setIsNotifOpen(false)}
                  className="text-[11px] text-on-surface-variant hover:text-primary"
                >
                  Alert Settings
                </NavLink>
                <NavLink
                  to="/notifications"
                  onClick={() => setIsNotifOpen(false)}
                  className="text-xs font-semibold text-primary dark:text-emerald-400 flex items-center gap-1 hover:underline"
                >
                  <span>Open Center</span>
                  <ArrowRight className="w-3 h-3" />
                </NavLink>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/40 hover:bg-surface-container transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
              AP
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold leading-none">Aarav Patel</p>
              <p className="text-[10px] text-on-surface-variant leading-none mt-1">Lead Agronomist</p>
            </div>
            <ChevronDown className="w-3 h-3 text-on-surface-variant" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-surface dark:bg-slate-900 border border-outline-variant dark:border-slate-700 shadow-dropdown p-2 z-50 animate-fade-in text-xs">
              <div className="px-3 py-2 border-b border-outline-variant/40 dark:border-slate-800">
                <p className="font-semibold text-on-surface dark:text-white">Aarav Patel</p>
                <p className="text-[11px] text-on-surface-variant">aarav.patel@agrimind.ai</p>
              </div>
              <div className="py-1">
                <NavLink
                  to="/users"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-on-surface dark:text-slate-300 hover:bg-surface-container dark:hover:bg-slate-800"
                >
                  <UserCheck className="w-4 h-4 text-primary" />
                  <span>Team & Permissions</span>
                </NavLink>
                <NavLink
                  to="/admin"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-on-surface dark:text-slate-300 hover:bg-surface-container dark:hover:bg-slate-800"
                >
                  <ShieldAlert className="w-4 h-4 text-primary" />
                  <span>Admin Control Center</span>
                </NavLink>
                <NavLink
                  to="/notification-preferences"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-on-surface dark:text-slate-300 hover:bg-surface-container dark:hover:bg-slate-800"
                >
                  <Bell className="w-4 h-4 text-primary" />
                  <span>Alert Preferences</span>
                </NavLink>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
