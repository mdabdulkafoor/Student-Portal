import React, { useState } from 'react';
import { 
  Award, 
  Download, 
  Calendar, 
  FileCheck, 
  CheckCircle2, 
  Sparkles,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { generateMarksheetPDF } from '../../utils/pdfGenerator';

export default function ResultsView({ student, results }) {
  const { showToast } = useAuth();
  const resultList = results || [];
  const [selectedSemester, setSelectedSemester] = useState(
    resultList.length > 0 ? resultList[0].semester : 'Semester 5'
  );

  const activeResult = resultList.find(r => r.semester === selectedSemester) || resultList[0];

  const handleDownloadPDF = () => {
    if (student && activeResult) {
      const filename = generateMarksheetPDF(student, activeResult);
      showToast(`Generated & Downloaded: ${filename}`);
    } else {
      showToast('Error generating mark sheet PDF', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header Card with CGPA & SGPA */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-navy-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-brand-200 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Office of the Controller of Examinations
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">Academic Grade Sheets & Transcripts</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Verified cumulative academic standing for {student?.name} ({student?.registerNo})
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white/10 backdrop-blur p-4 rounded-2xl border border-white/10 text-center min-w-[100px]">
              <span className="text-[10px] uppercase font-bold text-brand-200 tracking-wider">Overall CGPA</span>
              <p className="text-2xl sm:text-3xl font-black text-amber-300 mt-0.5">{student?.cgpa || '8.92'}</p>
              <span className="text-[10px] text-slate-300">Scale of 10.0</span>
            </div>

            <div className="bg-white/10 backdrop-blur p-4 rounded-2xl border border-white/10 text-center min-w-[100px]">
              <span className="text-[10px] uppercase font-bold text-brand-200 tracking-wider">Current SGPA</span>
              <p className="text-2xl sm:text-3xl font-black text-white mt-0.5">{activeResult?.gpa || '8.95'}</p>
              <span className="text-[10px] text-slate-300">{selectedSemester}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Semester Selector Toolbar & Download Action */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 hidden md:inline">
            Select Term:
          </span>
          {resultList.map((res) => (
            <button
              key={res.semester}
              onClick={() => setSelectedSemester(res.semester)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedSemester === res.semester
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {res.semester} (GPA: {res.gpa})
            </button>
          ))}
        </div>

        <button
          onClick={handleDownloadPDF}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/30 flex items-center justify-center gap-2 transition self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          Download Mark Sheet (PDF)
        </button>
      </div>

      {/* 3. Detailed Grade Table */}
      {activeResult && (
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-900 text-base">{activeResult.semester} - Examination Report</h3>
              <p className="text-xs text-slate-400">
                Published on {activeResult.publishedDate} • Status: <span className="text-emerald-600 font-bold">{activeResult.status}</span>
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <span>Credits Registered: <strong>{activeResult.totalCredits}</strong></span>
              <span>•</span>
              <span>Credits Earned: <strong className="text-emerald-600">{activeResult.creditsEarned}</strong></span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 text-center">#</th>
                  <th className="py-3 px-4">Course Code</th>
                  <th className="py-3 px-4">Course Title</th>
                  <th className="py-3 px-4 text-center">Credits</th>
                  <th className="py-3 px-4 text-center">Internal (40)</th>
                  <th className="py-3 px-4 text-center">External (60)</th>
                  <th className="py-3 px-4 text-center">Total (100)</th>
                  <th className="py-3 px-4 text-center">Grade</th>
                  <th className="py-3 px-4 text-center">Points</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {activeResult.subjects.map((subj, idx) => (
                  <tr key={subj.code} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 text-center text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-brand-700">{subj.code}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{subj.name}</td>
                    <td className="py-3 px-4 text-center text-slate-600">{subj.credits}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-700">{subj.internal}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-700">{subj.external}</td>
                    <td className="py-3 px-4 text-center font-black text-slate-900 text-sm">{subj.total}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded font-black text-xs ${
                        subj.grade === 'O' 
                          ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                          : subj.grade === 'A+' 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {subj.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">{subj.gradePoint}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] uppercase">
                        PASS
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
            <div>
              <strong>Academic Note:</strong> Grade 'O' represents Outstanding (90-100), 'A+' represents Excellent (80-89), 'A' represents Very Good (70-79).
            </div>
            <div className="font-bold text-slate-800">
              Semester GPA: <span className="text-brand-600 text-sm">{activeResult.gpa}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
