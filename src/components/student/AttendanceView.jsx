import React, { useState } from 'react';
import { 
  CalendarCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Info,
  Calendar,
  Filter
} from 'lucide-react';

export default function AttendanceView({ student, attendance, logs }) {
  const [filterSubject, setFilterSubject] = useState('ALL');

  const subjectList = attendance || [];
  const logList = logs || [];

  const overall = student?.attendanceOverall || 88.4;
  const filteredLogs = filterSubject === 'ALL' 
    ? logList 
    : logList.filter(l => l.courseCode === filterSubject);

  const lowAttendanceSubjects = subjectList.filter(s => s.percentage < 75);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header & Overall Attendance Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Overall Percentage Hero Card (5 cols) */}
        <div className="md:col-span-5 bg-gradient-to-br from-brand-900 to-navy-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-300">
                Attendance Standing
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                overall >= 85 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {overall >= 75 ? 'Eligible for Exams' : 'Attendance Shortage'}
              </span>
            </div>

            <div className="flex items-center gap-6 my-2">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-700/60"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-brand-400"
                    strokeDasharray={`${overall}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-black text-white">{overall}%</span>
                  <span className="block text-[9px] text-slate-300 font-bold uppercase">Aggregate</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                <p>Total Classes: <strong className="text-white">208</strong></p>
                <p>Classes Attended: <strong className="text-emerald-400">182</strong></p>
                <p>Classes Missed: <strong className="text-rose-400">26</strong></p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-xs text-brand-200">
            <p>Institutional Policy: <strong>75% minimum attendance</strong> required per course to appear in end-semester university examinations.</p>
          </div>
        </div>

        {/* Attendance Visual Bar Chart (7 cols) */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Subject Attendance Progress</h3>
                <p className="text-xs text-slate-400">Comparison with 75% required benchmark</p>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-brand-600"></span> Attended
                <span className="inline-block w-2.5 h-0.5 bg-rose-500"></span> 75% Goal
              </div>
            </div>

            <div className="space-y-3.5">
              {subjectList.map((subj) => (
                <div key={subj.courseCode} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800">{subj.courseCode} - {subj.courseName}</span>
                    <span className={subj.percentage >= 85 ? 'text-emerald-600' : subj.percentage >= 75 ? 'text-brand-600' : 'text-rose-600 font-bold'}>
                      {subj.attendedClasses}/{subj.totalClasses} ({subj.percentage}%)
                    </span>
                  </div>
                  <div className="relative w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-700 ${
                        subj.percentage >= 85 ? 'bg-emerald-500' : subj.percentage >= 75 ? 'bg-brand-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${subj.percentage}%` }}
                    />
                    {/* 75% indicator line */}
                    <div className="absolute top-0 bottom-0 left-[75%] w-0.5 bg-rose-400/80 pointer-events-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {lowAttendanceSubjects.length > 0 && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-800 font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                Attention: Course <strong>{lowAttendanceSubjects.map(s => s.courseCode).join(', ')}</strong> is approaching the 75% threshold. Do not miss upcoming sessions.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Subject-wise Attendance Breakdown Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Course Attendance Summary</h3>
            <p className="text-xs text-slate-400">Detailed lecture count and status per course</p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl font-bold self-start sm:self-auto">
            Semester 5 • Regular Session
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-5">Course Code</th>
                <th className="py-3 px-5">Course Title</th>
                <th className="py-3 px-5 text-center">Conducted</th>
                <th className="py-3 px-5 text-center">Attended</th>
                <th className="py-3 px-5 text-center">Percentage</th>
                <th className="py-3 px-5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {subjectList.map((item) => (
                <tr key={item.courseCode} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-5 font-bold text-brand-700">{item.courseCode}</td>
                  <td className="py-3.5 px-5 text-slate-800 font-semibold">{item.courseName}</td>
                  <td className="py-3.5 px-5 text-center font-bold text-slate-600">{item.totalClasses}</td>
                  <td className="py-3.5 px-5 text-center font-bold text-emerald-600">{item.attendedClasses}</td>
                  <td className="py-3.5 px-5 text-center font-black text-slate-900">{item.percentage}%</td>
                  <td className="py-3.5 px-5 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.percentage >= 90
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : item.percentage >= 75
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {item.percentage >= 90 ? 'Excellent' : item.percentage >= 75 ? 'Satisfactory' : 'Critical'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Detailed Daily Attendance Logs */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Daily Attendance History Logs</h3>
              <p className="text-xs text-slate-400">Chronological attendance entry recorded by faculty</p>
            </div>
          </div>

          {/* Filter by course */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="ALL">All Courses</option>
              {subjectList.map(s => (
                <option key={s.courseCode} value={s.courseCode}>{s.courseCode} - {s.courseName}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4">Course</th>
                <th className="py-2.5 px-4">Time Slot</th>
                <th className="py-2.5 px-4">Instructor</th>
                <th className="py-2.5 px-4 text-center">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-bold text-slate-800">{log.date}</td>
                  <td className="py-3 px-4 font-bold text-brand-600">{log.courseCode}</td>
                  <td className="py-3 px-4 text-slate-500">{log.slot}</td>
                  <td className="py-3 px-4 text-slate-700">{log.faculty}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      log.status === 'Present'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}>
                      {log.status === 'Present' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      )}
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
