import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Settings,
  Bell,
  MessageSquare,
  Mail,
  Smartphone,
  CheckCircle2,
  Save,
  ShieldAlert,
  TrendingUp,
  CloudRain
} from 'lucide-react';

export default function NotificationPreferences() {
  const navigate = useNavigate();
  const { showToast } = useApp();

  const [channels, setChannels] = useState({
    whatsapp: true,
    sms: true,
    push: true,
    email: false
  });

  const [triggers, setTriggers] = useState({
    weatherAlerts: true,
    pestWarnings: true,
    marketSurges: true,
    budgetThreshold: true,
    modelRetrainStatus: false
  });

  const [marketThreshold, setMarketThreshold] = useState('3.0%');

  const handleSave = () => {
    showToast('Notification channels & alert thresholds saved successfully!', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
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
              Alert Configuration
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-on-surface dark:text-white">
              Notification & Dispatch Preferences
            </h1>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-md transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="p-6 md:p-8 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm space-y-8">
        {/* Delivery Channels */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-on-surface dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-primary" />
            <span>Active Dispatch Channels</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-surface-container-low dark:bg-slate-800/60 border border-outline-variant/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-on-surface dark:text-white">WhatsApp Direct</h3>
                  <p className="text-[11px] text-on-surface-variant">+91 98765 43210 (Verified)</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={channels.whatsapp}
                onChange={(e) => setChannels({ ...channels, whatsapp: e.target.checked })}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low dark:bg-slate-800/60 border border-outline-variant/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-on-surface dark:text-white">SMS High-Priority</h3>
                  <p className="text-[11px] text-on-surface-variant">Instant for critical pest/frost warnings</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={channels.sms}
                onChange={(e) => setChannels({ ...channels, sms: e.target.checked })}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low dark:bg-slate-800/60 border border-outline-variant/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-on-surface dark:text-white">In-App Browser Push</h3>
                  <p className="text-[11px] text-on-surface-variant">Real-time desktop and mobile push</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={channels.push}
                onChange={(e) => setChannels({ ...channels, push: e.target.checked })}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low dark:bg-slate-800/60 border border-outline-variant/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-on-surface dark:text-white">Weekly Email Executive Digest</h3>
                  <p className="text-[11px] text-on-surface-variant">aarav.patel@agrimind.ai</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={channels.email}
                onChange={(e) => setChannels({ ...channels, email: e.target.checked })}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Trigger Subscriptions */}
        <div className="space-y-4 pt-4 border-t border-outline-variant/30">
          <h2 className="text-sm font-bold text-on-surface dark:text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-primary" />
            <span>Event & Threshold Subscriptions</span>
          </h2>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low dark:bg-slate-800/60 border border-outline-variant/30 cursor-pointer">
              <div className="space-y-0.5">
                <span className="font-bold text-on-surface dark:text-white text-sm">Weather Radar & Heavy Rain Alerts</span>
                <p className="text-on-surface-variant">Triggers when precipitation probability exceeds 60% within 48h.</p>
              </div>
              <input
                type="checkbox"
                checked={triggers.weatherAlerts}
                onChange={(e) => setTriggers({ ...triggers, weatherAlerts: e.target.checked })}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low dark:bg-slate-800/60 border border-outline-variant/30 cursor-pointer">
              <div className="space-y-0.5">
                <span className="font-bold text-on-surface dark:text-white text-sm">Yellow Rust & Pest Pathology Detection</span>
                <p className="text-on-surface-variant">Triggers when drone computer vision detects foliar anomalies.</p>
              </div>
              <input
                type="checkbox"
                checked={triggers.pestWarnings}
                onChange={(e) => setTriggers({ ...triggers, pestWarnings: e.target.checked })}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low dark:bg-slate-800/60 border border-outline-variant/30 cursor-pointer">
              <div className="space-y-0.5">
                <span className="font-bold text-on-surface dark:text-white text-sm">Mandi Spot Price Surges & Selling Windows</span>
                <p className="text-on-surface-variant">Notify me when mandi price moves by more than {marketThreshold} in 24 hours.</p>
              </div>
              <input
                type="checkbox"
                checked={triggers.marketSurges}
                onChange={(e) => setTriggers({ ...triggers, marketSurges: e.target.checked })}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
