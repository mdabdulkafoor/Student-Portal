import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  FileText,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { generateHallTicketPDF } from '../../utils/pdfGenerator';

export default function ExaminationsView({ student, examinations }) {
  const { showToast } = useAuth();
  const exams = examinations || [];

  const handleDownloadHallTicket = () => {
    if (student) {
      const filename = generateHallTicketPDF(student, exams);
      showToast(`Downloaded Hall Ticket: ${filename}`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-navy-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-brand-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Office of the Controller of Examinations
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">University Final Examinations</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Fall Semester 2026 • Theory & Practical Assessment Schedules
          </p>
        </div>

        <button
          onClick={handleDownloadHallTicket}
          className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-navy-950 font-black rounded-xl text-xs shadow-lg shadow-amber-400/20 flex items-center gap-2 transition self-start md:self-auto"
        >
          <Download className="w-4 h-4 text-navy-950" />
          Download Admit Card (PDF)
        </button>
      </div>

      {/* Hall Ticket Candidate Info Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-5">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Candidate Examination Details</h3>
            <p className="text-xs text-slate-400">Verified institutional enrollment and hall allotment</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl self-start sm:self-auto flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Eligible for Finals
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Candidate</span>
            <p className="font-bold text-slate-800 mt-0.5">{student?.name}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Register No</span>
            <p className="font-bold text-brand-700 mt-0.5">{student?.registerNo}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Exam Center</span>
            <p className="font-bold text-slate-800 mt-0.5">Apex Main Campus (Block A)</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Designated Seat</span>
            <p className="font-bold text-brand-600 mt-0.5">EH1-A42 (Ground Floor)</p>
          </div>
        </div>
      </div>

      {/* Examination Schedule Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Course-Wise Examination Schedule</h3>
            <p className="text-xs text-slate-400">Final dates and session timings</p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
            {exams.length} Papers Scheduled
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5">Session & Time</th>
                <th className="py-3 px-5">Course Code</th>
                <th className="py-3 px-5">Course Title</th>
                <th className="py-3 px-5 text-center">Hall & Seat</th>
                <th className="py-3 px-5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {exams.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-5 font-bold text-slate-800">{item.date}</td>
                  <td className="py-3.5 px-5 text-slate-600 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-600" /> {item.time}
                  </td>
                  <td className="py-3.5 px-5 font-bold text-brand-700">{item.courseCode}</td>
                  <td className="py-3.5 px-5 font-semibold text-slate-800">{item.courseName}</td>
                  <td className="py-3.5 px-5 text-center font-bold text-slate-700">{item.hall} • {item.seatNo}</td>
                  <td className="py-3.5 px-5 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      SCHEDULED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Regulations Card */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 text-xs text-amber-900 space-y-2">
        <h4 className="font-bold flex items-center gap-2 text-sm text-amber-950">
          <AlertCircle className="w-4 h-4 text-amber-600" /> Important Examination Regulations
        </h4>
        <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
          <li>Candidates must arrive at the examination hall at least <strong>20 minutes prior</strong> to commencement.</li>
          <li>Possession of smartphones, programmable smartwatches, or loose study sheets is strictly considered academic malpractice.</li>
          <li>Carry your physical University Photo Identity Card along with the printed Hall Ticket for entry verification.</li>
        </ul>
      </div>
    </div>
  );
}
