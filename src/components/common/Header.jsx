import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Menu, 
  X, 
  User, 
  LogOut, 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  ChevronDown,
  Calendar,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header({ onToggleSidebar, activeTab, setActiveTab }) {
  const { user, profile, role, logout, switchRole } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    { id: 1, title: 'End-Sem Exam Schedule Published', time: '10m ago', urgent: true, tab: 'announcements' },
    { id: 2, title: 'Assignment 2 graded: 19/20 in CS501', time: '1h ago', urgent: false, tab: 'assignments' },
    { id: 3, title: 'Guest Lecture by Google DeepMind Nov 27', time: '3h ago', urgent: false, tab: 'announcements' }
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-4 lg:px-6 py-2.5 flex items-center justify-between shadow-sm">
      {/* Left: Mobile hamburger & University Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 lg:hidden focus:outline-none"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-900 via-brand-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-brand-900/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-base tracking-tight font-display">
                APEX UNIVERSITY
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200/60">
                A++ Accredited
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              Institute of Technology • Academic Portal
            </p>
          </div>
        </div>
      </div>

      {/* Middle: Role Switcher Toolbar (Interactive Role Switch) */}
      <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
        <button
          onClick={() => switchRole('student')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            role === 'student'
              ? 'bg-white text-brand-700 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          Student View
        </button>
        <button
          onClick={() => switchRole('faculty')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            role === 'faculty'
              ? 'bg-white text-brand-700 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          Faculty View
        </button>
        <button
          onClick={() => switchRole('admin')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            role === 'admin'
              ? 'bg-white text-brand-700 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Admin View
        </button>
      </div>

      {/* Right: Semester Badge, Notifications, User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Semester Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Fall 2026 Active
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-xl transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-fade-in">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-sm">Notifications & Alerts</h3>
                <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-semibold">
                  3 New
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setActiveTab(n.tab);
                      setShowNotifications(false);
                    }}
                    className="p-3.5 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-800 leading-snug">
                        {n.title}
                      </p>
                      {n.urgent && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-700 rounded uppercase">
                          Urgent
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
              <div className="px-4 pt-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setActiveTab('announcements');
                    setShowNotifications(false);
                  }}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  View All Announcements →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
          >
            <img
              src={profile?.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
              alt={user?.name || 'User'}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/30"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 line-clamp-1 leading-tight">
                {user?.name || 'Alex Morgan'}
              </p>
              <p className="text-[10px] text-slate-500 font-medium capitalize">
                {role === 'student' ? (profile?.registerNo || '2022CS1042') : role}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 rounded">
                  Role: {role}
                </span>
              </div>

              {/* Mobile Role Switcher */}
              <div className="md:hidden px-3 py-2 border-b border-slate-100">
                <p className="text-[10px] font-semibold uppercase text-slate-400 mb-1">Switch View</p>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => { switchRole('student'); setShowProfileMenu(false); }}
                    className={`text-left px-2 py-1.5 rounded text-xs font-medium ${role === 'student' ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-700'}`}
                  >
                    🎓 Student View
                  </button>
                  <button
                    onClick={() => { switchRole('faculty'); setShowProfileMenu(false); }}
                    className={`text-left px-2 py-1.5 rounded text-xs font-medium ${role === 'faculty' ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-700'}`}
                  >
                    👨‍🏫 Faculty View
                  </button>
                  <button
                    onClick={() => { switchRole('admin'); setShowProfileMenu(false); }}
                    className={`text-left px-2 py-1.5 rounded text-xs font-medium ${role === 'admin' ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-700'}`}
                  >
                    🛡️ Admin View
                  </button>
                </div>
              </div>

              <div className="py-1">
                {role === 'student' && (
                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    My Student Profile
                  </button>
                )}
                <button
                  onClick={() => {
                    logout();
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
