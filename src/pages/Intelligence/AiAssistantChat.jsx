import React, { useState, useRef, useEffect } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Bot,
  Send,
  User,
  Sparkles,
  Paperclip,
  Mic,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Layers,
  HelpCircle,
  Zap
} from 'lucide-react';

export default function AiAssistantChat() {
  const { chatMessages, sendChatMessage, activeFarm, showToast } = useApp();
  const location = useLocation();
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [attachedImage, setAttachedImage] = useState(null);
  const messagesEndRef = useRef(null);

  // If initialPrompt was passed via state from another page
  useEffect(() => {
    if (location.state?.initialPrompt) {
      sendChatMessage(location.state.initialPrompt);
    }
  }, [location.state]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!input.trim() && !attachedImage) return;

    let fullText = input;
    if (attachedImage) {
      fullText = `[Image Attached: ${attachedImage.name}] ${input || 'Please analyze this crop leaf photo for disease diagnosis.'}`;
      setAttachedImage(null);
    }

    sendChatMessage(fullText);
    setInput('');
  };

  const handleVoiceToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      showToast('Listening... Speak your agronomy query', 'info');
      setTimeout(() => {
        setIsRecording(false);
        setInput("What is the current soil moisture and evapotranspiration rate in Field 4B?");
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  const handleImageAttach = () => {
    setAttachedImage({ name: 'wheat_leaf_rust_sample_0816.jpg', size: '1.8 MB' });
    showToast('Photo attached. Ready for AI Computer Vision analysis.', 'info');
  };

  const quickPrompts = [
    { title: 'Top-dress timing', query: 'When should I apply Urea top-dressing given this week rain forecast?' },
    { title: 'Yellow Rust Protocol', query: 'What fungicide protocol halts Yellow Rust in wheat canopy?' },
    { title: 'Mandi Price Forecast', query: 'Will wheat price at Indore Mandi cross ₹2,650 in the next 15 days?' },
    { title: 'Field 4B ROI', query: 'Calculate net profit per acre for Field 4B based on current logged expenses.' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Main Chat Box */}
      <div className="flex-1 flex flex-col bg-surface-container-lowest dark:bg-slate-900 rounded-2xl border border-outline-variant/40 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-outline-variant/40 dark:border-slate-800 flex items-center justify-between bg-surface-container-low/40 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-sm text-on-surface dark:text-white">AgriMind AI Agronomist</h1>
                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  Online • Vision & Telemetry Active
                </span>
              </div>
              <p className="text-xs text-on-surface-variant dark:text-slate-400">
                Trained on agronomy datasets, micro-climate radars & national mandi trade curves
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-on-surface-variant font-medium">Context:</span>
            <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-surface-container dark:bg-slate-800 text-primary dark:text-emerald-400">
              {activeFarm.currentField}
            </span>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
          {chatMessages.map((msg) => {
            const isAI = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    isAI 
                      ? 'bg-primary text-white' 
                      : 'bg-emerald-700 text-white font-bold text-xs'
                  }`}
                >
                  {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl p-4 text-xs leading-relaxed space-y-2.5 ${
                    isAI
                      ? 'bg-surface-container-low dark:bg-slate-800 border border-outline-variant/30 text-on-surface dark:text-slate-200'
                      : 'bg-primary text-white shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 text-[10px] opacity-70">
                    <span className="font-semibold">{isAI ? 'AgriMind Copilot' : 'You'}</span>
                    <span>{msg.time}</span>
                  </div>

                  <p className="whitespace-pre-line text-sm">{msg.text}</p>

                  {/* If Actionable Suggestions */}
                  {isAI && msg.suggestions && (
                    <div className="pt-2 border-t border-outline-variant/30 flex flex-wrap gap-2">
                      {msg.suggestions.map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => sendChatMessage(sug)}
                          className="px-2.5 py-1 rounded-lg bg-surface-container-high dark:bg-slate-700 hover:bg-primary/20 hover:text-primary transition-all text-[11px] font-medium text-on-surface dark:text-slate-300"
                        >
                          ⚡ {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-surface-container-low/40 dark:bg-slate-900/60 border-t border-outline-variant/30 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider shrink-0">
            Suggested:
          </span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => sendChatMessage(qp.query)}
              className="text-xs px-3 py-1 rounded-full bg-surface-container-high dark:bg-slate-800 hover:bg-primary hover:text-white transition-all text-on-surface dark:text-slate-300 whitespace-nowrap shrink-0 font-medium"
            >
              {qp.title}
            </button>
          ))}
        </div>

        {/* Attached image preview pill */}
        {attachedImage && (
          <div className="mx-4 mt-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
            <span className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              <span>{attachedImage.name} ({attachedImage.size})</span>
            </span>
            <button onClick={() => setAttachedImage(null)} className="text-rose-500 hover:underline">
              Remove
            </button>
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 lg:p-4 border-t border-outline-variant/40 dark:border-slate-800 flex items-center gap-2 bg-surface-container-lowest dark:bg-slate-900">
          <button
            type="button"
            onClick={handleImageAttach}
            className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
            title="Attach Leaf Image for Crop Disease Diagnosis"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleVoiceToggle}
            className={`p-2 rounded-xl transition-colors ${
              isRecording 
                ? 'bg-rose-500 text-white animate-pulse' 
                : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
            }`}
            title="Voice query"
          >
            <Mic className="w-5 h-5" />
          </button>

          <input
            type="text"
            placeholder="Ask about fertilizer dosage, soil moisture, mandi forecast, or disease diagnosis..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-surface-container-low dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-on-surface dark:text-white placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary"
          />

          <button
            type="submit"
            disabled={!input.trim() && !attachedImage}
            className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Right Sidebar: Active Telemetry & Connected Actions */}
      <div className="w-full lg:w-80 space-y-4">
        {/* Field Sensor Snapshot */}
        <div className="p-4 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
            <h3 className="text-xs font-bold text-on-surface dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-primary" />
              <span>Active Field Context</span>
            </h3>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-outline-variant/20">
              <span className="text-on-surface-variant">Crop:</span>
              <span className="font-semibold text-on-surface dark:text-white">HD-3086 (Wheat)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-outline-variant/20">
              <span className="text-on-surface-variant">Stage:</span>
              <span className="font-semibold text-on-surface dark:text-white">Tillering (Day 48)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-outline-variant/20">
              <span className="text-on-surface-variant">Soil Nitrogen:</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">182 kg/ha (Deficit)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-on-surface-variant">Radar Rain:</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">18mm (Sunday 18:00)</span>
            </div>
          </div>

          <NavLink
            to="/ai-insights"
            className="block text-center text-xs font-semibold py-2 rounded-xl bg-primary/10 text-primary dark:bg-emerald-950 dark:text-emerald-300 hover:bg-primary/20 transition-all"
          >
            View Full AI Insight Report →
          </NavLink>
        </div>

        {/* Quick Nav links */}
        <div className="p-4 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm space-y-2">
          <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Connected Actions</h4>
          <NavLink
            to="/expenses-add"
            className="flex items-center justify-between p-2 rounded-xl hover:bg-surface-container dark:hover:bg-slate-800 text-xs font-medium text-on-surface dark:text-slate-200 transition-colors"
          >
            <span>Log Chemical / Fertilizer Expense</span>
            <ArrowRight className="w-3.5 h-3.5 text-primary" />
          </NavLink>
          <NavLink
            to="/alerts-detail/rust-field-4b"
            className="flex items-center justify-between p-2 rounded-xl hover:bg-surface-container dark:hover:bg-slate-800 text-xs font-medium text-on-surface dark:text-slate-200 transition-colors"
          >
            <span>Yellow Rust Alert Details</span>
            <ArrowRight className="w-3.5 h-3.5 text-rose-500" />
          </NavLink>
          <NavLink
            to="/price-prediction"
            className="flex items-center justify-between p-2 rounded-xl hover:bg-surface-container dark:hover:bg-slate-800 text-xs font-medium text-on-surface dark:text-slate-200 transition-colors"
          >
            <span>Price Prediction Models</span>
            <ArrowRight className="w-3.5 h-3.5 text-primary" />
          </NavLink>
        </div>
      </div>
    </div>
  );
}
