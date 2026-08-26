import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Cpu,
  Users,
  Activity,
  HardDrive,
  Download,
  CheckCircle2,
  AlertTriangle,
  Server,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function AdminDashboard() {
  const { showToast } = useApp();
  const navigate = useNavigate();

  const handleExport = () => {
    showToast('Exporting Admin Telemetry & Health Audit Logs...', 'info');
  };

  const systemMetrics = [
    { name: 'Compute / CPU Load', val: '42%', status: 'Stable', isWarning: false },
    { name: 'GPU Cluster (AI Inference)', val: '68%', status: 'Active (4 Nodes)', isWarning: false },
    { name: 'Memory / RAM Usage', val: '78%', status: 'High Traffic', isWarning: true },
    { name: 'IoT Telemetry Storage', val: '1.2 TB / 2.0 TB', status: '60% Capacity', isWarning: false },
  ];

  const recentLogs = [
    { service: 'Inference Engine', event: 'LSTM Price Predictor v3.4 finished scheduled batch inferencing (42 Mandis)', status: 'Success', time: '12m ago' },
    { service: 'Sentinel-2 Ingestion', event: 'Processed multi-spectral NDVI tiles for Indore & Hoshangabad zones', status: 'Success', time: '34m ago' },
    { service: 'SMS Gateway', event: 'Dispatched 128 high-priority rust advisory SMS messages', status: 'Success', time: '1h ago' },
    { service: 'Database Vacuum', event: 'Automated partition indexing completed for financial transaction ledger', status: 'Success', time: '4h ago' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
            <span>Enterprise Infrastructure</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-on-surface-variant font-normal">All nodes operational</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface dark:text-white">
            System Health & Operations Control
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container dark:bg-slate-800 hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Logs</span>
          </button>
          <NavLink
            to="/models"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm transition-all"
          >
            <Cpu className="w-4 h-4" />
            <span>Manage Models</span>
          </NavLink>
        </div>
      </div>

      {/* Top 4 Infrastructure KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemMetrics.map((sm, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between text-xs text-on-surface-variant">
              <span className="font-semibold uppercase tracking-wider">{sm.name}</span>
              <Server className="w-4 h-4 text-primary" />
            </div>

            <div className="text-2xl font-bold text-on-surface dark:text-white">{sm.val}</div>

            <div className="flex items-center justify-between text-xs">
              <span className={`font-semibold ${sm.isWarning ? 'text-amber-600' : 'text-emerald-600'}`}>
                {sm.status}
              </span>
              <div className="w-16 bg-surface-container-high dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${sm.isWarning ? 'bg-amber-500' : 'bg-primary'}`}
                  style={{ width: sm.val.includes('%') ? sm.val : '60%' }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: API Volume & Service Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: API Traffic & Ingestion Chart */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-outline-variant/30">
            <div>
              <h2 className="text-base font-bold text-on-surface dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                <span>API Request Volume & Satellite Ingestion</span>
              </h2>
              <p className="text-xs text-on-surface-variant">Requests per minute over the last 24 hours (Average 3.4k RPM)</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              99.98% Uptime
            </span>
          </div>

          {/* Abstract bar chart visual */}
          <div className="w-full bg-surface-container-low/50 dark:bg-slate-800/40 rounded-xl p-6 relative min-h-[220px] flex items-end justify-around gap-3 pb-6">
            {[30, 45, 20, 60, 80, 90, 50, 35, 70, 85, 95, 65].map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-1 group w-8">
                <div
                  style={{ height: `${h * 1.5}px` }}
                  className="w-full bg-primary/70 group-hover:bg-primary rounded-t-sm transition-all relative"
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-mono px-1 py-0.5 rounded hidden group-hover:block whitespace-nowrap">
                    {h * 40} rpm
                  </div>
                </div>
                <span className="text-[9px] font-mono text-on-surface-variant">{i * 2}h</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 4 Cols: Navigation Shortcuts & Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-on-surface dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span>Admin Management Hub</span>
            </h3>

            <div className="space-y-2 text-xs">
              <NavLink
                to="/models"
                className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low dark:bg-slate-800 hover:bg-surface-container transition-colors"
              >
                <div>
                  <div className="font-semibold text-on-surface dark:text-white">AI Model Management</div>
                  <span className="text-[11px] text-on-surface-variant">Manage retraining, accuracy, latency</span>
                </div>
                <ArrowRight className="w-4 h-4 text-primary" />
              </NavLink>

              <NavLink
                to="/users"
                className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low dark:bg-slate-800 hover:bg-surface-container transition-colors"
              >
                <div>
                  <div className="font-semibold text-on-surface dark:text-white">User & Team Management</div>
                  <span className="text-[11px] text-on-surface-variant">Role permissions, field access, invites</span>
                </div>
                <ArrowRight className="w-4 h-4 text-primary" />
              </NavLink>

              <NavLink
                to="/notification-preferences"
                className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low dark:bg-slate-800 hover:bg-surface-container transition-colors"
              >
                <div>
                  <div className="font-semibold text-on-surface dark:text-white">System Alert Channels</div>
                  <span className="text-[11px] text-on-surface-variant">SMS, WhatsApp & webhook settings</span>
                </div>
                <ArrowRight className="w-4 h-4 text-primary" />
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* System Audit Logs */}
      <div className="p-6 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-on-surface dark:text-white">Recent System Execution Logs</h3>

        <div className="space-y-2 text-xs">
          {recentLogs.map((log, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-surface-container-low dark:bg-slate-800/60 border border-outline-variant/20">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <span className="font-bold text-on-surface dark:text-white mr-2">[{log.service}]</span>
                  <span className="text-on-surface-variant">{log.event}</span>
                </div>
              </div>
              <span className="text-[11px] text-on-surface-variant font-mono shrink-0">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
