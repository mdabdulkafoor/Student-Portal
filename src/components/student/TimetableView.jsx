import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  User, 
  Calendar, 
  BookOpen, 
  CheckCircle2, 
  Hourglass,
  Layers
} from 'lucide-react';

export default function TimetableView({ timetable }) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const [activeDay, setActiveDay] = useState('Monday');

  const schedule = (timetable && timetable[activeDay]) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Class & Lab Timetable</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fall Semester 2026 • Computer Science & Engineering (Section A)
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl self-start sm:self-auto">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeDay === day
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {day.substring(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Current Day Schedule List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{activeDay}'s Schedule</h3>
              <p className="text-xs text-slate-400">Total {schedule.length} scheduled sessions</p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
            Working Day
          </span>
        </div>

        <div className="space-y-3.5">
          {schedule.map((item, index) => {
            const isLive = item.status === 'Live';
            const isDone = item.status === 'Completed';

            return (
              <div
                key={item.id || index}
                className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isLive
                    ? 'bg-blue-50/70 border-brand-300 ring-2 ring-brand-500/20 shadow-sm'
                    : isDone
                    ? 'bg-slate-50/60 border-slate-200 opacity-80'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                {/* Left: Timing & Course Badge */}
                <div className="flex items-start sm:items-center gap-4">
                  <div className="min-w-[130px]">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
                      <Clock className="w-3.5 h-3.5 text-brand-600" />
                      <span>{item.time}</span>
                    </div>
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 uppercase tracking-wider ${
                      isLive 
                        ? 'bg-brand-600 text-white animate-pulse' 
                        : isDone 
                        ? 'bg-slate-200 text-slate-600' 
                        : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  {/* Course Details */}
                  <div className="border-l border-slate-200 pl-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200/60">
                        {item.courseCode}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">({item.type})</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{item.courseName}</h4>
                  </div>
                </div>

                {/* Right: Faculty & Classroom */}
                <div className="flex items-center gap-6 text-xs text-slate-600 self-end md:self-auto">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold text-slate-800">{item.faculty}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl font-bold text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-brand-600" />
                    <span>{item.room}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
