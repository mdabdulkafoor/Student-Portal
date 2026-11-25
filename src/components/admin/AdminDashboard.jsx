import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  Building2, 
  CreditCard, 
  Bell, 
  HelpCircle, 
  FileSpreadsheet, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  ArrowUpRight,
  BarChart3,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';

export default function AdminDashboard({ activeSubTab = 'admin-overview' }) {
  const { profile, showToast } = useAuth();
  const [tab, setTab] = useState(activeSubTab || 'admin-overview');

  useEffect(() => {
    if (activeSubTab) setTab(activeSubTab);
  }, [activeSubTab]);

  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [searchStudent, setSearchStudent] = useState('');
  const [loading, setLoading] = useState(true);

  // Add Student State
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [newStudentData, setNewStudentData] = useState({
    name: '',
    registerNo: '',
    email: '',
    phone: '',
    department: 'Computer Science & Engineering',
    deptCode: 'CSE',
    program: 'Bachelor of Technology (B.Tech)',
    year: '1st Year',
    semester: 'Semester 1',
    password: 'student123',
    cgpa: 8.5
  });

  // Add Faculty State
  const [facultyModalOpen, setFacultyModalOpen] = useState(false);
  const [newFacultyData, setNewFacultyData] = useState({
    name: '',
    code: '',
    email: '',
    designation: 'Assistant Professor',
    department: 'Computer Science & Engineering',
    deptCode: 'CSE',
    password: 'faculty123',
    assignedCourses: ['CS501']
  });

  // Add Department State
  const [deptModalOpen, setDeptModalOpen] = useState(false);
  const [newDeptData, setNewDeptData] = useState({
    code: '',
    name: '',
    head: ''
  });

  // Add Course State
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [newCourseData, setNewCourseData] = useState({
    code: '',
    name: '',
    credits: 3,
    department: 'CSE',
    semester: 'Semester 5',
    facultyName: 'Dr. Sarah Jenkins',
    room: 'Hall 301',
    type: 'Theory'
  });

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    try {
      const [st, stu, fac, dep, crs, cmp] = await Promise.all([
        api.getAdminStats(),
        api.getAllStudents(),
        api.getAllFaculty(),
        api.getDepartments(),
        api.getCourses(),
        api.getAllComplaints()
      ]);
      setStats(st);
      setStudents(stu);
      setFaculty(fac);
      setDepartments(dep);
      setCourses(crs);
      setComplaints(cmp);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createStudent(newStudentData);
      if (res.success) {
        showToast(`Created student record: ${res.student.name} (${res.student.registerNo})`);
        setStudentModalOpen(false);
        loadAllAdminData();
      }
    } catch (e) {
      showToast('Failed to create student account', 'error');
    }
  };

  const handleDeleteStudent = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove student account '${name}'?`)) return;
    try {
      const res = await api.deleteStudent(id);
      if (res.success) {
        showToast(`Student ${name} removed successfully`);
        loadAllAdminData();
      }
    } catch (e) {
      showToast('Error removing student', 'error');
    }
  };

  const handleCreateFaculty = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createFaculty(newFacultyData);
      if (res.success) {
        showToast(`Registered faculty: ${res.faculty.name}`);
        setFacultyModalOpen(false);
        loadAllAdminData();
      }
    } catch (e) {
      showToast('Error creating faculty profile', 'error');
    }
  };

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createDepartment(newDeptData);
      if (res.success) {
        showToast(`Department ${res.department.name} created!`);
        setDeptModalOpen(false);
        loadAllAdminData();
      }
    } catch (e) {
      showToast('Error creating department', 'error');
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createCourse(newCourseData);
      if (res.success) {
        showToast(`Course ${res.course.code} added!`);
        setCourseModalOpen(false);
        loadAllAdminData();
      }
    } catch (e) {
      showToast('Error adding course', 'error');
    }
  };

  const handleResolveComplaint = async (id) => {
    try {
      await api.updateComplaintStatus(id, 'Resolved', 'Resolved by Office of Student Affairs.');
      showToast(`Grievance ${id} marked as Resolved.`);
      loadAllAdminData();
    } catch (e) {
      showToast('Error updating complaint', 'error');
    }
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
    s.registerNo.toLowerCase().includes(searchStudent.toLowerCase()) ||
    s.department.toLowerCase().includes(searchStudent.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Admin Header Hero */}
      <div className="bg-gradient-to-r from-brand-950 via-slate-900 to-brand-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-brand-600/30 border border-brand-400/30 flex items-center justify-center text-amber-300">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">Dean Arthur Sterling</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500 text-white">
                Admin Registrar
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
              Apex Institute of Technology • Central Academic Administrative Console
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setStudentModalOpen(true)}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" /> Add Student
          </button>
          <button
            onClick={() => setFacultyModalOpen(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Faculty
          </button>
        </div>
      </div>

      {/* 2. Admin Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-brand-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{students.length || 3}</p>
          <p className="text-[11px] text-emerald-600 mt-1 font-semibold">Active & Verified Accounts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Faculty Members</span>
            <GraduationCap className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{faculty.length || 2}</p>
          <p className="text-[11px] text-purple-600 mt-1 font-semibold">5 Academic Departments</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Fees Collected</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">
            ${stats?.totalFeeCollected?.toLocaleString() || '3,000'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Pending: ${stats?.totalFeePending?.toLocaleString() || '1,500'}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Grievance Desk</span>
            <HelpCircle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{stats?.openComplaints || 1}</p>
          <p className="text-[11px] text-amber-600 mt-1 font-semibold">Open Grievance Tickets</p>
        </div>
      </div>

      {/* 3. Sub Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm">
        {[
          { id: 'admin-overview', label: 'Overview Analytics', icon: BarChart3 },
          { id: 'admin-students', label: 'Student Accounts', icon: Users },
          { id: 'admin-faculty', label: 'Faculty Accounts', icon: GraduationCap },
          { id: 'admin-departments', label: 'Departments & Courses', icon: Building2 },
          { id: 'admin-complaints', label: 'Helpdesk Tickets', icon: HelpCircle },
          { id: 'admin-reports', label: 'Accreditation Reports', icon: FileSpreadsheet },
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

      {/* 4. TAB CONTENTS */}

      {/* TAB 1: Student Accounts Management */}
      {(tab === 'admin-students' || tab === 'admin-overview') && (
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Student Accounts Directory</h3>
              <p className="text-xs text-slate-400">View, register, and manage official student credentials</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  placeholder="Search students..."
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                />
              </div>

              <button
                onClick={() => setStudentModalOpen(true)}
                className="px-3.5 py-1.5 bg-brand-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> New Student
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-5">Student Name</th>
                  <th className="py-3 px-5">Register No</th>
                  <th className="py-3 px-5">Department</th>
                  <th className="py-3 px-5">Semester</th>
                  <th className="py-3 px-5 text-center">CGPA</th>
                  <th className="py-3 px-5 text-center">Attendance</th>
                  <th className="py-3 px-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredStudents.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-5 flex items-center gap-3">
                      <img src={s.photo} alt={s.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-slate-900">{s.name}</p>
                        <p className="text-[10px] text-slate-400">{s.email}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 font-bold text-brand-700">{s.registerNo}</td>
                    <td className="py-3.5 px-5 text-slate-600">{s.deptCode}</td>
                    <td className="py-3.5 px-5 text-slate-600">{s.semester}</td>
                    <td className="py-3.5 px-5 text-center font-bold text-slate-900">{s.cgpa}</td>
                    <td className="py-3.5 px-5 text-center font-bold text-emerald-600">{s.attendanceOverall}%</td>
                    <td className="py-3.5 px-5 text-center">
                      <button
                        onClick={() => handleDeleteStudent(s.id, s.name)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                        title="Delete Student Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Faculty Accounts */}
      {tab === 'admin-faculty' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Faculty & Professors Directory</h3>
              <p className="text-xs text-slate-400">Department heads and teaching faculty credentials</p>
            </div>
            <button
              onClick={() => setFacultyModalOpen(true)}
              className="px-3.5 py-1.5 bg-brand-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Faculty
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-5">Faculty Name</th>
                  <th className="py-3 px-5">Staff Code</th>
                  <th className="py-3 px-5">Designation</th>
                  <th className="py-3 px-5">Department</th>
                  <th className="py-3 px-5">Office Room</th>
                  <th className="py-3 px-5">Courses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {faculty.map(f => (
                  <tr key={f.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-5 flex items-center gap-3">
                      <img src={f.photo} alt={f.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-slate-900">{f.name}</p>
                        <p className="text-[10px] text-slate-400">{f.email}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 font-bold text-brand-700">{f.code}</td>
                    <td className="py-3.5 px-5 text-slate-700">{f.designation}</td>
                    <td className="py-3.5 px-5 text-slate-600">{f.deptCode}</td>
                    <td className="py-3.5 px-5 text-slate-500">{f.office}</td>
                    <td className="py-3.5 px-5 font-bold text-brand-600">{f.assignedCourses?.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Departments & Courses */}
      {tab === 'admin-departments' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Departments Box */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-slate-900 text-base">Academic Departments</h3>
                <button
                  onClick={() => setDeptModalOpen(true)}
                  className="px-3 py-1 bg-brand-50 text-brand-700 rounded-lg text-xs font-bold"
                >
                  + Add Dept
                </button>
              </div>

              <div className="space-y-3">
                {departments.map(d => (
                  <div key={d.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-brand-600">{d.code}</span>
                        <span className="font-bold text-slate-800">{d.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Head: {d.head}</p>
                    </div>
                    <span className="text-slate-500 font-bold">{d.studentsCount} Students</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Courses Box */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-slate-900 text-base">Active Courses</h3>
                <button
                  onClick={() => setCourseModalOpen(true)}
                  className="px-3 py-1 bg-brand-50 text-brand-700 rounded-lg text-xs font-bold"
                >
                  + Add Course
                </button>
              </div>

              <div className="space-y-3">
                {courses.map((c, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-brand-600">{c.code}</span>
                        <span className="font-bold text-slate-800">{c.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{c.facultyName} • {c.room}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded font-bold text-slate-700">
                      {c.credits} Credits
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 4: Helpdesk Tickets */}
      {tab === 'admin-complaints' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <div className="pb-4 border-b border-slate-100 mb-5">
            <h3 className="font-bold text-slate-900 text-base">Student Grievances & Support Desk</h3>
            <p className="text-xs text-slate-400">Review student issues and mark resolution statuses</p>
          </div>

          <div className="space-y-3.5">
            {complaints.map(cmp => (
              <div key={cmp.id} className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-brand-700">{cmp.id}</span>
                    <span className="font-bold text-slate-900">{cmp.subject}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      cmp.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {cmp.status}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">{cmp.description}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Submitted by {cmp.studentName} ({cmp.studentId}) on {cmp.createdAt.split('T')[0]}</p>
                </div>

                {cmp.status !== 'Resolved' && (
                  <button
                    onClick={() => handleResolveComplaint(cmp.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 self-start md:self-auto"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mark Resolved
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Reports */}
      {tab === 'admin-reports' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">Executive Academic Accreditation Report</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Consolidated institutional analytics covering student retention, departmental GPA distributions, end-semester results status, and fee collection compliance.
          </p>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
            <p>• Institutional Quality Rating: <strong>Accredited 'A++' Grade</strong></p>
            <p>• Total Active Student Enrollment: <strong>{students.length || 3}</strong></p>
            <p>• Aggregate Semester Pass Percentage: <strong>96.8%</strong></p>
            <p>• Tuition Fee Collection Realization: <strong>92.4%</strong></p>
          </div>
          <button
            onClick={() => showToast('Generated & Exported Institutional Executive Report (PDF/CSV)')}
            className="px-6 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-brand-700"
          >
            Export Comprehensive Report
          </button>
        </div>
      )}

      {/* MODALS */}

      {/* Modal 1: Add Student */}
      {studentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Register New Student Account</h3>
              <button onClick={() => setStudentModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateStudent} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newStudentData.name}
                    onChange={(e) => setNewStudentData({ ...newStudentData, name: e.target.value })}
                    placeholder="e.g. Jordan Lee"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Register Number</label>
                  <input
                    type="text"
                    value={newStudentData.registerNo}
                    onChange={(e) => setNewStudentData({ ...newStudentData, registerNo: e.target.value })}
                    placeholder="2024CS1088"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Institutional Email</label>
                  <input
                    type="email"
                    value={newStudentData.email}
                    onChange={(e) => setNewStudentData({ ...newStudentData, email: e.target.value })}
                    placeholder="jordan.lee@apexuniv.edu"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Initial Password</label>
                  <input
                    type="password"
                    value={newStudentData.password}
                    onChange={(e) => setNewStudentData({ ...newStudentData, password: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={newStudentData.department}
                    onChange={(e) => setNewStudentData({ ...newStudentData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Year & Semester</label>
                  <select
                    value={newStudentData.semester}
                    onChange={(e) => setNewStudentData({ ...newStudentData, semester: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  >
                    <option value="Semester 1">1st Year - Sem 1</option>
                    <option value="Semester 3">2nd Year - Sem 3</option>
                    <option value="Semester 5">3rd Year - Sem 5</option>
                  </select>
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button type="button" onClick={() => setStudentModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold">Register Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Add Faculty */}
      {facultyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Register New Faculty Member</h3>
              <button onClick={() => setFacultyModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateFaculty} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Faculty Full Name</label>
                <input
                  type="text"
                  value={newFacultyData.name}
                  onChange={(e) => setNewFacultyData({ ...newFacultyData, name: e.target.value })}
                  placeholder="e.g. Dr. Alan Wright"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Staff ID Code</label>
                  <input
                    type="text"
                    value={newFacultyData.code}
                    onChange={(e) => setNewFacultyData({ ...newFacultyData, code: e.target.value })}
                    placeholder="FAC-CS-103"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={newFacultyData.designation}
                    onChange={(e) => setNewFacultyData({ ...newFacultyData, designation: e.target.value })}
                    placeholder="Associate Professor"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newFacultyData.email}
                  onChange={(e) => setNewFacultyData({ ...newFacultyData, email: e.target.value })}
                  placeholder="alan.wright@apexuniv.edu"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  required
                />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button type="button" onClick={() => setFacultyModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold">Register Faculty</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Add Department */}
      {deptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Add New Department</h3>
              <button onClick={() => setDeptModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateDepartment} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department Code</label>
                <input
                  type="text"
                  value={newDeptData.code}
                  onChange={(e) => setNewDeptData({ ...newDeptData, code: e.target.value })}
                  placeholder="AI-DS"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department Name</label>
                <input
                  type="text"
                  value={newDeptData.name}
                  onChange={(e) => setNewDeptData({ ...newDeptData, name: e.target.value })}
                  placeholder="Artificial Intelligence & Data Science"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Head of Department</label>
                <input
                  type="text"
                  value={newDeptData.head}
                  onChange={(e) => setNewDeptData({ ...newDeptData, head: e.target.value })}
                  placeholder="Dr. Katherine Vance"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  required
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setDeptModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold">Add Department</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Add Course */}
      {courseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Add New Course</h3>
              <button onClick={() => setCourseModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateCourse} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Course Code</label>
                  <input
                    type="text"
                    value={newCourseData.code}
                    onChange={(e) => setNewCourseData({ ...newCourseData, code: e.target.value })}
                    placeholder="CS507"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Credits</label>
                  <input
                    type="number"
                    value={newCourseData.credits}
                    onChange={(e) => setNewCourseData({ ...newCourseData, credits: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course Title</label>
                <input
                  type="text"
                  value={newCourseData.name}
                  onChange={(e) => setNewCourseData({ ...newCourseData, name: e.target.value })}
                  placeholder="Blockchain & Distributed Ledgers"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Faculty Name</label>
                  <input
                    type="text"
                    value={newCourseData.facultyName}
                    onChange={(e) => setNewCourseData({ ...newCourseData, facultyName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Room / Hall</label>
                  <input
                    type="text"
                    value={newCourseData.room}
                    onChange={(e) => setNewCourseData({ ...newCourseData, room: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                    required
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setCourseModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold">Create Course</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
