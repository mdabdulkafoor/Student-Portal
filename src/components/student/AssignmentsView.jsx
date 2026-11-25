import React, { useState } from 'react';
import { 
  BookOpenCheck, 
  Calendar, 
  Clock, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Award, 
  X,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';

export default function AssignmentsView({ student, assignments, onAssignmentSubmitted }) {
  const { showToast } = useAuth();
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, SUBMITTED, GRADED
  const [selectedAsg, setSelectedAsg] = useState(null);
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [fileName, setFileName] = useState('');
  const [remarks, setRemarks] = useState('');

  const assignmentList = assignments || [];

  const filtered = assignmentList.filter(asg => {
    const sub = (asg.submissions || []).find(s => s.studentId === student?.id);
    if (filter === 'PENDING') return !sub || sub.status === 'Pending';
    if (filter === 'SUBMITTED') return sub && sub.status === 'Submitted';
    if (filter === 'GRADED') return sub && sub.status === 'Graded';
    return true;
  });

  const handleOpenSubmission = (asg) => {
    setSelectedAsg(asg);
    setFileName(`${student?.name.replace(/\s+/g, '_')}_${asg.courseCode}_Assignment.pdf`);
    setRemarks('');
    setSubmissionModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAsg || !student) return;

    setSubmitting(true);
    try {
      const res = await api.submitAssignment({
        assignmentId: selectedAsg.id,
        studentId: student.id,
        studentName: student.name,
        fileName: fileName || 'Assignment_Submission.pdf',
        fileUrl: `/uploads/${fileName || 'Assignment_Submission.pdf'}`
      });

      if (res.success) {
        showToast('Assignment submitted successfully! Status updated.');
        setSubmissionModalOpen(false);
        if (onAssignmentSubmitted) onAssignmentSubmitted();
      }
    } catch (err) {
      showToast(err.message || 'Submission failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Filter Controls */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Academic Course Assignments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track submission deadlines, submit project reports, and review faculty evaluations
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl self-start sm:self-auto">
          {['ALL', 'PENDING', 'SUBMITTED', 'GRADED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === tab
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Assignment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((asg) => {
          const sub = (asg.submissions || []).find(s => s.studentId === student?.id);
          const isSubmitted = sub && sub.status === 'Submitted';
          const isGraded = sub && sub.status === 'Graded';
          const isPending = !sub || sub.status === 'Pending';

          return (
            <div
              key={asg.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-extrabold bg-brand-50 text-brand-700 border border-brand-200/60">
                      {asg.courseCode}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold truncate">
                      {asg.courseName}
                    </span>
                  </div>

                  {/* Status Pill */}
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isGraded
                      ? 'bg-emerald-100 text-emerald-800'
                      : isSubmitted
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isGraded ? 'Evaluated' : isSubmitted ? 'Submitted' : 'Pending'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {asg.title}
                </h3>

                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                  {asg.description}
                </p>

                {/* Deadline & Max Marks */}
                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Submission Deadline</span>
                    <p className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-rose-500" />
                      {new Date(asg.deadline).toLocaleDateString()} (23:59)
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Maximum Marks</span>
                    <p className="font-bold text-slate-800 mt-0.5">{asg.maxMarks} Points</p>
                  </div>
                </div>

                {/* Faculty Evaluation Card if Graded */}
                {isGraded && (
                  <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-emerald-600" /> Score Awarded:
                      </span>
                      <span className="text-sm font-black text-emerald-700">
                        {sub.grade} / {asg.maxMarks}
                      </span>
                    </div>
                    {sub.feedback && (
                      <p className="text-emerald-800 mt-1 italic">
                        "{sub.feedback}"
                      </p>
                    )}
                    <span className="text-[10px] text-emerald-600 block mt-1 font-semibold">
                      Evaluated by {asg.facultyName}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  Faculty: {asg.facultyName}
                </span>

                {isPending && (
                  <button
                    onClick={() => handleOpenSubmission(asg)}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/30 flex items-center gap-1.5 transition"
                  >
                    <UploadCloud className="w-4 h-4" />
                    Submit Solution
                  </button>
                )}

                {isSubmitted && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Awaiting Grading
                    </span>
                    <button
                      onClick={() => handleOpenSubmission(asg)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                    >
                      Re-submit
                    </button>
                  </div>
                )}

                {isGraded && (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submission Modal */}
      {submissionModalOpen && selectedAsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Submit Assignment Solution</h3>
                  <p className="text-xs text-slate-400">{selectedAsg.courseCode} • {selectedAsg.title}</p>
                </div>
              </div>
              <button 
                onClick={() => setSubmissionModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Upload PDF or Document File
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-5 text-center bg-slate-50 hover:bg-slate-100/60 transition cursor-pointer">
                  <FileText className="w-8 h-8 text-brand-600 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">Choose submission file</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Supports PDF, DOCX, ZIP up to 25MB</p>
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="Alex_Morgan_CS502_Report.pdf"
                    className="mt-3 w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 text-center"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Student Comments / Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Additional notes for Dr. Sarah / Prof. David..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSubmissionModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/30 flex items-center gap-2"
                >
                  {submitting ? 'Uploading & Submitting...' : 'Confirm Submission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
