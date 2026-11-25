import React, { useState } from 'react';
import { 
  Home, 
  Bus, 
  Key, 
  User, 
  Phone, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Plus, 
  X,
  MapPin,
  Utensils
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';

export default function HostelTransportView({ student, hostelTransport, onRefresh }) {
  const { showToast } = useAuth();
  const [gatePassModal, setGatePassModal] = useState(false);
  const [passType, setPassType] = useState('Day Outing');
  const [passDate, setPassDate] = useState(new Date().toISOString().split('T')[0]);
  const [outTime, setOutTime] = useState('10:00 AM');
  const [inTime, setInTime] = useState('08:00 PM');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const ht = hostelTransport || { hostel: {}, gatePasses: [], transport: {} };
  const h = ht.hostel || {};
  const t = ht.transport || {};
  const passes = ht.gatePasses || [];

  const handleApplyGatePass = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.applyGatePass({
        studentId: student?.id,
        type: passType,
        date: passDate,
        outTime,
        inTime,
        reason
      });

      if (res.success) {
        showToast('Outing gate pass generated and authorized!');
        setGatePassModal(false);
        setReason('');
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      showToast('Error applying for gate pass', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Campus Residence & Transport Services
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Hostel room allocation, dining meal plans, security gate passes, and campus transit tracking
          </p>
        </div>

        <button
          onClick={() => setGatePassModal(true)}
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/30 flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Request Outing Gate Pass
        </button>
      </div>

      {/* 1. Residence & Transport Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Hostel Residence Box */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Hostel Allocation</h3>
                  <p className="text-xs text-slate-400">On-Campus Student Housing</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                Allocated
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Residence Block</span>
                <span className="font-bold text-slate-800">{h.blockName || 'Block B (Aryabhata Residence)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Room Details</span>
                <span className="font-bold text-brand-600">{h.roomNumber || 'Room 304 (AC Double)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Roommate</span>
                <span className="font-semibold text-slate-800">{h.roommate || 'Kevin Zhao (3rd Year CSE)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hostel Warden</span>
                <span className="font-semibold text-slate-800">{h.wardenName} ({h.wardenPhone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Dining Meal Plan</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Utensils className="w-3.5 h-3.5 text-amber-500" /> Full 7-Day All-Access
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            For maintenance requests or room inspection, contact Residence Office at extension #4100.
          </div>
        </div>

        {/* Campus Transport Box */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Bus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Campus Transit Route</h3>
                  <p className="text-xs text-slate-400">Designated Institutional Bus Pass</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                Active Pass
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Designated Route</span>
                <span className="font-bold text-slate-800">{t.busRoute || 'Route 12: Metro Express'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Vehicle Registration</span>
                <span className="font-bold text-brand-600">{t.busNumber || 'APEX-BUS-12'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Morning Pickup Slot</span>
                <span className="font-semibold text-slate-800">{t.morningPickup || '07:45 AM (Civic Center)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Evening Return Slot</span>
                <span className="font-semibold text-slate-800">{t.eveningDrop || '05:15 PM (Campus Gate)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Driver</span>
                <span className="font-semibold text-slate-800">{t.driverName} ({t.driverPhone})</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Emergency Transit Assistance: +1 (555) 789-3321
          </div>
        </div>

      </div>

      {/* 2. Gate Passes Log */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <h3 className="font-bold text-slate-900 text-base">Security Outing & Leave Gate Passes</h3>
          <span className="text-xs text-slate-400">{passes.length} Passes Issued</span>
        </div>

        <div className="space-y-3">
          {passes.map((pass) => (
            <div key={pass.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-brand-700">{pass.id}</span>
                  <span className="font-bold text-slate-800">{pass.type}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {pass.status}
                  </span>
                </div>
                <p className="text-slate-600 mt-1">Reason: {pass.reason}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Approved by: {pass.approvedBy}</p>
              </div>

              <div className="text-right text-xs">
                <p className="font-bold text-slate-800">Date: {pass.date}</p>
                <p className="text-slate-500">{pass.outTime} → {pass.inTime}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gate Pass Modal */}
      {gatePassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Request Security Gate Pass</h3>
              <button onClick={() => setGatePassModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyGatePass} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pass Type</label>
                <select
                  value={passType}
                  onChange={(e) => setPassType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  <option value="Day Outing">Day Outing (Return same day)</option>
                  <option value="Weekend Home Leave">Weekend Home Leave</option>
                  <option value="Medical Emergency Leave">Medical Emergency Leave</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={passDate}
                  onChange={(e) => setPassDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Departure Time</label>
                  <input
                    type="text"
                    value={outTime}
                    onChange={(e) => setOutTime(e.target.value)}
                    placeholder="10:00 AM"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Expected Return Time</label>
                  <input
                    type="text"
                    value={inTime}
                    onChange={(e) => setInTime(e.target.value)}
                    placeholder="08:00 PM"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Outing / Destination</label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Study group session at City Central Library..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setGatePassModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600">Cancel</button>
                <button type="submit" disabled={submitting} className="px-5 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
