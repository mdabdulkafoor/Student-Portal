import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  HelpCircle, 
  User, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  X,
  FileQuestion,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';

export default function CommunicationView({ student, messages, complaints, onRefresh }) {
  const { showToast } = useAuth();
  const [activeTab, setActiveTab] = useState('MESSAGES'); // MESSAGES or COMPLAINTS
  
  // Messaging state
  const [selectedFaculty, setSelectedFaculty] = useState('FAC101');
  const [messageSubject, setMessageSubject] = useState('');
  const [messageText, setMessageText] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  // Complaints / Grievance state
  const [complaintModalOpen, setComplaintModalOpen] = useState(false);
  const [complaintCategory, setComplaintCategory] = useState('Academic & Curriculum');
  const [complaintSubject, setComplaintSubject] = useState('');
  const [complaintDescription, setComplaintDescription] = useState('');
  const [complaintPriority, setComplaintPriority] = useState('Medium');
  const [submittingComplaint, setSubmittingComplaint] = useState(false);

  const facultyOptions = [
    { id: 'FAC101', name: 'Dr. Sarah Jenkins (HOD CSE)', courses: 'CS501, CS503' },
    { id: 'FAC102', name: 'Prof. David Chen (Associate Professor)', courses: 'CS502, CS504' }
  ];

  const facultyMessages = (messages || []).filter(m => m.facultyId === selectedFaculty);
  const currentFaculty = facultyOptions.find(f => f.id === selectedFaculty) || facultyOptions[0];

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setSendingMsg(true);
    try {
      const res = await api.sendMessage({
        studentId: student.id,
        facultyId: selectedFaculty,
        facultyName: currentFaculty.name,
        sender: 'student',
        subject: messageSubject || 'Academic Consultation',
        text: messageText
      });

      if (res.success) {
        showToast('Message dispatched to faculty advisor!');
        setMessageText('');
        setMessageSubject('');
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      showToast(err.message || 'Failed to send message', 'error');
    } finally {
      setSendingMsg(false);
    }
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    if (!complaintSubject.trim() || !complaintDescription.trim()) return;

    setSubmittingComplaint(true);
    try {
      const res = await api.submitComplaint({
        studentId: student.id,
        studentName: student.name,
        category: complaintCategory,
        subject: complaintSubject,
        description: complaintDescription,
        priority: complaintPriority
      });

      if (res.success) {
        showToast('Grievance ticket created. Institutional reference generated.');
        setComplaintModalOpen(false);
        setComplaintSubject('');
        setComplaintDescription('');
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      showToast(err.message || 'Error lodging grievance', 'error');
    } finally {
      setSubmittingComplaint(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header and Mode Selector */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Institutional Communication & Support
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Direct faculty consultation channels and formal institutional grievance helpdesk
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('MESSAGES')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'MESSAGES'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Faculty Advisor Messaging
          </button>
          <button
            onClick={() => setActiveTab('COMPLAINTS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'COMPLAINTS'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Helpdesk & Complaints
          </button>
        </div>
      </div>

      {/* VIEW 1: FACULTY MESSAGING */}
      {activeTab === 'MESSAGES' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Faculty Selector (4 cols) */}
          <div className="md:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400 mb-2">
              Assigned Faculty Mentors
            </h3>
            {facultyOptions.map((fac) => (
              <div
                key={fac.id}
                onClick={() => setSelectedFaculty(fac.id)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                  selectedFaculty === fac.id
                    ? 'bg-blue-50/80 border-brand-500 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                    selectedFaculty === fac.id ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {fac.name.split(' ')[1]?.charAt(0) || 'F'}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{fac.name}</h4>
                    <p className="text-[11px] text-slate-400">Courses: {fac.courses}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Conversation Thread (8 cols) */}
          <div className="md:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between min-h-[480px]">
            <div>
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{currentFaculty.name}</h3>
                  <p className="text-xs text-slate-400">Faculty Office: Engineering Block A • Office Hours Active</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Available Online
                </span>
              </div>

              {/* Messages Scrollbox */}
              <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-2">
                {facultyMessages.map((msg) => {
                  const isStudent = msg.sender === 'student';

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isStudent ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isStudent
                          ? 'bg-brand-600 text-white rounded-br-none shadow-sm'
                          : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
                      }`}>
                        {msg.subject && !isStudent && (
                          <p className="font-bold mb-1 text-[11px] text-brand-900">{msg.subject}</p>
                        )}
                        <p>{msg.text}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1">
                        {isStudent ? 'You' : msg.facultyName} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}

                {facultyMessages.length === 0 && (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No messages yet with {currentFaculty.name}. Send your academic question below!
                  </div>
                )}
              </div>
            </div>

            {/* Compose Input */}
            <form onSubmit={handleSendMessage} className="mt-4 pt-4 border-t border-slate-100 space-y-2">
              <input
                type="text"
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
                placeholder="Topic / Subject (e.g. Lab Consultation)"
                className="w-full px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 outline-none"
              />
              <div className="flex items-center gap-2">
                <textarea
                  rows={2}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message to Dr. Sarah or Prof. David..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 outline-none resize-none"
                  required
                />
                <button
                  type="submit"
                  disabled={sendingMsg}
                  className="px-4 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/30 flex items-center justify-center gap-1.5 self-stretch transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW 2: HELPDESK & GRIEVANCES */}
      {activeTab === 'COMPLAINTS' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Registered Support & Grievance Tickets</h3>
              <p className="text-xs text-slate-400">Track resolution status and institutional administrative responses</p>
            </div>
            <button
              onClick={() => setComplaintModalOpen(true)}
              className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/30 flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              Lodge New Grievance
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(complaints || []).map((cmp) => (
              <div
                key={cmp.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-brand-600">{cmp.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      cmp.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : cmp.status === 'In Progress'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {cmp.status}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    {cmp.category} • Priority: {cmp.priority}
                  </span>

                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {cmp.subject}
                  </h4>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {cmp.description}
                  </p>

                  {cmp.adminNotes && (
                    <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                      <span className="text-[10px] font-bold uppercase text-brand-700 block mb-0.5">
                        Administration Official Response:
                      </span>
                      <p className="text-slate-700">{cmp.adminNotes}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Registered: {new Date(cmp.createdAt).toLocaleDateString()}</span>
                  <span>Updated: {new Date(cmp.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Complaint Modal */}
      {complaintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Lodge Student Grievance / Request</h3>
                  <p className="text-xs text-slate-400">Recorded with Institutional Grievance Redressal Cell</p>
                </div>
              </div>
              <button 
                onClick={() => setComplaintModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleComplaintSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Grievance Category
                  </label>
                  <select
                    value={complaintCategory}
                    onChange={(e) => setComplaintCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 outline-none"
                  >
                    <option value="Academic & Curriculum">Academic & Curriculum</option>
                    <option value="IT & Network Infrastructure">IT & Network Infrastructure</option>
                    <option value="Library & Learning Resources">Library & Learning Resources</option>
                    <option value="Hostel & Amenities">Hostel & Amenities</option>
                    <option value="Fee & Bursar Accounts">Fee & Bursar Accounts</option>
                    <option value="Examinations & Marks">Examinations & Marks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Urgency Priority
                  </label>
                  <select
                    value={complaintPriority}
                    onChange={(e) => setComplaintPriority(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High (Urgent)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subject / Summary of Issue
                </label>
                <input
                  type="text"
                  value={complaintSubject}
                  onChange={(e) => setComplaintSubject(e.target.value)}
                  placeholder="e.g. Broken projector in Room 302 / WiFi disconnection"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Elaborate Description
                </label>
                <textarea
                  rows={4}
                  value={complaintDescription}
                  onChange={(e) => setComplaintDescription(e.target.value)}
                  placeholder="Provide precise details, dates, or location..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 outline-none"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setComplaintModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingComplaint}
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/30 flex items-center gap-2"
                >
                  {submittingComplaint ? 'Registering Ticket...' : 'Register Official Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
