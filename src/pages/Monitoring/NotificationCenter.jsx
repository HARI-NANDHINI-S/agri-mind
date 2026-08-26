import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  BrainCircuit,
  DollarSign,
  Trash2,
  Settings,
  ArrowRight,
  Filter,
  CheckCheck
} from 'lucide-react';

export default function NotificationCenter() {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    deleteNotification,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState('All');
  const navigate = useNavigate();

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Alerts') return n.type === 'alert';
    if (activeTab === 'Market') return n.type === 'market';
    if (activeTab === 'AI') return n.type === 'ai';
    if (activeTab === 'Finance') return n.type === 'expense';
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
      case 'market':
        return <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'ai':
        return <BrainCircuit className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      default:
        return <DollarSign className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
            <span>Intelligence Dispatch Center</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-on-surface-variant font-normal">Real-time alerts</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface dark:text-white">
            Notification Center
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllNotificationsAsRead}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container dark:bg-slate-800 hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-primary" />
            <span>Mark All as Read</span>
          </button>
          <NavLink
            to="/notification-preferences"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm transition-all"
          >
            <Settings className="w-4 h-4" />
            <span>Preferences</span>
          </NavLink>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto p-1.5 rounded-2xl bg-surface-container-low dark:bg-slate-900 border border-outline-variant/40">
        {['All', 'Alerts', 'Market', 'AI', 'Finance'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/30">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-semibold">No notifications in this category</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationAsRead(notif.id);
                if (notif.link) navigate(notif.link);
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer group flex items-start justify-between gap-4 ${
                !notif.read
                  ? 'bg-surface-container-lowest dark:bg-slate-900 border-primary/40 shadow-sm hover:border-primary'
                  : 'bg-surface-container-low/40 dark:bg-slate-900/60 border-outline-variant/30 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container dark:bg-slate-800 flex items-center justify-center shrink-0">
                  {getIcon(notif.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-on-surface dark:text-white group-hover:text-primary transition-colors">
                      {notif.title}
                    </h3>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    )}
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-container-high dark:bg-slate-800 text-on-surface-variant">
                      {notif.category}
                    </span>
                  </div>

                  <p className="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed max-w-2xl">
                    {notif.message}
                  </p>

                  <div className="text-[11px] text-on-surface-variant/70 pt-1">
                    {notif.time} • {notif.date}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notif.id);
                  }}
                  className="p-2 text-on-surface-variant hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Dismiss notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="p-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
