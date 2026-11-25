import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CalendarCheck2, 
  UploadCloud, 
  FileCheck, 
  Award, 
  Bell, 
  Search, 
  Plus, 
  CheckCircle2, 
  X, 
  Clock, 
  BookOpen, 
  Edit3,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';

export default function FacultyDashboard({ activeSubTab = 'faculty-overview' }) {
  const { profile, showToast } = useAuth();
  const [tab, setTab] = useState(activeSubTab || 'faculty-overview');

  useEffect(() => {
    if (activeSubTab) setTab(activeSubTab);
  }, [activeSubTab]);

  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mark Attendance State
  const [attCourse, setAttCourse] = useState('CS501');
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [attSlot, setAttSlot] = useState('09:00 AM - 10:00 AM');
  const [studentStatuses, setStudentStatuses] = useState({});
  const [markingAtt, setMarkingAtt] = useState(false);

  // Upload Material State
  const [matModalOpen, setMatModalOpen] = useState(false);
  const [matData, setMatData] = useState({
    courseCode: 'CS501',
    courseName: 'Advanced Database Management Systems',
    title: '',
    category: 'Lecture Notes',
    fileType: 'PDF',
    fileSize: '4.2 MB',
    description: ''
  });

  // Create Assignment State
  const [asgModalOpen, setAsgModalOpen] = useState(false);
  const [newAsg, setNewAsg] = useState({
    courseCode: 'CS501',
    courseName: 'Advanced Database Management Systems',
    title: '',
    description: '',
    deadline: '2026-12-05T23:59',
    maxMarks: 20
  });

  // Grade Assignment State
  const [gradingModalOpen, setGradingModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeInput, setGradeInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');

  // Enter Internal Marks State
  const [selectedStudentForMarks, setSelectedStudentForMarks] = useState('');
  const [marksCourse, setMarksCourse] = useState('CS501');
  const [internalMarksInput, setInternalMarksInput] = useState('38');
  const [externalMarksInput, setExternalMarksInput] = useState('52');
  const [savingMarks, setSavingMarks] = useState(false);

  // Post Announcement State
  const [annModalOpen, setAnnModalOpen] = useState(false);
  const [newAnn, setNewAnn] = useState({
    title: '',
    category: 'Department',
    priority: 'Normal',
    department: 'Computer Science & Engineering',
    content: ''
  });

  useEffect(() => {
    loadFacultyData();
  }, []);

  const loadFacultyData = async () => {
    try {
      const [stuRes, asgRes] = await Promise.all([
        api.getFacultyStudents(),
        api.getAssignments()
      ]);
      setStudents(stuRes);
      setAssignments(asgRes);

      // Initialize default attendance statuses to Present
      const initialStatuses = {};
      stuRes.forEach(s => { initialStatuses[s.id] = 'Present'; });
      setStudentStatuses(initialStatuses);
      if (stuRes.length > 0) setSelectedStudentForMarks(stuRes[0].id);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAttendance = (studentId) => {
    setStudentStatuses(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'Present' ? 'Absent' : 'Present'
    }));
  };

  const handleSetAllAttendance = (status) => {
    const updated = {};
    students.forEach(s => { updated[s.id] = status; });
    setStudentStatuses(updated);
  };

  const handleSaveAttendance = async () => {
    setMarkingAtt(true);
    try {
      const records = students.map(s => ({
        studentId: s.id,
        courseCode: attCourse,
        date: attDate,
        slot: attSlot,
        status: studentStatuses[s.id] || 'Present',
        faculty: profile?.name || 'Dr. Sarah Jenkins'
      }));

      await api.markAttendance(records);
      showToast(`Saved attendance for ${records.length} students to database!`);
    } catch (e) {
      showToast('Failed to save attendance', 'error');
    } finally {
      setMarkingAtt(false);
    }
  };

  const handleUploadMaterialSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.uploadStudyMaterial({
        ...matData,
        facultyName: profile?.name || 'Dr. Sarah Jenkins',
        facultyId: profile?.id || 'FAC101'
      });
      showToast('Study material published to student portal!');
      setMatModalOpen(false);
      setMatData({ ...matData, title: '', description: '' });
    } catch (e) {
      showToast('Error uploading material', 'error');
    }
  };

  const handleCreateAssignmentSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createAssignment({
        ...newAsg,
        facultyName: profile?.name || 'Dr. Sarah Jenkins',
        facultyId: profile?.id || 'FAC101'
      });
      showToast('New assignment published successfully!');
      setAsgModalOpen(false);
      loadFacultyData();
    } catch (e) {
      showToast('Error creating assignment', 'error');
    }
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    try {
      await api.gradeAssignment({
        assignmentId: selectedSubmission.assignmentId,
        studentId: selectedSubmission.studentId,
        grade: gradeInput,
        feedback: feedbackInput
      });
      showToast('Grade and feedback saved to database!');
      setGradingModalOpen(false);
      loadFacultyData();
    } catch (e) {
      showToast('Error saving grade', 'error');
    }
  };

  const handleSaveInternalMarks = async (e) => {
    e.preventDefault();
    setSavingMarks(true);
    try {
      await api.updateInternalMarks({
        studentId: selectedStudentForMarks,
        semester: 'Semester 5',
        courseCode: marksCourse,
        internalMarks: Number(internalMarksInput),
        externalMarks: Number(externalMarksInput)
      });
      showToast('Student internal & external marks updated!');
    } catch (e) {
      showToast('Error updating marks', 'error');
    } finally {
      setSavingMarks(false);
    }
  };

  const handlePostAnnouncementSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.postAnnouncement({
        ...newAnn,
        author: `${profile?.name || 'Dr. Sarah Jenkins'} (${profile?.designation || 'Faculty'})`
      });
      showToast('Institutional announcement posted!');
      setAnnModalOpen(false);
      setNewAnn({ ...newAnn, title: '', content: '' });
    } catch (e) {
      showToast('Error posting announcement', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Top Faculty Profile Hero */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-navy-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={profile?.photo || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"}
            alt={profile?.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">{profile?.name || 'Dr. Sarah Jenkins'}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-navy-950">
                HOD CSE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
              {profile?.designation} • {profile?.department}
            </p>
            <p className="text-xs text-brand-200 mt-2">
              Office: {profile?.office} • Assigned Courses: {profile?.assignedCourses?.join(', ') || 'CS501, CS503, CS506'}
            </p>
          </div>
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setMatModalOpen(true)}
            className="px-4 py-2.5 bg-white text-brand-900 rounded-xl text-xs font-bold hover:bg-brand-50 transition shadow-md flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4 text-brand-700" />
            Upload Notes
          </button>
          <button
            onClick={() => setAsgModalOpen(true)}
            className="px-4 py-2.5 bg-brand-700/80 hover:bg-brand-700 text-white border border-white/20 rounded-xl text-xs font-bold transition flex items-center gap-2"
          >
            <FileCheck className="w-4 h-4 text-amber-300" />
            Create Assignment
          </button>
        </div>
      </div>

      {/* 2. Faculty Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm">
        {[
          { id: 'faculty-overview', label: 'Assigned Students', icon: Users },
          { id: 'faculty-attendance', label: 'Mark Attendance', icon: CalendarCheck2 },
          { id: 'faculty-materials', label: 'Study Materials', icon: UploadCloud },
          { id: 'faculty-assignments', label: 'Grade Submissions', icon: FileCheck },
          { id: 'faculty-marks', label: 'Enter Internal Marks', icon: Award },
          { id: 'faculty-announcements', label: 'Post Notices', icon: Bell },
        ].map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                tab === item.id
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB A: Assigned Students */}
      {tab === 'faculty-overview' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Enrolled Students Roster</h3>
              <p className="text-xs text-slate-400">Class Section A • Computer Science & Engineering</p>
            </div>
            <span className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-xl">
              {students.length} Total Students
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-5">Student</th>
                  <th className="py-3 px-5">Register No</th>
                  <th className="py-3 px-5">Dept & Year</th>
                  <th className="py-3 px-5 text-center">Attendance</th>
                  <th className="py-3 px-5 text-center">CGPA</th>
                  <th className="py-3 px-5 text-center">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {students.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-5 flex items-center gap-3">
                      <img src={s.photo} alt={s.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-slate-900">{s.name}</p>
                        <p className="text-[10px] text-slate-400">{s.email}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 font-bold text-brand-700">{s.registerNo}</td>
                    <td className="py-3.5 px-5 text-slate-600">{s.deptCode} • {s.year}</td>
                    <td className="py-3.5 px-5 text-center">
                      <span className={`px-2 py-0.5 rounded-full font-bold ${
                        s.attendanceOverall >= 85 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {s.attendanceOverall}%
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-center font-black text-slate-900">{s.cgpa}</td>
                    <td className="py-3.5 px-5 text-center text-slate-500">{s.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB B: Mark Attendance */}
      {tab === 'faculty-attendance' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Classroom Attendance Register</h3>
              <p className="text-xs text-slate-400">Select course and period, mark statuses, and record to database</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSetAllAttendance('Present')}
                className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition"
              >
                ✓ All Present
              </button>
              <button
                type="button"
                onClick={() => handleSetAllAttendance('Absent')}
                className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold transition"
              >
                ✕ All Absent
              </button>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Subject</label>
              <select
                value={attCourse}
                onChange={(e) => setAttCourse(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
              >
                <option value="CS501">CS501: Advanced DBMS</option>
                <option value="CS503">CS503: Artificial Intelligence & ML</option>
                <option value="CS506">CS506: Cloud & AI Practical Lab</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Session Date</label>
              <input
                type="date"
                value={attDate}
                onChange={(e) => setAttDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Lecture Slot</label>
              <select
                value={attSlot}
                onChange={(e) => setAttSlot(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
              >
                <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                <option value="11:15 AM - 12:15 PM">11:15 AM - 12:15 PM</option>
                <option value="01:30 PM - 03:30 PM">01:30 PM - 03:30 PM (Lab)</option>
              </select>
            </div>
          </div>

          {/* Student Toggle List */}
          <div className="divide-y divide-slate-100">
            {students.map(s => {
              const isPresent = studentStatuses[s.id] !== 'Absent';

              return (
                <div key={s.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={s.photo} alt={s.name} className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{s.name}</h4>
                      <p className="text-[10px] text-slate-400">Reg: {s.registerNo} • Roll #{s.rollNo}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleAttendance(s.id)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-black transition ${
                      isPresent
                        ? 'bg-emerald-500 text-white shadow-sm hover:bg-emerald-600'
                        : 'bg-rose-500 text-white shadow-sm hover:bg-rose-600'
                    }`}
                  >
                    {isPresent ? 'PRESENT' : 'ABSENT'}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              onClick={handleSaveAttendance}
              disabled={markingAtt}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/30 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {markingAtt ? 'Saving Attendance...' : 'Save & Record Attendance to Database'}
            </button>
          </div>
        </div>
      )}

      {/* TAB C: Grade Assignments */}
      {tab === 'faculty-assignments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Submitted Student Assignments</h3>
              <p className="text-xs text-slate-400">Review student attachments, assign marks, and write constructive remarks</p>
            </div>
            <button
              onClick={() => setAsgModalOpen(true)}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create New Assignment
            </button>
          </div>

          <div className="space-y-4">
            {assignments.map(asg => (
              <div key={asg.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200/60">
                    {asg.courseCode}
                  </span>
                  <span className="text-xs text-slate-400">Max Score: {asg.maxMarks}</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">{asg.title}</h4>

                {/* Submissions list */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
                  <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Student Submissions ({asg.submissions?.length || 0}):
                  </h5>

                  {(asg.submissions || []).map((sub, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900">{sub.studentName} ({sub.studentId})</p>
                        <p className="text-[11px] text-slate-500">File: {sub.fileName}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        {sub.status === 'Graded' ? (
                          <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                            Score: {sub.grade} / {asg.maxMarks}
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                            Awaiting Grade
                          </span>
                        )}

                        <button
                          onClick={() => {
                            setSelectedSubmission({ ...sub, assignmentId: asg.id, maxMarks: asg.maxMarks });
                            setGradeInput(sub.grade || '');
                            setFeedbackInput(sub.feedback || '');
                            setGradingModalOpen(true);
                          }}
                          className="px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold"
                        >
                          {sub.status === 'Graded' ? 'Edit Grade' : 'Grade Now'}
                        </button>
                      </div>
                    </div>
                  ))}

                  {(!asg.submissions || asg.submissions.length === 0) && (
                    <p className="text-xs text-slate-400 italic">No submissions recorded yet for this task.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB D: Enter Internal Marks */}
      {tab === 'faculty-marks' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm max-w-xl">
          <h3 className="font-bold text-slate-900 text-base mb-1">Internal Marks Entry Form</h3>
          <p className="text-xs text-slate-400 mb-5">Enter internal assessment marks and update student grade cards</p>

          <form onSubmit={handleSaveInternalMarks} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Select Student
              </label>
              <select
                value={selectedStudentForMarks}
                onChange={(e) => setSelectedStudentForMarks(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.registerNo})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Course Subject
              </label>
              <select
                value={marksCourse}
                onChange={(e) => setMarksCourse(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
              >
                <option value="CS501">CS501: Advanced DBMS</option>
                <option value="CS502">CS502: Cloud Computing</option>
                <option value="CS503">CS503: Artificial Intelligence & ML</option>
                <option value="CS504">CS504: Computer Networks & Security</option>
                <option value="CS505">CS505: Software Engineering & Agile</option>
                <option value="CS506">CS506: Cloud & AI Practical Lab</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Internal Assessment (Max 40)
                </label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={internalMarksInput}
                  onChange={(e) => setInternalMarksInput(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  External Exam (Max 60)
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={externalMarksInput}
                  onChange={(e) => setExternalMarksInput(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingMarks}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/30 flex items-center justify-center gap-2 mt-4"
            >
              {savingMarks ? 'Calculating & Saving...' : 'Save Marks & Recompute GPA'}
            </button>
          </form>
        </div>
      )}

      {/* TAB E: Study Materials & Announcements triggers */}
      {(tab === 'faculty-materials' || tab === 'faculty-announcements') && (
        <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/80 space-y-4">
          <h3 className="font-bold text-slate-900 text-base">
            {tab === 'faculty-materials' ? 'Course Materials Repository' : 'Departmental Announcements'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Publish new lecture slides, lab manuals, or department circulars directly accessible to students.
          </p>
          <button
            onClick={() => tab === 'faculty-materials' ? setMatModalOpen(true) : setAnnModalOpen(true)}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
            {tab === 'faculty-materials' ? 'Upload New Study Material' : 'Publish New Notice'}
          </button>
        </div>
      )}

      {/* MODALS */}

      {/* Modal 1: Upload Material */}
      {matModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Upload Courseware Material</h3>
              <button onClick={() => setMatModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUploadMaterialSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course</label>
                <select
                  value={matData.courseCode}
                  onChange={(e) => setMatData({ ...matData, courseCode: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  <option value="CS501">CS501: Advanced DBMS</option>
                  <option value="CS503">CS503: AI & Machine Learning</option>
                  <option value="CS506">CS506: Cloud & AI Lab</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Material Title</label>
                <input
                  type="text"
                  value={matData.title}
                  onChange={(e) => setMatData({ ...matData, title: e.target.value })}
                  placeholder="e.g. Module 4: Relational Algebra & Calculus"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={matData.category}
                  onChange={(e) => setMatData({ ...matData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value="Lecture Notes">Lecture Notes</option>
                  <option value="Lab Manual">Lab Manual</option>
                  <option value="Previous Year Papers">Previous Year Papers</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={matData.description}
                  onChange={(e) => setMatData({ ...matData, description: e.target.value })}
                  placeholder="Brief summary of topics covered..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setMatModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold">Publish Material</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Create Assignment */}
      {asgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Create New Assignment</h3>
              <button onClick={() => setAsgModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateAssignmentSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course</label>
                <select
                  value={newAsg.courseCode}
                  onChange={(e) => setNewAsg({ ...newAsg, courseCode: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  <option value="CS501">CS501: Advanced DBMS</option>
                  <option value="CS503">CS503: AI & Machine Learning</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assignment Title</label>
                <input
                  type="text"
                  value={newAsg.title}
                  onChange={(e) => setNewAsg({ ...newAsg, title: e.target.value })}
                  placeholder="e.g. Distributed Database Sharding Lab"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Max Marks</label>
                  <input
                    type="number"
                    value={newAsg.maxMarks}
                    onChange={(e) => setNewAsg({ ...newAsg, maxMarks: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={newAsg.deadline.split('T')[0]}
                    onChange={(e) => setNewAsg({ ...newAsg, deadline: `${e.target.value}T23:59:00Z` })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Instructions / Description</label>
                <textarea
                  rows={3}
                  value={newAsg.description}
                  onChange={(e) => setNewAsg({ ...newAsg, description: e.target.value })}
                  placeholder="Detailed guidelines for students..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  required
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setAsgModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold">Publish Assignment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Grade Submission */}
      {gradingModalOpen && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Grade Student Work</h3>
              <button onClick={() => setGradingModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveGrade} className="mt-4 space-y-3.5">
              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                <p>Student: <strong>{selectedSubmission.studentName}</strong> ({selectedSubmission.studentId})</p>
                <p>Submitted File: <strong className="text-brand-600">{selectedSubmission.fileName}</strong></p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Marks Awarded (Out of {selectedSubmission.maxMarks})
                </label>
                <input
                  type="number"
                  min="0"
                  max={selectedSubmission.maxMarks}
                  value={gradeInput}
                  onChange={(e) => setGradeInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Faculty Remarks & Feedback</label>
                <textarea
                  rows={3}
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="e.g. Excellent comparative study and detailed performance graphs..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setGradingModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold">Save Grade</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Post Announcement */}
      {annModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Post Notice to Students</h3>
              <button onClick={() => setAnnModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handlePostAnnouncementSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newAnn.title}
                  onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
                  placeholder="e.g. Special Seminar on Quantum Algorithms"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newAnn.category}
                    onChange={(e) => setNewAnn({ ...newAnn, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  >
                    <option value="Department">Department</option>
                    <option value="Examination">Examination</option>
                    <option value="Events">Events</option>
                    <option value="College">College</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newAnn.priority}
                    onChange={(e) => setNewAnn({ ...newAnn, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Important">Important</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notice Content</label>
                <textarea
                  rows={4}
                  value={newAnn.content}
                  onChange={(e) => setNewAnn({ ...newAnn, content: e.target.value })}
                  placeholder="Detailed notification announcement..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  required
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setAnnModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold">Publish Notice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
