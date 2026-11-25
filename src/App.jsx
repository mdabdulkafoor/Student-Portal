import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { api } from './api';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Toast from './components/common/Toast';
import LoginPage from './components/auth/LoginPage';

// Student Views
import StudentOverview from './components/student/StudentOverview';
import ProfileView from './components/student/ProfileView';
import AttendanceView from './components/student/AttendanceView';
import ResultsView from './components/student/ResultsView';
import TimetableView from './components/student/TimetableView';
import AssignmentsView from './components/student/AssignmentsView';
import AnnouncementsView from './components/student/AnnouncementsView';
import FeeManagementView from './components/student/FeeManagementView';
import StudyMaterialsView from './components/student/StudyMaterialsView';
import CommunicationView from './components/student/CommunicationView';
import ExaminationsView from './components/student/ExaminationsView';
import LibraryView from './components/student/LibraryView';
import HostelTransportView from './components/student/HostelTransportView';
import CertificatesView from './components/student/CertificatesView';
import PlacementsView from './components/student/PlacementsView';
import FeedbackView from './components/student/FeedbackView';

// Faculty & Admin Views
import FacultyDashboard from './components/faculty/FacultyDashboard';
import AdminDashboard from './components/admin/AdminDashboard';

export default function App() {
  const { user, profile, role, loading: authLoading, toast, updateProfile, switchRole } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Student Academic State
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [resultsData, setResultsData] = useState([]);
  const [timetableData, setTimetableData] = useState({});
  const [assignmentsData, setAssignmentsData] = useState([]);
  const [announcementsData, setAnnouncementsData] = useState([]);
  const [feeData, setFeeData] = useState(null);
  const [materialsData, setMaterialsData] = useState([]);
  const [messagesData, setMessagesData] = useState([]);
  const [complaintsData, setComplaintsData] = useState([]);
  const [examinationsData, setExaminationsData] = useState([]);
  const [libraryData, setLibraryData] = useState(null);
  const [hostelTransportData, setHostelTransportData] = useState(null);
  const [certificatesData, setCertificatesData] = useState([]);
  const [placementsData, setPlacementsData] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // When role changes, switch default view tab
  useEffect(() => {
    if (role === 'faculty') {
      if (!activeTab.startsWith('faculty-') && activeTab !== 'communication') {
        setActiveTab('faculty-overview');
      }
    } else if (role === 'admin') {
      if (!activeTab.startsWith('admin-')) {
        setActiveTab('admin-overview');
      }
    } else {
      if (activeTab.startsWith('faculty-') || activeTab.startsWith('admin-')) {
        setActiveTab('overview');
      }
    }
  }, [role]);

  // Load all academic data for student or global widgets
  const fetchAllData = async () => {
    if (!user) return;
    setDataLoading(true);
    const stuId = profile?.id || 'STU2022001';

    try {
      const [
        attRes,
        resRes,
        ttRes,
        asgRes,
        annRes,
        feeRes,
        matRes,
        msgRes,
        cmpRes,
        examRes,
        libRes,
        htRes,
        certRes,
        plcRes,
        fbRes
      ] = await Promise.all([
        api.getAttendance(stuId),
        api.getResults(stuId),
        api.getTimetable(),
        api.getAssignments(),
        api.getAnnouncements(),
        api.getFees(stuId),
        api.getStudyMaterials(),
        api.getMessages(stuId),
        api.getComplaints(stuId),
        api.getExaminations(),
        api.getLibrary(),
        api.getHostelTransport(),
        api.getCertificates(),
        api.getPlacements(),
        api.getFeedback()
      ]);

      setAttendanceData(attRes.attendance || []);
      setAttendanceLogs(attRes.logs || []);
      setResultsData(resRes || []);
      setTimetableData(ttRes || {});
      setAssignmentsData(asgRes || []);
      setAnnouncementsData(annRes || []);
      setFeeData(feeRes || null);
      setMaterialsData(matRes || []);
      setMessagesData(msgRes || []);
      setComplaintsData(cmpRes || []);
      setExaminationsData(examRes || []);
      setLibraryData(libRes || null);
      setHostelTransportData(htRes || null);
      setCertificatesData(certRes || []);
      setPlacementsData(plcRes || []);
      setFeedbackData(fbRes || []);
    } catch (err) {
      console.warn('API sync warning:', err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user, profile?.id]);

  // If loading session
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold tracking-wide">Initializing Apex Academic Portal...</p>
      </div>
    );
  }

  // If not logged in, render the modern login page
  if (!user) {
    return (
      <>
        <LoginPage />
        {toast && <Toast toast={toast} onClose={() => {}} />}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area (offset by sidebar width on lg screens) */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0 transition-all duration-300">
        
        {/* Top Header Bar */}
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Dynamic Main Body Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          
          {/* STUDENT VIEWS */}
          {role === 'student' && (
            <>
              {activeTab === 'overview' && (
                <StudentOverview
                  student={profile}
                  attendance={attendanceData}
                  results={resultsData}
                  timetable={timetableData}
                  assignments={assignmentsData}
                  announcements={announcementsData}
                  fees={feeData}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileView
                  student={profile}
                  onUpdateProfile={(updated) => updateProfile(updated)}
                />
              )}

              {activeTab === 'attendance' && (
                <AttendanceView
                  student={profile}
                  attendance={attendanceData}
                  logs={attendanceLogs}
                />
              )}

              {activeTab === 'results' && (
                <ResultsView
                  student={profile}
                  results={resultsData}
                />
              )}

              {activeTab === 'examinations' && (
                <ExaminationsView
                  student={profile}
                  examinations={examinationsData}
                />
              )}

              {activeTab === 'timetable' && (
                <TimetableView
                  timetable={timetableData}
                />
              )}

              {activeTab === 'assignments' && (
                <AssignmentsView
                  student={profile}
                  assignments={assignmentsData}
                  onAssignmentSubmitted={fetchAllData}
                />
              )}

              {activeTab === 'library' && (
                <LibraryView
                  library={libraryData}
                  onRefresh={fetchAllData}
                />
              )}

              {activeTab === 'hostel' && (
                <HostelTransportView
                  student={profile}
                  hostelTransport={hostelTransportData}
                  onRefresh={fetchAllData}
                />
              )}

              {activeTab === 'certificates' && (
                <CertificatesView
                  student={profile}
                  certificates={certificatesData}
                  onRefresh={fetchAllData}
                />
              )}

              {activeTab === 'placements' && (
                <PlacementsView
                  student={profile}
                  placements={placementsData}
                  onRefresh={fetchAllData}
                />
              )}

              {activeTab === 'feedback' && (
                <FeedbackView
                  feedback={feedbackData}
                  onRefresh={fetchAllData}
                />
              )}

              {activeTab === 'announcements' && (
                <AnnouncementsView
                  announcements={announcementsData}
                />
              )}

              {activeTab === 'fees' && (
                <FeeManagementView
                  student={profile}
                  fees={feeData}
                  onFeePaid={fetchAllData}
                />
              )}

              {activeTab === 'materials' && (
                <StudyMaterialsView
                  materials={materialsData}
                />
              )}

              {activeTab === 'communication' && (
                <CommunicationView
                  student={profile}
                  messages={messagesData}
                  complaints={complaintsData}
                  onRefresh={fetchAllData}
                />
              )}
            </>
          )}

          {/* FACULTY VIEWS */}
          {role === 'faculty' && (
            <FacultyDashboard activeSubTab={activeTab} />
          )}

          {/* ADMIN VIEWS */}
          {role === 'admin' && (
            <AdminDashboard activeSubTab={activeTab} />
          )}

        </main>

        {/* Global Footer */}
        <footer className="bg-white border-t border-slate-200/80 py-4 px-6 text-center text-xs text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© 2026 Apex Institute of Technology • Autonomous Educational Management System</p>
            <div className="flex items-center gap-4 text-slate-500 font-medium">
              <span className="hover:text-brand-600 cursor-pointer" onClick={() => setActiveTab('announcements')}>Circulars</span>
              <span>•</span>
              <span className="hover:text-brand-600 cursor-pointer" onClick={() => setActiveTab('communication')}>Help & Support</span>
              <span>•</span>
              <span className="hover:text-brand-600 cursor-pointer">Academic Regulations</span>
            </div>
          </div>
        </footer>

      </div>

      {/* Toast Notification */}
      {toast && <Toast toast={toast} onClose={() => {}} />}
    </div>
  );
}
