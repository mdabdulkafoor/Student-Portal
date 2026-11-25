import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import { db } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'apex-academic-secret-key-2026';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure uploads folder exists
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_'));
  }
});
const upload = multer({ storage });

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    fileName: req.file.originalname,
    filePath: fileUrl,
    size: req.file.size
  });
});

// Authentication middleware helper
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Session expired or invalid token' });
    req.user = user;
    next();
  });
}

// -----------------------------------------------------------------------------
// 1. AUTHENTICATION ROUTES
// -----------------------------------------------------------------------------

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Please enter Student ID / Username and Password' });
  }

  const user = db.findUserByCredentials(username, password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid ID/Username or password. Please verify your credentials.' });
  }

  let profile = null;
  if (user.role === 'student') {
    profile = db.getStudentById(user.studentId || user.username);
  } else if (user.role === 'faculty') {
    profile = db.getFacultyById(user.facultyId || user.username);
  } else if (user.role === 'admin') {
    profile = {
      name: user.name,
      email: user.email,
      role: 'admin',
      designation: 'Registrar & Administrator',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
    };
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role, studentId: user.studentId, facultyId: user.facultyId },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role
    },
    profile
  });
});

app.post('/api/auth/forgot-password', (req, res) => {
  const { identifier } = req.body;
  if (!identifier) {
    return res.status(400).json({ error: 'Please enter your registered Email or Student Register Number.' });
  }
  // Simulated verification & reset email dispatch
  res.json({
    success: true,
    message: `Password reset link and temporary security OTP have been dispatched to the registered email corresponding to '${identifier}'. Please check your inbox or spam folder.`
  });
});

// -----------------------------------------------------------------------------
// 2. STUDENT ROUTES
// -----------------------------------------------------------------------------

app.get('/api/student/profile/:id', (req, res) => {
  const student = db.getStudentById(req.params.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.json(student);
});

app.put('/api/student/profile/:id', (req, res) => {
  const updated = db.updateStudentProfile(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Failed to update student profile' });
  res.json({ success: true, student: updated });
});

app.get('/api/student/attendance/:id', (req, res) => {
  const attendance = db.getAttendanceByStudent(req.params.id);
  const logs = db.getAttendanceLogs(req.params.id);
  res.json({ attendance, logs });
});

app.get('/api/student/results/:id', (req, res) => {
  const results = db.getResultsByStudent(req.params.id);
  res.json(results);
});

app.get('/api/student/timetable', (req, res) => {
  const timetable = db.getTimetable();
  res.json(timetable);
});

app.get('/api/student/assignments', (req, res) => {
  const assignments = db.getAssignments();
  res.json(assignments);
});

app.post('/api/student/assignments/submit', (req, res) => {
  const { assignmentId, studentId, studentName, fileName, fileUrl } = req.body;
  if (!assignmentId || !studentId) {
    return res.status(400).json({ error: 'Missing required assignment or student details' });
  }
  const submission = db.submitAssignment(assignmentId, studentId, studentName, fileName, fileUrl);
  if (!submission) return res.status(404).json({ error: 'Assignment not found' });
  res.json({ success: true, submission });
});

app.get('/api/student/fees/:id', (req, res) => {
  const feeDetails = db.getFeeDetails(req.params.id);
  res.json(feeDetails);
});

app.post('/api/student/fees/pay', (req, res) => {
  const { studentId, amount, paymentMethod, transactionNotes } = req.body;
  if (!studentId || !amount) {
    return res.status(400).json({ error: 'Missing payment details' });
  }
  const payment = db.payFee(studentId, amount, paymentMethod, transactionNotes);
  res.json({ success: true, payment, updatedFee: db.getFeeDetails(studentId) });
});

app.get('/api/student/study-materials', (req, res) => {
  const materials = db.getStudyMaterials();
  res.json(materials);
});

app.get('/api/student/announcements', (req, res) => {
  const announcements = db.getAnnouncements();
  res.json(announcements);
});

app.get('/api/student/messages/:studentId', (req, res) => {
  const msgs = db.getMessages(req.params.studentId, null);
  res.json(msgs);
});

app.post('/api/student/messages', (req, res) => {
  const { studentId, facultyId, facultyName, sender, subject, text } = req.body;
  if (!studentId || !facultyId || !text) {
    return res.status(400).json({ error: 'Missing message parameters' });
  }
  const msg = db.sendMessage({ studentId, facultyId, facultyName, sender: sender || 'student', subject, text });
  res.json({ success: true, message: msg });
});

app.get('/api/student/complaints/:studentId', (req, res) => {
  const list = db.getComplaints(req.params.studentId);
  res.json(list);
});

app.post('/api/student/complaints', (req, res) => {
  const { studentId, studentName, category, subject, description, priority } = req.body;
  if (!studentId || !subject || !description) {
    return res.status(400).json({ error: 'Please provide category, subject, and description' });
  }
  const cmp = db.createComplaint({ studentId, studentName, category, subject, description, priority });
  res.json({ success: true, complaint: cmp });
});

// Examinations & Hall Ticket
app.get('/api/student/examinations', (req, res) => {
  const exams = db.getExaminations();
  res.json(exams);
});

// Digital Library
app.get('/api/student/library', (req, res) => {
  const lib = db.getLibrary();
  res.json(lib);
});

app.post('/api/student/library/renew', (req, res) => {
  const { accessionNo } = req.body;
  const book = db.renewBook(accessionNo);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json({ success: true, book });
});

// Hostel & Transport
app.get('/api/student/hostel-transport', (req, res) => {
  const ht = db.getHostelTransport();
  res.json(ht);
});

app.post('/api/student/hostel-transport/gatepass', (req, res) => {
  const pass = db.applyGatePass(req.body);
  res.json({ success: true, pass });
});

// Certificates
app.get('/api/student/certificates', (req, res) => {
  const certs = db.getCertificates();
  res.json(certs);
});

app.post('/api/student/certificates/request', (req, res) => {
  const cert = db.requestCertificate(req.body);
  res.json({ success: true, certificate: cert });
});

// Placements
app.get('/api/student/placements', (req, res) => {
  const plc = db.getPlacements();
  res.json(plc);
});

app.post('/api/student/placements/apply', (req, res) => {
  const { jobId } = req.body;
  const job = db.applyPlacement(jobId);
  if (!job) return res.status(404).json({ error: 'Position not found' });
  res.json({ success: true, job });
});

// Feedback
app.get('/api/student/feedback', (req, res) => {
  const fb = db.getFeedback();
  res.json(fb);
});

app.post('/api/student/feedback', (req, res) => {
  const { courseCode, rating, comments } = req.body;
  const updated = db.submitFeedback(courseCode, rating, comments);
  res.json({ success: true, feedback: updated });
});

// -----------------------------------------------------------------------------
// 3. FACULTY ROUTES
// -----------------------------------------------------------------------------

app.get('/api/faculty/students', (req, res) => {
  const students = db.getAllStudents();
  res.json(students);
});

app.post('/api/faculty/attendance', (req, res) => {
  const { records } = req.body; // array of { studentId, courseCode, date, slot, status, faculty }
  if (!records || !Array.isArray(records)) {
    return res.status(400).json({ error: 'Invalid attendance records payload' });
  }
  db.markAttendance(records);
  res.json({ success: true, message: `Successfully saved ${records.length} attendance records to database.` });
});

app.post('/api/faculty/study-materials', (req, res) => {
  const { courseCode, courseName, title, category, fileType, fileSize, facultyName, facultyId, description } = req.body;
  if (!courseCode || !title) {
    return res.status(400).json({ error: 'Course code and title are required' });
  }
  const mat = db.addStudyMaterial({ courseCode, courseName, title, category, fileType, fileSize, facultyName, facultyId, description });
  res.json({ success: true, material: mat });
});

app.post('/api/faculty/assignments', (req, res) => {
  const { courseCode, courseName, title, description, deadline, maxMarks, facultyName, facultyId } = req.body;
  if (!courseCode || !title || !deadline) {
    return res.status(400).json({ error: 'Title, course, and deadline are required' });
  }
  const asg = db.createAssignment({ courseCode, courseName, title, description, deadline, maxMarks, facultyName, facultyId });
  res.json({ success: true, assignment: asg });
});

app.post('/api/faculty/assignments/grade', (req, res) => {
  const { assignmentId, studentId, grade, feedback } = req.body;
  if (!assignmentId || !studentId || grade === undefined) {
    return res.status(400).json({ error: 'Missing grade information' });
  }
  const graded = db.gradeSubmission(assignmentId, studentId, grade, feedback);
  if (!graded) return res.status(404).json({ error: 'Submission not found' });
  res.json({ success: true, submission: graded });
});

app.post('/api/faculty/marks', (req, res) => {
  const { studentId, semester, courseCode, internalMarks, externalMarks } = req.body;
  if (!studentId || !courseCode || internalMarks === undefined) {
    return res.status(400).json({ error: 'Missing student or mark details' });
  }
  const updated = db.updateStudentMarks(studentId, semester || "Semester 5", courseCode, internalMarks, externalMarks);
  res.json({ success: true, updated });
});

app.post('/api/faculty/announcements', (req, res) => {
  const { title, category, priority, author, department, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  const ann = db.createAnnouncement({ title, category, priority, author, department, content });
  res.json({ success: true, announcement: ann });
});

// -----------------------------------------------------------------------------
// 4. ADMIN ROUTES
// -----------------------------------------------------------------------------

app.get('/api/admin/stats', (req, res) => {
  const stats = db.getAdminStats();
  res.json(stats);
});

app.get('/api/admin/students', (req, res) => {
  const students = db.getAllStudents();
  res.json(students);
});

app.post('/api/admin/students', (req, res) => {
  const student = db.createStudent(req.body);
  res.json({ success: true, student });
});

app.delete('/api/admin/students/:id', (req, res) => {
  const deleted = db.deleteStudent(req.params.id);
  res.json({ success: deleted });
});

app.get('/api/admin/faculty', (req, res) => {
  const faculty = db.getAllFaculty();
  res.json(faculty);
});

app.post('/api/admin/faculty', (req, res) => {
  const fac = db.createFaculty(req.body);
  res.json({ success: true, faculty: fac });
});

app.get('/api/admin/departments', (req, res) => {
  const depts = db.getDepartments();
  res.json(depts);
});

app.post('/api/admin/departments', (req, res) => {
  const dept = db.addDepartment(req.body);
  res.json({ success: true, department: dept });
});

app.get('/api/admin/courses', (req, res) => {
  const courses = db.getCourses();
  res.json(courses);
});

app.post('/api/admin/courses', (req, res) => {
  const crs = db.addCourse(req.body);
  res.json({ success: true, course: crs });
});

app.get('/api/admin/complaints', (req, res) => {
  const complaints = db.getComplaints();
  res.json(complaints);
});

app.put('/api/admin/complaints/:id', (req, res) => {
  const { status, adminNotes } = req.body;
  const updated = db.updateComplaintStatus(req.params.id, status, adminNotes);
  res.json({ success: true, complaint: updated });
});

app.get('/api/admin/reports', (req, res) => {
  const students = db.getAllStudents();
  const departments = db.getDepartments();
  const stats = db.getAdminStats();

  const report = {
    generatedAt: new Date().toISOString(),
    institution: "Apex Institute of Technology",
    academicYear: "2024-2025",
    metrics: stats,
    departmentDistribution: departments.map(d => ({
      name: d.name,
      code: d.code,
      head: d.head,
      students: d.studentsCount,
      faculty: d.facultyCount
    })),
    topPerformingStudents: students.map(s => ({
      name: s.name,
      registerNo: s.registerNo,
      department: s.deptCode,
      cgpa: s.cgpa,
      attendance: s.attendanceOverall
    })).sort((a, b) => b.cgpa - a.cgpa)
  };

  res.json(report);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Apex University Academic Portal API', timestamp: new Date().toISOString() });
});

// Serve frontend production build if available
const DIST_DIR = path.join(__dirname, '../dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.use((req, res) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`[API Server] Running at http://localhost:${PORT}`);
});
