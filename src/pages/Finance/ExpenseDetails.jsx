import React from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  FileText,
  Download,
  Printer,
  CheckCircle2,
  Calendar,
  Building,
  CreditCard,
  UserCheck,
  Bot,
  AlertCircle,
  Tag,
  DollarSign
} from 'lucide-react';

export default function ExpenseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { expenses, showToast } = useApp();

  const expense = expenses.find(e => e.id === id) || expenses[0];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    showToast(`Downloading voucher #${expense.id} as verified PDF...`, 'info');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
              <span className="text-[11px] font-bold text-primary uppercase tracking-widest">
                Expense Voucher Details
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {expense.status}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-on-surface dark:text-white">
              Voucher #{expense.id}: {expense.item}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container dark:bg-slate-800 hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container dark:bg-slate-800 hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
          <NavLink
            to="/ai-chat"
            state={{ initialPrompt: `Analyze this expense: ${expense.item} of ₹${expense.amount} for ${expense.field}` }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm transition-all"
          >
            <Bot className="w-4 h-4" />
            <span>Ask AI</span>
          </NavLink>
        </div>
      </div>

      {/* Main Voucher Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm space-y-6">
        {/* Top Summary Banner */}
        <div className="p-4 rounded-xl bg-surface-container-low dark:bg-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-on-surface-variant">Net Voucher Payable</span>
            <div className="text-3xl font-bold text-primary dark:text-emerald-400 mt-1">
              ₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-on-surface-variant">Includes estimated GST / Local duties</span>
          </div>

          <div className="text-left sm:text-right text-xs space-y-1">
            <div><span className="text-on-surface-variant">Transaction Date:</span> <strong className="text-on-surface dark:text-white">{expense.date}</strong></div>
            <div><span className="text-on-surface-variant">Payment Mode:</span> <strong className="text-on-surface dark:text-white">{expense.paymentMethod}</strong></div>
            <div><span className="text-on-surface-variant">Recorded By:</span> <strong className="text-on-surface dark:text-white">{expense.recordedBy || 'Farm Agronomist'}</strong></div>
          </div>
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="p-4 rounded-xl bg-surface dark:bg-slate-800/40 border border-outline-variant/30 space-y-3">
            <h3 className="font-bold text-on-surface dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Building className="w-4 h-4 text-primary" />
              <span>Vendor & Procurement Info</span>
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-outline-variant/20">
                <span className="text-on-surface-variant">Supplier Name:</span>
                <span className="font-semibold text-on-surface dark:text-white">{expense.vendor}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/20">
                <span className="text-on-surface-variant">Target Field:</span>
                <span className="font-semibold text-on-surface dark:text-white">{expense.field}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-on-surface-variant">Category:</span>
                <span className="font-semibold text-primary">{expense.category}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface dark:bg-slate-800/40 border border-outline-variant/30 space-y-3">
            <h3 className="font-bold text-on-surface dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-primary" />
              <span>Receipt & Compliance</span>
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-outline-variant/20">
                <span className="text-on-surface-variant">Receipt Attached:</span>
                <span className="font-mono text-primary font-semibold">{expense.receipt}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/20">
                <span className="text-on-surface-variant">Tax Calculated:</span>
                <span className="font-semibold text-on-surface dark:text-white">₹{expense.tax || (expense.amount * 0.05).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-on-surface-variant">Audit Verification:</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Validated
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Notes */}
        <div className="p-4 rounded-xl bg-surface-container-low dark:bg-slate-800/60 border border-outline-variant/30 space-y-2">
          <h4 className="text-xs font-bold text-on-surface dark:text-white uppercase tracking-wider">
            Agronomy & Calibration Notes
          </h4>
          <p className="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed">
            {expense.notes || 'Purchased directly through approved agri-input distributor. Applied in accordance with Soil Nitrogen deficit telemetry recommendations.'}
          </p>
        </div>

        {/* Audit Trail Timeline */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Audit Trail & Approval History
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-surface dark:bg-slate-800/40">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <div className="flex-1">
                <span className="font-semibold text-on-surface dark:text-white">Approved by Farm Lead Aarav Patel</span>
                <p className="text-[11px] text-on-surface-variant">Transaction cleared through digital accounting ledger</p>
              </div>
              <span className="text-[10px] text-on-surface-variant font-mono">{expense.date} 14:32</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
