import React, { useState } from 'react';
import { 
  Briefcase, 
  Building2, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Award, 
  ExternalLink,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';

export default function PlacementsView({ student, placements, onRefresh }) {
  const { showToast } = useAuth();
  const [applying, setApplying] = useState(null);

  const jobs = placements || [];

  const handleApply = async (job) => {
    setApplying(job.id);
    try {
      const res = await api.applyPlacement(job.id);
      if (res.success) {
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch (e) {}

        showToast(`Application submitted to ${job.company} for ${job.role}!`);
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      showToast('Error applying for position', 'error');
    } finally {
      setApplying(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-navy-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-brand-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Corporate Relations & Placement Cell
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Campus Placement Drives & Internships
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Tier-1 corporate hiring partners, recruitment drives, and interview round tracking
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur p-4 rounded-2xl border border-white/10 text-center min-w-[130px] self-start md:self-auto">
          <span className="text-[10px] uppercase font-bold text-brand-200">Candidate Eligibility</span>
          <p className="text-xl font-black text-amber-300 mt-0.5">CGPA: {student?.cgpa || '8.92'}</p>
          <span className="text-[10px] text-emerald-400 font-semibold">Eligible for All Drives</span>
        </div>
      </div>

      {/* Placement Drives Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => {
          const isEligible = (student?.cgpa || 8.92) >= job.cgpaCutoff;
          const hasApplied = job.studentStatus.includes('Applied') || job.studentStatus.includes('Shortlisted') || job.studentStatus.includes('Scheduled');

          return (
            <div
              key={job.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-base text-brand-700">
                      {job.company.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{job.company}</h3>
                      <p className="text-xs text-slate-400">{job.location}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    job.studentStatus.includes('Shortlisted')
                      ? 'bg-emerald-100 text-emerald-800'
                      : job.studentStatus.includes('Scheduled')
                      ? 'bg-purple-100 text-purple-800'
                      : job.studentStatus.includes('Applied')
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {job.studentStatus}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mt-2">
                  {job.role}
                </h4>

                <div className="flex items-center gap-2 mt-2 text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl w-fit">
                  <DollarSign className="w-4 h-4" /> Package: {job.package}
                </div>

                <div className="space-y-2 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  <p><strong>Eligibility:</strong> {job.eligibility}</p>
                  <p><strong>Drive Date:</strong> {job.driveDate} (Deadline: {job.deadline})</p>
                  <div>
                    <strong className="text-slate-700 block mb-1">Interview Rounds:</strong>
                    <div className="flex flex-wrap gap-1.5">
                      {job.rounds.map((r, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  Cutoff: {job.cgpaCutoff} CGPA
                </span>

                {hasApplied ? (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Application Active
                  </span>
                ) : isEligible ? (
                  <button
                    onClick={() => handleApply(job)}
                    disabled={applying === job.id}
                    className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/30 flex items-center gap-1.5 transition"
                  >
                    {applying === job.id ? 'Submitting...' : 'Apply via Placement Cell'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-xs font-bold text-slate-400">
                    Does not meet CGPA criteria
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
