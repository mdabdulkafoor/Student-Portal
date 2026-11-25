import React from 'react';
import { 
  Award, 
  Calendar, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  Bell, 
  CreditCard, 
  ArrowUpRight, 
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Download,
  Building,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { generateMarksheetPDF } from '../../utils/pdfGenerator';

export default function StudentOverview({ 
  student, 
  attendance, 
  results, 
  timetable, 
  assignments, 
  announcements,
  fees,
  setActiveTab 
}) {
  const { showToast } = useAuth();

  // Calculations
  const overallAttendance = student?.attendanceOverall || 88.4;
  const currentSemesterResult = results && results.length > 0 ? results[0] : null;
  const pendingAssignments = (assignments || []).filter(a => {
    const sub = (a.submissions || []).find(s => s.studentId === student?.id);
    return !sub || sub.status === 'Pending';
  });

  const todayClasses = timetable ? (timetable['Monday'] || []) : [];
  const latestNotices = (announcements || []).slice(0, 3);

  const handleDownloadLatestMarksheet = () => {
    if (student && currentSemesterResult) {
      const filename = generateMarksheetPDF(student, currentSemesterResult);
      showToast(`Downloaded ${filename} successfully!`);
    } else {
      showToast('Marksheet not available for this session', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Student Profile Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900 via-brand-800 to-navy-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(#60a5fa_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={student?.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                alt={student?.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg"
              />
              <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow">
                Active
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  {student?.name || 'Alex Morgan'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-white/10 backdrop-blur text-brand-200 border border-white/10">
                  {student?.registerNo || '2022CS1042'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
                {student?.program || 'B.Tech in Computer Science & Engineering'}
              </p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2.5 text-xs text-brand-200">
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" />
                  {student?.department}
                </span>
                <span>•</span>
                <span>{student?.year} ({student?.semester})</span>
                <span>•</span>
                <span>Section {student?.section} (Roll #{student?.rollNo})</span>
              </div>
            </div>
          </div>

          {/* Quick Action Badges */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <button
              onClick={handleDownloadLatestMarksheet}
              className="px-4 py-2.5 bg-white text-brand-900 rounded-xl text-xs font-bold hover:bg-brand-50 transition shadow-md flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-brand-700" />
              Download Marksheet
            </button>
            <button
              onClick={() => setActiveTab('fees')}
              className="px-4 py-2.5 bg-brand-700/60 hover:bg-brand-700 text-white border border-white/20 rounded-xl text-xs font-bold transition flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4 text-amber-300" />
              Fee Portal
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Percentage */}
        <div 
          onClick={() => setActiveTab('attendance')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Attendance</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition">
              <UserCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{overallAttendance}%</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> Good Standing
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                overallAttendance >= 85 ? 'bg-emerald-500' : overallAttendance >= 75 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${overallAttendance}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">
            Threshold: 75% • Total conducted: 210 hrs
          </p>
        </div>

        {/* CGPA Performance */}
        <div 
          onClick={() => setActiveTab('results')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cumulative GPA (CGPA)</span>
            <span className="p-2 bg-brand-50 text-brand-600 rounded-xl group-hover:scale-110 transition">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-brand-600">{student?.cgpa || '8.92'}</span>
            <span className="text-xs font-semibold text-slate-500">/ 10.0</span>
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-slate-100">
            <span className="text-slate-500">Total Credits Earned:</span>
            <span className="font-bold text-slate-800">{student?.totalCredits || 104}</span>
          </div>
        </div>

        {/* Pending Assignments */}
        <div 
          onClick={() => setActiveTab('assignments')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Course Assignments</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition">
              <BookOpen className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{pendingAssignments.length}</span>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
              Due This Week
            </span>
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-slate-100">
            <span className="text-slate-500">Total Active Tasks:</span>
            <span className="font-bold text-slate-800">{assignments?.length || 4} Courses</span>
          </div>
        </div>

        {/* Semester Fee Status */}
        <div 
          onClick={() => setActiveTab('fees')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fee Account Status</span>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition">
              <CreditCard className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              ${fees?.currentSemester?.pendingAmount?.toLocaleString() || '1,500'}
            </span>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
              Balance Due
            </span>
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-slate-100">
            <span className="text-slate-500">Paid: ${fees?.currentSemester?.paidAmount?.toLocaleString() || '3,000'}</span>
            <span className="font-semibold text-brand-600">Pay Now →</span>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Today's Schedule & Upcoming Examinations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Today's Schedule (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Today's Class Schedule</h3>
                <p className="text-xs text-slate-400">Monday Timetable & Lecture Halls</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('timetable')}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Full Timetable <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {todayClasses.map((item, idx) => (
              <div
                key={item.id || idx}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition ${
                  item.status === 'Live'
                    ? 'bg-blue-50/60 border-brand-300 ring-1 ring-brand-500/20'
                    : item.status === 'Completed'
                    ? 'bg-slate-50/70 border-slate-200 opacity-75'
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    item.status === 'Live'
                      ? 'bg-brand-600 text-white'
                      : item.status === 'Completed'
                      ? 'bg-slate-200 text-slate-600'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {item.courseCode}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{item.courseName}</h4>
                    <p className="text-[11px] text-slate-500">{item.faculty} • {item.room}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-bold text-slate-800">{item.time}</p>
                  <span className={`inline-block text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
                    item.status === 'Live' ? 'text-brand-600 animate-pulse' : item.status === 'Completed' ? 'text-slate-400' : 'text-emerald-600'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Examinations Countdown (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">Upcoming Examinations</h3>
                  <p className="text-xs text-slate-400">End-Semester University Finals</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                Dec 2026
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">In 21 Days</span>
                  <h4 className="text-xs font-bold text-slate-900">CS501: Advanced DBMS</h4>
                  <p className="text-[11px] text-slate-500">Dec 14, 2026 • Hall 1 • Seat #A42</p>
                </div>
                <div className="text-right text-xs font-bold text-slate-700">
                  09:30 AM
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">In 23 Days</span>
                  <h4 className="text-xs font-bold text-slate-900">CS502: Cloud Computing</h4>
                  <p className="text-[11px] text-slate-500">Dec 16, 2026 • Hall 1 • Seat #A42</p>
                </div>
                <div className="text-right text-xs font-bold text-slate-700">
                  09:30 AM
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">In 25 Days</span>
                  <h4 className="text-xs font-bold text-slate-900">CS503: AI & Machine Learning</h4>
                  <p className="text-[11px] text-slate-500">Dec 18, 2026 • Hall 2 • Seat #B18</p>
                </div>
                <div className="text-right text-xs font-bold text-slate-700">
                  09:30 AM
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Hall Ticket Release: Dec 5</span>
            <button 
              onClick={() => setActiveTab('announcements')}
              className="text-xs font-bold text-brand-600 hover:text-brand-700"
            >
              Exam Rules & Regulations →
            </button>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: Recent Announcements & Quick Study Materials */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Announcements (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Institutional Notices</h3>
                <p className="text-xs text-slate-400">Latest official circulars & events</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('announcements')}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {latestNotices.map((ann) => (
              <div 
                key={ann.id} 
                onClick={() => setActiveTab('announcements')}
                className="py-3.5 first:pt-0 last:pb-0 hover:bg-slate-50 px-2 rounded-xl transition cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    ann.priority === 'Urgent'
                      ? 'bg-rose-100 text-rose-700'
                      : ann.priority === 'Important'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {ann.category}
                  </span>
                  <span className="text-[11px] text-slate-400">{ann.date}</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
                  {ann.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {ann.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Assignment Deadlines (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Assignment Deadlines</h3>
                <p className="text-xs text-slate-400">Pending submissions</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('assignments')}
              className="text-xs font-bold text-brand-600 hover:text-brand-700"
            >
              Upload →
            </button>
          </div>

          <div className="space-y-3">
            {(assignments || []).slice(0, 3).map((asg) => {
              const sub = (asg.submissions || []).find(s => s.studentId === student?.id);
              const isSubmitted = sub && sub.status === 'Submitted';
              const isGraded = sub && sub.status === 'Graded';

              return (
                <div 
                  key={asg.id}
                  onClick={() => setActiveTab('assignments')}
                  className="p-3 rounded-xl border border-slate-200/80 hover:border-brand-300 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-brand-600">{asg.courseCode}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isGraded 
                        ? 'bg-emerald-100 text-emerald-800'
                        : isSubmitted 
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isGraded ? `Graded: ${sub.grade}/${asg.maxMarks}` : isSubmitted ? 'Submitted' : 'Pending Submission'}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mt-1 line-clamp-1">{asg.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Faculty: {asg.facultyName}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
