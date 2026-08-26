import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Cpu,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  Download
} from 'lucide-react';

export default function ModelManagement() {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [retrainingModel, setRetrainingModel] = useState(null);

  const [models, setModels] = useState([
    {
      id: 'MOD-01',
      name: 'Mandi Price Forecast Bi-LSTM',
      version: 'v3.4.2',
      type: 'Time-Series Forecast',
      accuracy: '94.2%',
      latency: '28 ms',
      lastTrained: '2026-08-16 14:00',
      status: 'Active / Production',
      dataset: '12-Year Mandi Price & Weather Telemetry'
    },
    {
      id: 'MOD-02',
      name: 'Pest & Leaf Rust Vision CNN',
      version: 'v2.1.0',
      type: 'Computer Vision',
      accuracy: '96.8%',
      latency: '45 ms',
      lastTrained: '2026-08-14 09:30',
      status: 'Active / Production',
      dataset: '180,000 High-Res Agronomic Foliar Samples'
    },
    {
      id: 'MOD-03',
      name: 'Crop Yield & Biomass Predictor',
      version: 'v4.0.1-rc',
      type: 'Multi-Variate XGBoost',
      accuracy: '91.5%',
      latency: '15 ms',
      lastTrained: '2026-08-15 18:20',
      status: 'Active / Production',
      dataset: 'Sentinel-2 Multi-Spectral NDVI Bands'
    },
    {
      id: 'MOD-04',
      name: 'Soil Moisture & Evapotranspiration Radar',
      version: 'v1.8.4',
      type: 'Physics-Guided Neural Net',
      accuracy: '93.0%',
      latency: '32 ms',
      lastTrained: '2026-08-12 11:15',
      status: 'Active / Production',
      dataset: 'IoT Soil Sensor Matrix + IMD Radar'
    }
  ]);

  const handleRetrain = (id, name) => {
    setRetrainingModel(id);
    showToast(`Retraining pipeline initiated for "${name}"...`, 'info');
    setTimeout(() => {
      setRetrainingModel(null);
      showToast(`Model "${name}" retrained successfully! Accuracy improved +0.4%`, 'success');
    }, 2500);
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
            <span className="text-[11px] font-bold text-primary uppercase tracking-widest">
              AI / ML Infrastructure Pipeline
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-on-surface dark:text-white">
              AI Model Management & Deployment
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NavLink
            to="/prediction-details"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container dark:bg-slate-800 hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Explainability & Weights</span>
          </NavLink>
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {models.map((m) => (
          <div
            key={m.id}
            className="p-6 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm hover:border-primary transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between pb-3 border-b border-outline-variant/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-on-surface dark:text-white">{m.name}</h3>
                    <p className="text-xs text-on-surface-variant">{m.type} • <strong className="font-mono text-primary">{m.version}</strong></p>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {m.status}
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 my-4 p-3 rounded-xl bg-surface-container-low dark:bg-slate-800/60 text-xs">
                <div>
                  <span className="text-[10px] text-on-surface-variant block">Validation Accuracy</span>
                  <strong className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{m.accuracy}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-on-surface-variant block">Inference Latency</span>
                  <strong className="text-sm font-bold text-on-surface dark:text-white">{m.latency}</strong>
                </div>
              </div>

              <div className="text-xs text-on-surface-variant space-y-1">
                <div><span>Dataset:</span> <strong className="text-on-surface dark:text-white">{m.dataset}</strong></div>
                <div><span>Last Retrained:</span> <span className="font-mono">{m.lastTrained}</span></div>
              </div>
            </div>

            <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between">
              <NavLink
                to="/ai-chat"
                state={{ initialPrompt: `Test model inferences for ${m.name}` }}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Test Inference →
              </NavLink>

              <button
                onClick={() => handleRetrain(m.id, m.name)}
                disabled={retrainingModel === m.id}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover disabled:opacity-50 transition-all shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${retrainingModel === m.id ? 'animate-spin' : ''}`} />
                <span>{retrainingModel === m.id ? 'Retraining...' : 'Retrain Pipeline'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
