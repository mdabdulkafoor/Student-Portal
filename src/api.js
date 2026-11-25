// API Client for the Student Portal

const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('apex_portal_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }
    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // Auth
  login: (username, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  }),
  forgotPassword: (identifier) => request('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ identifier })
  }),

  // Student
  getStudentProfile: (id) => request(`/student/profile/${id}`),
  updateStudentProfile: (id, updates) => request(`/student/profile/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  }),
  getAttendance: (id) => request(`/student/attendance/${id}`),
  getResults: (id) => request(`/student/results/${id}`),
  getTimetable: () => request('/student/timetable'),
  getAssignments: () => request('/student/assignments'),
  submitAssignment: (payload) => request('/student/assignments/submit', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getFees: (id) => request(`/student/fees/${id}`),
  payFee: (payload) => request('/student/fees/pay', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getStudyMaterials: () => request('/student/study-materials'),
  getAnnouncements: () => request('/student/announcements'),
  getMessages: (studentId) => request(`/student/messages/${studentId}`),
  sendMessage: (payload) => request('/student/messages', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getComplaints: (studentId) => request(`/student/complaints/${studentId}`),
  submitComplaint: (payload) => request('/student/complaints', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getExaminations: () => request('/student/examinations'),
  getLibrary: () => request('/student/library'),
  renewBook: (accessionNo) => request('/student/library/renew', {
    method: 'POST',
    body: JSON.stringify({ accessionNo })
  }),
  getHostelTransport: () => request('/student/hostel-transport'),
  applyGatePass: (payload) => request('/student/hostel-transport/gatepass', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getCertificates: () => request('/student/certificates'),
  requestCertificate: (payload) => request('/student/certificates/request', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getPlacements: () => request('/student/placements'),
  applyPlacement: (jobId) => request('/student/placements/apply', {
    method: 'POST',
    body: JSON.stringify({ jobId })
  }),
  getFeedback: () => request('/student/feedback'),
  submitFeedback: (payload) => request('/student/feedback', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  // Faculty
  getFacultyStudents: () => request('/faculty/students'),
  markAttendance: (records) => request('/faculty/attendance', {
    method: 'POST',
    body: JSON.stringify({ records })
  }),
  uploadStudyMaterial: (payload) => request('/faculty/study-materials', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  createAssignment: (payload) => request('/faculty/assignments', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  gradeAssignment: (payload) => request('/faculty/assignments/grade', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  updateInternalMarks: (payload) => request('/faculty/marks', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  postAnnouncement: (payload) => request('/faculty/announcements', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  // Admin
  getAdminStats: () => request('/admin/stats'),
  getAllStudents: () => request('/admin/students'),
  createStudent: (studentData) => request('/admin/students', {
    method: 'POST',
    body: JSON.stringify(studentData)
  }),
  deleteStudent: (id) => request(`/admin/students/${id}`, {
    method: 'DELETE'
  }),
  getAllFaculty: () => request('/admin/faculty'),
  createFaculty: (facData) => request('/admin/faculty', {
    method: 'POST',
    body: JSON.stringify(facData)
  }),
  getDepartments: () => request('/admin/departments'),
  createDepartment: (deptData) => request('/admin/departments', {
    method: 'POST',
    body: JSON.stringify(deptData)
  }),
  getCourses: () => request('/admin/courses'),
  createCourse: (courseData) => request('/admin/courses', {
    method: 'POST',
    body: JSON.stringify(courseData)
  }),
  getAllComplaints: () => request('/admin/complaints'),
  updateComplaintStatus: (id, status, adminNotes) => request(`/admin/complaints/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status, adminNotes })
  }),
  getAdminReports: () => request('/admin/reports'),

  // File Upload
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('apex_portal_token');
    const response = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: formData
    });
    if (!response.ok) throw new Error('File upload failed');
    return response.json();
  }
};
