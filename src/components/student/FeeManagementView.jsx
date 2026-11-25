import React, { useState } from 'react';
import { 
  CreditCard, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Receipt, 
  ArrowRight, 
  X, 
  ShieldCheck,
  Building2,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { generateFeeReceiptPDF } from '../../utils/pdfGenerator';
import { api } from '../../api';

export default function FeeManagementView({ student, fees, onFeePaid }) {
  const { showToast } = useAuth();
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [paying, setPaying] = useState(false);

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');

  const currentSem = fees?.currentSemester || {
    semester: 'Semester 5 (2024-2025)',
    totalAmount: 4500,
    paidAmount: 3000,
    pendingAmount: 1500,
    dueDate: '2026-11-30',
    breakdown: [
      { item: 'Tuition Fee', amount: 3200, status: 'Paid ($3,000) / Balance ($200)' },
      { item: 'Laboratory & Technology Fee', amount: 650, status: 'Pending ($650)' },
      { item: 'Library & Digital Resources Fee', amount: 350, status: 'Pending ($350)' },
      { item: 'Examination & Assessment Fee', amount: 300, status: 'Pending ($300)' }
    ]
  };

  const paymentHistory = fees?.paymentHistory || [];

  const handlePayFee = async (e) => {
    e.preventDefault();
    if (currentSem.pendingAmount <= 0) return;

    setPaying(true);
    try {
      const res = await api.payFee({
        studentId: student.id,
        amount: currentSem.pendingAmount,
        paymentMethod: paymentMethod === 'CARD' ? 'Credit Card (Visa ending in 4242)' : 'Campus NetBanking Gateway',
        transactionNotes: 'Tuition & Amenities Final Semester Clearance'
      });

      if (res.success) {
        // Confetti celebration
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {}

        showToast('Fee payment confirmed! Official receipt generated.');
        setPayModalOpen(false);
        if (onFeePaid) onFeePaid();
      }
    } catch (err) {
      showToast(err.message || 'Payment processing failed', 'error');
    } finally {
      setPaying(false);
    }
  };

  const handleDownloadReceipt = (rcpt) => {
    if (student && rcpt) {
      const filename = generateFeeReceiptPDF(student, rcpt);
      showToast(`Downloaded: ${filename}`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header Banner & Fee Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Current Balance Hero (7 cols) */}
        <div className="md:col-span-7 bg-gradient-to-br from-brand-900 to-navy-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-300">
                Institutional Fee Account
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                currentSem.pendingAmount === 0 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
              }`}>
                {currentSem.pendingAmount === 0 ? 'Full Fee Cleared' : 'Pending Dues'}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight">{currentSem.semester}</h2>
            
            <div className="grid grid-cols-3 gap-3 my-5 pt-3 border-t border-white/10">
              <div>
                <span className="text-[10px] text-slate-300 font-bold uppercase">Total Assessed</span>
                <p className="text-lg sm:text-xl font-black text-white mt-0.5">${currentSem.totalAmount?.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-[10px] text-emerald-300 font-bold uppercase">Total Paid</span>
                <p className="text-lg sm:text-xl font-black text-emerald-400 mt-0.5">${currentSem.paidAmount?.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-[10px] text-amber-300 font-bold uppercase">Remaining Due</span>
                <p className="text-lg sm:text-xl font-black text-amber-300 mt-0.5">${currentSem.pendingAmount?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10 flex-wrap gap-3">
            <span className="text-xs text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Due Date: <strong>{currentSem.dueDate}</strong>
            </span>

            {currentSem.pendingAmount > 0 ? (
              <button
                onClick={() => setPayModalOpen(true)}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-emerald-500/30 flex items-center gap-1.5 transition"
              >
                <CreditCard className="w-4 h-4 text-slate-950" />
                Pay Remaining ${currentSem.pendingAmount}
              </button>
            ) : (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> All dues cleared for this semester
              </span>
            )}
          </div>
        </div>

        {/* Fee Itemization Breakdown (5 cols) */}
        <div className="md:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1">Fee Itemization</h3>
            <p className="text-xs text-slate-400 mb-4">Official breakdown of semester assessment charges</p>

            <div className="space-y-3">
              {(currentSem.breakdown || []).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                  <div>
                    <p className="font-bold text-slate-800">{item.item}</p>
                    <span className="text-[10px] text-slate-400">{item.status}</span>
                  </div>
                  <span className="font-black text-slate-900">${item.amount}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            256-Bit SSL Encrypted University Payment Gateway
          </div>
        </div>
      </div>

      {/* 2. Payment History & Official Receipts */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Payment History & Tax Receipts</h3>
            <p className="text-xs text-slate-400">All past transactions with verified digital vouchers</p>
          </div>
          <span className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-xl self-start sm:self-auto">
            {paymentHistory.length} Receipts Available
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-5">Receipt No</th>
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5">Transaction Ref</th>
                <th className="py-3 px-5">Term</th>
                <th className="py-3 px-5 text-right">Amount Paid</th>
                <th className="py-3 px-5 text-center">Status</th>
                <th className="py-3 px-5 text-center">Receipt Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {paymentHistory.map((rcpt) => (
                <tr key={rcpt.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-5 font-bold text-brand-700">{rcpt.receiptNo}</td>
                  <td className="py-3.5 px-5 text-slate-600">{rcpt.date}</td>
                  <td className="py-3.5 px-5 font-mono text-[11px] text-slate-500">{rcpt.transactionId}</td>
                  <td className="py-3.5 px-5 font-semibold text-slate-800">{rcpt.semester}</td>
                  <td className="py-3.5 px-5 text-right font-black text-slate-900 text-sm">
                    ${rcpt.amount?.toLocaleString()}.00
                  </td>
                  <td className="py-3.5 px-5 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      SUCCESS
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-center">
                    <button
                      onClick={() => handleDownloadReceipt(rcpt)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 rounded-xl font-bold transition inline-flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Online Fee Payment Modal */}
      {payModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Instant Online Fee Payment</h3>
                  <p className="text-xs text-slate-400">Apex University Bursar Office</p>
                </div>
              </div>
              <button 
                onClick={() => setPayModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePayFee} className="mt-4 space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Due Balance Payable</span>
                  <p className="text-xs font-bold text-slate-700">{currentSem.semester}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-brand-600">${currentSem.pendingAmount}</span>
                  <span className="block text-[10px] text-slate-400">USD</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Choose Payment Gateway
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
                      paymentMethod === 'CARD'
                        ? 'bg-blue-50 border-brand-500 text-brand-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    💳 Credit / Debit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NETBANKING')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
                      paymentMethod === 'NETBANKING'
                        ? 'bg-blue-50 border-brand-500 text-brand-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    🏦 Institutional NetBanking
                  </button>
                </div>
              </div>

              {paymentMethod === 'CARD' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 outline-none"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 outline-none text-center"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 outline-none text-center"
                        required
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-blue-50 rounded-xl text-xs text-blue-900 border border-blue-200">
                  <p className="font-bold">Campus Bank Direct Debit</p>
                  You will be safely routed to verify via institutional student credentials.
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setPayModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={paying}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-2"
                >
                  {paying ? 'Authorizing Payment...' : `Authorize Payment ($${currentSem.pendingAmount})`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
