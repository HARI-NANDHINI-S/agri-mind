import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  DollarSign,
  UploadCloud,
  CheckCircle2,
  Calendar,
  Layers,
  FileText,
  Building,
  CreditCard,
  Plus
} from 'lucide-react';

export default function AddExpense() {
  const { addExpense, activeFarm, showToast } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    item: '',
    category: 'Fertilizer & Soil',
    amount: '',
    field: activeFarm.currentField,
    vendor: 'AgroChem Solutions Ltd',
    paymentMethod: 'Bank Transfer',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    receipt: 'invoice_uploaded.pdf',
    tax: 0
  });

  const [uploadedFileName, setUploadedFileName] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.item || !formData.amount) {
      showToast('Please enter an expense title and amount', 'error');
      return;
    }

    const calculatedTax = (Number(formData.amount) * 0.05).toFixed(2);

    addExpense({
      ...formData,
      amount: Number(formData.amount),
      tax: Number(calculatedTax),
      receipt: uploadedFileName || 'receipt_sample.pdf',
      recordedBy: 'Aarav Patel (Lead Agronomist)'
    });

    navigate('/expenses-list');
  };

  const handleSimulateUpload = () => {
    setUploadedFileName('voucher_rec_' + Math.floor(1000 + Math.random() * 9000) + '.pdf');
    showToast('Receipt file attached successfully!', 'info');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full hover:bg-surface-container dark:hover:bg-slate-800 flex items-center justify-center text-on-surface-variant transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[11px] font-bold text-primary uppercase tracking-widest">
              Farm Financial Ledger
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-on-surface dark:text-white">
              Log New Farm Expense
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/expenses')}
          className="text-xs font-semibold text-on-surface-variant hover:text-on-surface px-3 py-2"
        >
          Cancel
        </button>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/40 dark:border-slate-800 shadow-sm space-y-6">
        {/* Expense Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-on-surface-variant dark:text-slate-300 uppercase tracking-wider">
            Expense Item / Voucher Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Urea 46% Top-Dressing (40 Bags)"
            value={formData.item}
            onChange={(e) => setFormData({ ...formData, item: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/50 text-sm text-on-surface dark:text-white focus:outline-none focus:border-primary"
          />
        </div>

        {/* Amount & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant dark:text-slate-300 uppercase tracking-wider">
              Amount (₹) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">₹</span>
              <input
                type="number"
                required
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/50 text-sm text-on-surface dark:text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant dark:text-slate-300 uppercase tracking-wider">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/50 text-sm text-on-surface dark:text-white focus:outline-none focus:border-primary"
            >
              <option value="Fertilizer & Soil">Fertilizer & Soil</option>
              <option value="Seeds & Propagation">Seeds & Propagation</option>
              <option value="Fuel & Machinery">Fuel & Machinery</option>
              <option value="Labor & Contracting">Labor & Contracting</option>
              <option value="Irrigation & Water">Irrigation & Water</option>
              <option value="Pesticides & Crop Health">Pesticides & Crop Health</option>
              <option value="Logistics & Storage">Logistics & Storage</option>
            </select>
          </div>
        </div>

        {/* Field & Vendor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant dark:text-slate-300 uppercase tracking-wider">
              Target Field / Plot
            </label>
            <select
              value={formData.field}
              onChange={(e) => setFormData({ ...formData, field: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/50 text-sm text-on-surface dark:text-white focus:outline-none focus:border-primary"
            >
              <option value="Field 4B - North Sector (Wheat)">Field 4B - North Sector (Wheat)</option>
              <option value="Field 2A - South Ridge (Maize)">Field 2A - South Ridge (Maize)</option>
              <option value="Field 1C - Orchard Block">Field 1C - Orchard Block</option>
              <option value="Field 3A - Pulse Plot">Field 3A - Pulse Plot</option>
              <option value="All Fields (Central Hub)">All Fields (Central Hub)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant dark:text-slate-300 uppercase tracking-wider">
              Vendor / Supplier
            </label>
            <input
              type="text"
              placeholder="e.g. AgroChem Solutions Ltd"
              value={formData.vendor}
              onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/50 text-sm text-on-surface dark:text-white focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Date & Payment Method */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant dark:text-slate-300 uppercase tracking-wider">
              Transaction Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/50 text-sm text-on-surface dark:text-white focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant dark:text-slate-300 uppercase tracking-wider">
              Payment Method
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/50 text-sm text-on-surface dark:text-white focus:outline-none focus:border-primary"
            >
              <option value="Bank Transfer">Bank Transfer / NEFT</option>
              <option value="Corporate Card">Corporate Card</option>
              <option value="UPI / Direct">UPI / Direct Mobile Pay</option>
              <option value="Vendor Credit">Vendor 30-Day Credit</option>
              <option value="Cash Voucher">Cash Voucher</option>
            </select>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-on-surface-variant dark:text-slate-300 uppercase tracking-wider">
            Operational Notes & Calibration
          </label>
          <textarea
            rows={3}
            placeholder="Describe specific application dosage, batch number, or field reasons..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full p-3 rounded-xl bg-surface-container-low dark:bg-slate-800 border border-outline-variant/50 text-sm text-on-surface dark:text-white focus:outline-none focus:border-primary resize-none"
          />
        </div>

        {/* Receipt Upload Dropzone */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-on-surface-variant dark:text-slate-300 uppercase tracking-wider">
            Invoice / Receipt Attachment
          </label>
          <div
            onClick={handleSimulateUpload}
            className="w-full border-2 border-dashed border-outline-variant dark:border-slate-700 hover:border-primary rounded-2xl p-6 flex flex-col items-center justify-center bg-surface-container-low/40 dark:bg-slate-800/40 cursor-pointer group transition-colors"
          >
            <UploadCloud className="w-8 h-8 text-on-surface-variant group-hover:text-primary mb-2 transition-colors" />
            <p className="text-xs text-on-surface dark:text-slate-200 font-semibold text-center">
              {uploadedFileName ? (
                <span className="text-primary font-bold">Attached: {uploadedFileName}</span>
              ) : (
                <>Click to upload invoice or drag and drop<br /><span className="text-[11px] font-normal text-on-surface-variant">PDF, PNG, JPG up to 10MB</span></>
              )}
            </p>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/expenses-list')}
            className="px-5 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Save & Record Expense</span>
          </button>
        </div>
      </form>
    </div>
  );
}
