import React, { useState } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  MapPin,
  Bot,
  Share2,
  PlusCircle,
  Clock,
  Layers,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function AlertDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast, activeFarm } = useApp();
  const [isResolved, setIsResolved] = useState(false);

  const handleResolve = () => {
    setIsResolved(true);
    showToast('Alert protocol marked as resolved. Field telemetry updating...', 'success');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
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
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Critical Agronomy Alert
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                {isResolved ? 'Resolved' : 'Action Required (48h)'}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-on-surface dark:text-white">
              Potential Pest & Rust Outbreak Detected
            </h1>
            <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>{activeFarm.currentField}</span>
              <span>•</span>
              <Clock className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
              <span>Detected Today at 08:42 AM</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast('Alert report link copied to clipboard!', 'info')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container dark:bg-slate-800 hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Report</span>
          </button>

          <NavLink
            to="/ai-chat"
            state={{ initialPrompt: 'Provide step-by-step chemical dosage and sprayer speed for Yellow Rust in Field 4B.' }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm transition-all"
          >
            <Bot className="w-4 h-4" />
            <span>Consult AI Copilot</span>
          </NavLink>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Threat Assessment & Mitigation Protocol */}
        <div className="lg:col-span-8 space-y-6">
          {/* AI Threat Assessment Card */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-on-surface dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <span>AI Threat Assessment (Flight ID: DR-094)</span>
            </h2>

            <p className="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed">
              Computer vision models applied to drone multi-spectral flyover imagery and on-ground moisture probes have identified foliar lesions consistent with early-stage Puccinia striiformis (Yellow Rust) and Fall Armyworm foliar feeding. The spatial concentration suggests the infection initiated near the northeast irrigation line and is spreading southwest along prevailing wind currents.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900">
                <span className="text-[10px] text-rose-700 dark:text-rose-300 uppercase font-bold">Confidence</span>
                <div className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-0.5">94.2%</div>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low dark:bg-slate-800/60 border border-outline-variant/30">
                <span className="text-[10px] text-on-surface-variant uppercase font-bold">Affected Area</span>
                <div className="text-xl font-bold text-on-surface dark:text-white mt-0.5">12.5 Acres</div>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low dark:bg-slate-800/60 border border-outline-variant/30">
                <span className="text-[10px] text-on-surface-variant uppercase font-bold">Yield Risk</span>
                <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">15-20% Loss</div>
              </div>
            </div>
          </div>

          {/* Mitigation Protocol Checklist */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-on-surface dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>Recommended Mitigation Protocol</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low dark:bg-slate-800/60 border border-outline-variant/30">
                <div className="w-6 h-6 rounded-full bg-primary text-white font-bold flex items-center justify-center shrink-0 text-xs">1</div>
                <div>
                  <strong className="text-sm text-on-surface dark:text-white block mb-0.5">Immediate Manual Ground Scouting</strong>
                  <p className="text-on-surface-variant dark:text-slate-300">Dispatch field technician to Sector 4B to visually confirm leaf pustules and take sample photography.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low dark:bg-slate-800/60 border border-outline-variant/30">
                <div className="w-6 h-6 rounded-full bg-primary text-white font-bold flex items-center justify-center shrink-0 text-xs">2</div>
                <div>
                  <strong className="text-sm text-on-surface dark:text-white block mb-0.5">Targeted Fungicide Spray Calibration</strong>
                  <p className="text-on-surface-variant dark:text-slate-300">Prepare tractor boom sprayer with Propiconazole 25% EC @ 1ml/L water. Spray before Saturday evening rain window.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low dark:bg-slate-800/60 border border-outline-variant/30">
                <div className="w-6 h-6 rounded-full bg-primary text-white font-bold flex items-center justify-center shrink-0 text-xs">3</div>
                <div>
                  <strong className="text-sm text-on-surface dark:text-white block mb-0.5">Adjust Micro-Drip Fertigation</strong>
                  <p className="text-on-surface-variant dark:text-slate-300">Temporarily reduce overhead sprinkler moisture in adjacent blocks to decrease canopy humidity below 70%.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant/30 flex flex-wrap gap-3">
              <NavLink
                to="/expenses-add"
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Log Chemical Spray Expense</span>
              </NavLink>

              <button
                onClick={handleResolve}
                className="px-5 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-semibold transition-colors"
              >
                {isResolved ? '✓ Marked as Mitigated' : 'Mark Protocol Complete'}
              </button>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Spatial Heatmap & Related Alerts */}
        <div className="lg:col-span-4 space-y-6">
          {/* Spatial Heatmap Card */}
          <div className="p-6 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-on-surface dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <span>Spatial Outbreak Map</span>
            </h3>

            {/* Visual satellite mockup */}
            <div className="h-48 rounded-xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-amber-900 relative overflow-hidden flex items-center justify-center border border-outline-variant/30">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="w-24 h-24 rounded-full bg-rose-500/40 animate-ping absolute"></div>
              <div className="w-16 h-16 rounded-full bg-rose-600/80 flex items-center justify-center text-white font-bold text-xs relative z-10 shadow-lg">
                Sector 4B
              </div>
              <span className="absolute bottom-2 left-2 text-[10px] text-white/90 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                NDVI Anomaly Detected
              </span>
            </div>

            <div className="text-xs text-on-surface-variant space-y-1">
              <div className="flex justify-between">
                <span>Spread Velocity:</span>
                <strong className="text-on-surface dark:text-white">1.8 meters / day</strong>
              </div>
              <div className="flex justify-between">
                <span>Prevailing Wind:</span>
                <strong className="text-on-surface dark:text-white">WNW @ 12 km/h</strong>
              </div>
            </div>
          </div>

          {/* Quick links to risk & notification center */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Related Monitoring</h4>
            <NavLink
              to="/risk-assessment"
              className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low dark:bg-slate-800 hover:bg-surface-container text-xs font-medium text-on-surface dark:text-slate-200 transition-colors"
            >
              <span>Full Risk Matrix Diagnostic</span>
              <ChevronRight className="w-4 h-4 text-primary" />
            </NavLink>
            <NavLink
              to="/notifications"
              className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low dark:bg-slate-800 hover:bg-surface-container text-xs font-medium text-on-surface dark:text-slate-200 transition-colors"
            >
              <span>All Active Notifications</span>
              <ChevronRight className="w-4 h-4 text-primary" />
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
