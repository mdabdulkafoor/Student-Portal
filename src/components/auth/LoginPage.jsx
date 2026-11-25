import React, { useState } from 'react';
import { 
  GraduationCap, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  KeyRound, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';

export default function LoginPage() {
  const { login, showToast } = useAuth();
  const [username, setUsername] = useState('2022CS1042');
  const [password, setPassword] = useState('student123');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Forgot Password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotInput, setForgotInput] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please provide both identification number and password.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    const res = await login(username, password);
    setSubmitting(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  const setDemoCredentials = (u, p) => {
    setUsername(u);
    setPassword(p);
    setErrorMessage('');
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!forgotInput.trim()) return;

    try {
      await api.forgotPassword(forgotInput);
      setForgotSubmitted(true);
      showToast('Password recovery instructions sent to registered email.');
    } catch (err) {
      showToast(err.message || 'Error requesting reset', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background grid and blurs */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10 border border-slate-200/20">
        
        {/* Left Side: Institutional Banner */}
        <div className="lg:col-span-5 bg-gradient-to-br from-brand-900 via-brand-800 to-navy-900 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-brand-200 text-xs font-semibold mb-6 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Accredited Autonomous Institution
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white shadow-inner">
                <GraduationCap className="w-7 h-7 text-amber-300" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Apex Institute of Technology</h1>
                <p className="text-xs text-brand-200">Excellence in Academic Innovation</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 mt-4 leading-relaxed font-normal">
              Unified Academic Management System providing real-time access to attendance, examination results, timetable, course assignments, fee accounts, and institutional communication.
            </p>
          </div>

          <div className="relative z-10 mt-10 pt-6 border-t border-white/10 space-y-3">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Multi-Role Access (Student, Faculty & Admin)</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Real-Time Attendance & Internal Grade Analytics</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Certified PDF Marksheet & Fee Receipt Generation</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign In to Portal</h2>
              <p className="text-sm text-slate-500 mt-1">
                Enter your registered ID / Register Number and password.
              </p>
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-700 text-xs font-semibold animate-fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Student ID / Register No / Staff ID
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. 2022CS1042 or admin"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => { setShowForgotModal(true); setForgotSubmitted(false); }}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition disabled:opacity-70 mt-2"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Authenticate & Access Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Logins Helper */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-brand-600" />
                Quick 1-Click Demo Profiles:
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDemoCredentials('2022CS1042', 'student123')}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    username === '2022CS1042'
                      ? 'bg-blue-50/80 border-brand-300 text-brand-900 ring-2 ring-brand-500/20'
                      : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100/70 text-slate-700'
                  }`}
                >
                  <p className="text-[11px] font-bold">🎓 Student</p>
                  <p className="text-[10px] text-slate-500 truncate">Alex Morgan (CSE)</p>
                </button>

                <button
                  type="button"
                  onClick={() => setDemoCredentials('FAC-CS-101', 'faculty123')}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    username === 'FAC-CS-101'
                      ? 'bg-blue-50/80 border-brand-300 text-brand-900 ring-2 ring-brand-500/20'
                      : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100/70 text-slate-700'
                  }`}
                >
                  <p className="text-[11px] font-bold">👨‍🏫 Faculty</p>
                  <p className="text-[10px] text-slate-500 truncate">Dr. Sarah Jenkins</p>
                </button>

                <button
                  type="button"
                  onClick={() => setDemoCredentials('admin', 'admin123')}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    username === 'admin'
                      ? 'bg-blue-50/80 border-brand-300 text-brand-900 ring-2 ring-brand-500/20'
                      : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100/70 text-slate-700'
                  }`}
                >
                  <p className="text-[11px] font-bold">🛡️ Admin</p>
                  <p className="text-[10px] text-slate-500 truncate">Registrar Arthur</p>
                </button>
              </div>
            </div>

            {/* Footer Support Tag */}
            <div className="mt-5 text-center">
              <p className="text-xs text-slate-400">
                Facing login issues? Contact IT Desk: <span className="font-semibold text-slate-600">helpdesk@apexuniv.edu</span>
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Reset Portal Password</h3>
                <p className="text-xs text-slate-500">Security Verification</p>
              </div>
            </div>

            {forgotSubmitted ? (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs leading-relaxed border border-emerald-200">
                  <p className="font-bold mb-1">Check your inbox!</p>
                  A secure 6-digit verification code and reset link has been dispatched to the email on file.
                </div>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <p className="text-xs text-slate-600">
                  Please enter your Registered Email Address or Student Register Number (e.g. 2022CS1042):
                </p>
                <input
                  type="text"
                  value={forgotInput}
                  onChange={(e) => setForgotInput(e.target.value)}
                  placeholder="alex.morgan@apexuniv.edu or 2022CS1042"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 outline-none"
                  required
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold bg-brand-600 text-white rounded-xl hover:bg-brand-700"
                  >
                    Send Recovery Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
