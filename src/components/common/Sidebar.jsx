import React from 'react';
import {
  LayoutDashboard,
  UserCheck,
  CalendarCheck2,
  FileSpreadsheet,
  Clock,
  BookOpenCheck,
  Bell,
  CreditCard,
  FileText,
  MessageSquare,
  Users,
  Award,
  UploadCloud,
  FileCheck,
  Building2,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Shield,
  HelpCircle,
  GraduationCap,
  Calendar,
  BookMarked,
  Home,
  FileCheck2,
  Briefcase,
  Star
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isOpen, onToggle, activeTab, setActiveTab }) {
  const { role, profile } = useAuth();

  // Navigation configurations based on user role
  const studentNavItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'profile', label: 'My Profile', icon: UserCheck, badge: null },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck2, badge: `${profile?.attendanceOverall || 88.4}%` },
    { id: 'results', label: 'Academic Results', icon: FileSpreadsheet, badge: 'CGPA ' + (profile?.cgpa || '8.92') },
    { id: 'examinations', label: 'Exams & Hall Ticket', icon: Calendar, badge: 'Dec 14' },
    { id: 'timetable', label: 'Timetable', icon: Clock, badge: 'Today' },
    { id: 'assignments', label: 'Assignments', icon: BookOpenCheck, badge: '2 Due' },
    { id: 'library', label: 'Digital Library', icon: BookMarked, badge: '3 Books' },
    { id: 'hostel', label: 'Hostel & Transport', icon: Home, badge: 'Pass' },
    { id: 'certificates', label: 'Certificates & Verif.', icon: FileCheck2, badge: 'PDF' },
    { id: 'placements', label: 'Placements & Jobs', icon: Briefcase, badge: '4 Drives' },
    { id: 'feedback', label: 'Faculty Feedback', icon: Star, badge: 'Rate' },
    { id: 'fees', label: 'Fee Management', icon: CreditCard, badge: 'Due' },
    { id: 'materials', label: 'Study Materials', icon: FileText, badge: null },
    { id: 'announcements', label: 'Announcements', icon: Bell, badge: '4' },
    { id: 'communication', label: 'Communication & Help', icon: MessageSquare, badge: null },
  ];

  const facultyNavItems = [
    { id: 'faculty-overview', label: 'Faculty Hub', icon: LayoutDashboard, badge: null },
    { id: 'faculty-attendance', label: 'Mark Attendance', icon: CalendarCheck2, badge: 'Live' },
    { id: 'faculty-materials', label: 'Upload Materials', icon: UploadCloud, badge: null },
    { id: 'faculty-assignments', label: 'Assignments & Grading', icon: FileCheck, badge: '3 Pending' },
    { id: 'faculty-marks', label: 'Internal Marks Entry', icon: Award, badge: null },
    { id: 'faculty-announcements', label: 'Post Announcements', icon: Bell, badge: null },
    { id: 'communication', label: 'Student Messages', icon: MessageSquare, badge: null },
  ];

  const adminNavItems = [
    { id: 'admin-overview', label: 'Admin Dashboard', icon: BarChart3, badge: null },
    { id: 'admin-students', label: 'Student Accounts', icon: Users, badge: null },
    { id: 'admin-faculty', label: 'Faculty Roster', icon: GraduationCap, badge: null },
    { id: 'admin-departments', label: 'Depts & Courses', icon: Building2, badge: null },
    { id: 'admin-fees', label: 'Fee Collections', icon: CreditCard, badge: null },
    { id: 'admin-announcements', label: 'Campus Notices', icon: Bell, badge: null },
    { id: 'admin-complaints', label: 'Grievance Desk', icon: HelpCircle, badge: '2 Open' },
    { id: 'admin-reports', label: 'Executive Reports', icon: FileSpreadsheet, badge: 'Export' },
  ];

  const navItems = role === 'faculty' ? facultyNavItems : role === 'admin' ? adminNavItems : studentNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onToggle}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-200 transition-transform duration-300 ease-in-out flex flex-col border-r border-slate-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-600/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-sm tracking-wide">APEX PORTAL</span>
              <span className="block text-[10px] text-brand-400 font-semibold uppercase tracking-wider">
                {role.toUpperCase()} PANEL
              </span>
            </div>
          </div>

          <button 
            onClick={onToggle}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 lg:hidden"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Academic Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) onToggle();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-400'
                  }`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-slate-800 text-brand-300 border border-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Profile Snippet */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-850 border border-slate-800/80">
            <img 
              src={profile?.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
              alt="Avatar"
              className="w-9 h-9 rounded-lg object-cover ring-1 ring-slate-700"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {profile?.name || 'Alex Morgan'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {role === 'student' ? (profile?.department || 'CSE Dept') : (profile?.designation || role)}
              </p>
            </div>
            {role === 'student' && (
              <span className="text-[10px] bg-brand-500/20 text-brand-300 font-bold px-1.5 py-0.5 rounded">
                Y3
              </span>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
