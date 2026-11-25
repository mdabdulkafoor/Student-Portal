import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialData } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize database file if it does not exist
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
  console.log('[DB] Initialized database with comprehensive academic seed data.');
}

export function readDb() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[DB] Read error, restoring initial state:', err);
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
}

export function writeDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[DB] Write error:', err);
    return false;
  }
}

// DB Helpers
export const db = {
  // Authentication
  findUserByCredentials: (username, password) => {
    const data = readDb();
    const cleanUser = username?.trim().toLowerCase();
    return data.users.find(u => 
      (u.username.toLowerCase() === cleanUser || 
       u.email.toLowerCase() === cleanUser ||
       (u.studentId && u.studentId.toLowerCase() === cleanUser)) &&
      u.password === password
    );
  },

  findUserById: (id) => {
    const data = readDb();
    return data.users.find(u => u.id === id);
  },

  // Student operations
  getStudentById: (studentId) => {
    const data = readDb();
    return data.students.find(s => s.id === studentId || s.registerNo === studentId);
  },

  getAllStudents: () => {
    const data = readDb();
    return data.students;
  },

  updateStudentProfile: (studentId, updates) => {
    const data = readDb();
    const idx = data.students.findIndex(s => s.id === studentId || s.registerNo === studentId);
    if (idx === -1) return null;

    data.students[idx] = {
      ...data.students[idx],
      ...updates,
      parent: {
        ...data.students[idx].parent,
        ...(updates.parent || {})
      }
    };
    writeDb(data);
    return data.students[idx];
  },

  createStudent: (studentData) => {
    const data = readDb();
    const newStudentId = `STU${new Date().getFullYear()}${String(data.students.length + 1).padStart(3, '0')}`;
    const newUserId = `usr_student_${Date.now()}`;

    const newStudent = {
      id: newStudentId,
      userId: newUserId,
      registerNo: studentData.registerNo || `2024CS${String(1000 + data.students.length + 1)}`,
      name: studentData.name,
      email: studentData.email,
      phone: studentData.phone || "+1 (555) 000-0000",
      altPhone: studentData.altPhone || "",
      dob: studentData.dob || "2004-01-01",
      gender: studentData.gender || "Other",
      bloodGroup: studentData.bloodGroup || "O+",
      address: studentData.address || "Apex University Campus Hostel",
      photo: studentData.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
      department: studentData.department || "Computer Science & Engineering",
      deptCode: studentData.deptCode || "CSE",
      program: studentData.program || "Bachelor of Technology (B.Tech)",
      year: studentData.year || "1st Year",
      semester: studentData.semester || "Semester 1",
      section: studentData.section || "A",
      rollNo: String(data.students.length + 1),
      academicYear: "2024 - 2025",
      admissionDate: new Date().toISOString().split('T')[0],
      batch: "2024 - 2028",
      cgpa: studentData.cgpa || 0.0,
      totalCredits: 0,
      attendanceOverall: 100.0,
      advisor: studentData.advisor || "Dr. Sarah Jenkins",
      parent: studentData.parent || {
        fatherName: "Guardian",
        fatherOccupation: "Professional",
        motherName: "Guardian",
        motherOccupation: "Professional",
        guardianPhone: "+1 (555) 000-0000",
        guardianEmail: studentData.email,
        emergencyContact: "+1 (555) 000-0000",
        homeAddress: studentData.address || "Campus"
      }
    };

    const newUser = {
      id: newUserId,
      username: newStudent.registerNo,
      studentId: newStudentId,
      email: newStudent.email,
      password: studentData.password || "student123",
      role: "student",
      name: newStudent.name
    };

    data.students.push(newStudent);
    data.users.push(newUser);

    // Initial empty attendance and results
    data.attendance[newStudentId] = [
      { courseCode: "CS501", courseName: "Advanced Database Management Systems", totalClasses: 10, attendedClasses: 10, percentage: 100, status: "Excellent" }
    ];

    writeDb(data);
    return newStudent;
  },

  deleteStudent: (studentId) => {
    const data = readDb();
    const studentIdx = data.students.findIndex(s => s.id === studentId);
    if (studentIdx === -1) return false;

    const student = data.students[studentIdx];
    data.students.splice(studentIdx, 1);
    data.users = data.users.filter(u => u.studentId !== studentId && u.id !== student.userId);
    writeDb(data);
    return true;
  },

  // Faculty operations
  getAllFaculty: () => {
    const data = readDb();
    return data.faculty;
  },

  getFacultyById: (facultyId) => {
    const data = readDb();
    return data.faculty.find(f => f.id === facultyId || f.code === facultyId);
  },

  createFaculty: (facData) => {
    const data = readDb();
    const newFacId = `FAC${String(100 + data.faculty.length + 1)}`;
    const newUserId = `usr_fac_${Date.now()}`;

    const newFaculty = {
      id: newFacId,
      userId: newUserId,
      code: facData.code || `FAC-CSE-${100 + data.faculty.length + 1}`,
      name: facData.name,
      email: facData.email,
      designation: facData.designation || "Assistant Professor",
      department: facData.department || "Computer Science & Engineering",
      deptCode: facData.deptCode || "CSE",
      phone: facData.phone || "+1 (555) 800-1234",
      qualification: facData.qualification || "Ph.D. in Computer Science",
      specialization: facData.specialization || "Computer Systems",
      office: facData.office || "Engineering Block A, Room 201",
      officeHours: facData.officeHours || "Mon/Wed 3:00 PM - 5:00 PM",
      photo: facData.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      assignedCourses: facData.assignedCourses || ["CS501"],
      experience: facData.experience || "5 Years Experience"
    };

    const newUser = {
      id: newUserId,
      username: newFaculty.code,
      facultyId: newFacId,
      email: newFaculty.email,
      password: facData.password || "faculty123",
      role: "faculty",
      name: newFaculty.name
    };

    data.faculty.push(newFaculty);
    data.users.push(newUser);
    writeDb(data);
    return newFaculty;
  },

  // Attendance
  getAttendanceByStudent: (studentId) => {
    const data = readDb();
    return data.attendance[studentId] || data.attendance["STU2022001"] || [];
  },

  getAttendanceLogs: (studentId) => {
    const data = readDb();
    if (!studentId) return data.attendanceLogs;
    return data.attendanceLogs.filter(l => l.studentId === studentId);
  },

  markAttendance: (records) => {
    // records: [{ studentId, courseCode, date, slot, status, faculty }]
    const data = readDb();
    records.forEach(rec => {
      const log = {
        id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        ...rec
      };
      data.attendanceLogs.unshift(log);

      // Also update student subject attendance
      if (!data.attendance[rec.studentId]) {
        data.attendance[rec.studentId] = [];
      }
      const subjAtt = data.attendance[rec.studentId].find(s => s.courseCode === rec.courseCode);
      if (subjAtt) {
        subjAtt.totalClasses += 1;
        if (rec.status === 'Present') {
          subjAtt.attendedClasses += 1;
        }
        subjAtt.percentage = Math.round((subjAtt.attendedClasses / subjAtt.totalClasses) * 1000) / 10;
        subjAtt.status = subjAtt.percentage >= 85 ? 'Normal' : subjAtt.percentage >= 75 ? 'Warning' : 'Critical';
      }
    });

    writeDb(data);
    return true;
  },

  // Results
  getResultsByStudent: (studentId) => {
    const data = readDb();
    return data.results[studentId] || data.results["STU2022001"] || [];
  },

  updateStudentMarks: (studentId, semester, courseCode, internalMarks, externalMarks) => {
    const data = readDb();
    if (!data.results[studentId]) return null;
    const sem = data.results[studentId].find(s => s.semester === semester);
    if (!sem) return null;
    const subj = sem.subjects.find(s => s.code === courseCode);
    if (!subj) return null;

    if (internalMarks !== undefined) subj.internal = Number(internalMarks);
    if (externalMarks !== undefined) subj.external = Number(externalMarks);
    subj.total = subj.internal + subj.external;

    if (subj.total >= 90) { subj.grade = 'O'; subj.gradePoint = 10; }
    else if (subj.total >= 80) { subj.grade = 'A+'; subj.gradePoint = 9; }
    else if (subj.total >= 70) { subj.grade = 'A'; subj.gradePoint = 8; }
    else if (subj.total >= 60) { subj.grade = 'B+'; subj.gradePoint = 7; }
    else if (subj.total >= 50) { subj.grade = 'B'; subj.gradePoint = 6; }
    else { subj.grade = 'F'; subj.gradePoint = 0; }

    // Recompute GPA
    const totalCredits = sem.subjects.reduce((sum, s) => sum + s.credits, 0);
    const earnedPoints = sem.subjects.reduce((sum, s) => sum + (s.gradePoint * s.credits), 0);
    sem.gpa = Math.round((earnedPoints / totalCredits) * 100) / 100;

    writeDb(data);
    return subj;
  },

  // Timetable
  getTimetable: () => {
    const data = readDb();
    return data.timetable;
  },

  // Assignments
  getAssignments: () => {
    const data = readDb();
    return data.assignments;
  },

  createAssignment: (asg) => {
    const data = readDb();
    const newAsg = {
      id: `asg_${Date.now()}`,
      courseCode: asg.courseCode,
      courseName: asg.courseName,
      title: asg.title,
      description: asg.description,
      deadline: asg.deadline,
      maxMarks: Number(asg.maxMarks) || 20,
      facultyName: asg.facultyName || "Faculty",
      facultyId: asg.facultyId || "FAC101",
      submissions: []
    };
    data.assignments.unshift(newAsg);
    writeDb(data);
    return newAsg;
  },

  submitAssignment: (assignmentId, studentId, studentName, fileName, fileUrl) => {
    const data = readDb();
    const asg = data.assignments.find(a => a.id === assignmentId);
    if (!asg) return null;

    const existingSubIdx = asg.submissions.findIndex(s => s.studentId === studentId);
    const subRecord = {
      studentId,
      studentName,
      submittedAt: new Date().toISOString(),
      fileName: fileName || "Assignment_Submission.pdf",
      fileUrl: fileUrl || "/uploads/Assignment_Submission.pdf",
      status: "Submitted",
      grade: null,
      feedback: null
    };

    if (existingSubIdx >= 0) {
      asg.submissions[existingSubIdx] = subRecord;
    } else {
      asg.submissions.push(subRecord);
    }

    writeDb(data);
    return subRecord;
  },

  gradeSubmission: (assignmentId, studentId, grade, feedback) => {
    const data = readDb();
    const asg = data.assignments.find(a => a.id === assignmentId);
    if (!asg) return null;
    const sub = asg.submissions.find(s => s.studentId === studentId);
    if (!sub) return null;

    sub.grade = Number(grade);
    sub.feedback = feedback;
    sub.status = "Graded";

    writeDb(data);
    return sub;
  },

  // Announcements
  getAnnouncements: () => {
    const data = readDb();
    return data.announcements;
  },

  createAnnouncement: (ann) => {
    const data = readDb();
    const newAnn = {
      id: `ann_${Date.now()}`,
      title: ann.title,
      category: ann.category || "College",
      priority: ann.priority || "Normal",
      date: new Date().toISOString().split('T')[0],
      author: ann.author || "Administration",
      department: ann.department || "All Departments",
      content: ann.content,
      attachment: ann.attachment || null
    };
    data.announcements.unshift(newAnn);
    writeDb(data);
    return newAnn;
  },

  // Fees
  getFeeDetails: (studentId) => {
    const data = readDb();
    return data.fees[studentId] || data.fees["STU2022001"];
  },

  payFee: (studentId, amount, paymentMethod, transactionNotes) => {
    const data = readDb();
    const studentFee = data.fees[studentId] || data.fees["STU2022001"];
    if (!studentFee) return null;

    const payAmount = Number(amount);
    studentFee.currentSemester.paidAmount += payAmount;
    studentFee.currentSemester.pendingAmount = Math.max(0, studentFee.currentSemester.totalAmount - studentFee.currentSemester.paidAmount);
    studentFee.currentSemester.status = studentFee.currentSemester.pendingAmount === 0 ? "Paid" : "Partial";

    const txnId = `TXN${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const rcptNo = `APEX-${new Date().getFullYear()}-S5-${Math.floor(100 + Math.random() * 900)}`;

    const newPayment = {
      id: `RCPT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      transactionId: txnId,
      date: new Date().toISOString().split('T')[0],
      semester: studentFee.currentSemester.semester.split(' ')[0] + " " + studentFee.currentSemester.semester.split(' ')[1],
      amount: payAmount,
      paymentMethod: paymentMethod || "Online Payment Gateway (Card/UPI)",
      status: "Success",
      receiptNo: rcptNo,
      description: transactionNotes || "Tuition & Amenities Balance Fee Payment"
    };

    studentFee.paymentHistory.unshift(newPayment);
    writeDb(data);
    return newPayment;
  },

  // Study Materials
  getStudyMaterials: () => {
    const data = readDb();
    return data.studyMaterials;
  },

  addStudyMaterial: (mat) => {
    const data = readDb();
    const newMat = {
      id: `mat_${Date.now()}`,
      courseCode: mat.courseCode,
      courseName: mat.courseName,
      title: mat.title,
      category: mat.category || "Lecture Notes",
      fileType: mat.fileType || "PDF",
      fileSize: mat.fileSize || "3.5 MB",
      uploadDate: new Date().toISOString().split('T')[0],
      facultyName: mat.facultyName || "Faculty",
      facultyId: mat.facultyId || "FAC101",
      downloadsCount: 0,
      description: mat.description
    };
    data.studyMaterials.unshift(newMat);
    writeDb(data);
    return newMat;
  },

  // Messages
  getMessages: (studentId, facultyId) => {
    const data = readDb();
    let msgs = data.messages;
    if (studentId) msgs = msgs.filter(m => m.studentId === studentId);
    if (facultyId) msgs = msgs.filter(m => m.facultyId === facultyId);
    return msgs;
  },

  sendMessage: (msg) => {
    const data = readDb();
    const newMsg = {
      id: `msg_${Date.now()}`,
      studentId: msg.studentId,
      facultyId: msg.facultyId,
      facultyName: msg.facultyName || "Faculty Advisor",
      sender: msg.sender, // 'student' or 'faculty'
      timestamp: new Date().toISOString(),
      subject: msg.subject,
      text: msg.text
    };
    data.messages.push(newMsg);
    writeDb(data);
    return newMsg;
  },

  // Complaints / Helpdesk
  getComplaints: (studentId) => {
    const data = readDb();
    if (!studentId) return data.complaints;
    return data.complaints.filter(c => c.studentId === studentId);
  },

  createComplaint: (cmp) => {
    const data = readDb();
    const newCmp = {
      id: `CMP-${new Date().getFullYear()}-${String(data.complaints.length + 1).padStart(4, '0')}`,
      studentId: cmp.studentId,
      studentName: cmp.studentName || "Student",
      category: cmp.category,
      subject: cmp.subject,
      description: cmp.description,
      priority: cmp.priority || "Medium",
      status: "Open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      adminNotes: "Complaint registered. Assigned to relevant department."
    };
    data.complaints.unshift(newCmp);
    writeDb(data);
    return newCmp;
  },

  updateComplaintStatus: (complaintId, status, adminNotes) => {
    const data = readDb();
    const cmp = data.complaints.find(c => c.id === complaintId);
    if (!cmp) return null;
    cmp.status = status;
    if (adminNotes) cmp.adminNotes = adminNotes;
    cmp.updatedAt = new Date().toISOString();
    writeDb(data);
    return cmp;
  },

  // Metadata / Stats for Admin
  getAdminStats: () => {
    const data = readDb();
    const totalStudents = data.students.length;
    const totalFaculty = data.faculty.length;
    const totalDepartments = data.departments.length;
    const totalCourses = data.courses.length;

    // Calculate fees collected
    let totalFeeCollected = 0;
    let totalFeePending = 0;
    Object.values(data.fees).forEach(f => {
      totalFeeCollected += (f.currentSemester?.paidAmount || 0);
      totalFeePending += (f.currentSemester?.pendingAmount || 0);
      if (f.paymentHistory) {
        f.paymentHistory.forEach(h => {
          // historical
        });
      }
    });

    return {
      totalStudents,
      totalFaculty,
      totalDepartments,
      totalCourses,
      totalFeeCollected,
      totalFeePending,
      activeAnnouncements: data.announcements.length,
      openComplaints: data.complaints.filter(c => c.status !== 'Resolved').length
    };
  },

  getCourses: () => {
    const data = readDb();
    return data.courses;
  },

  getDepartments: () => {
    const data = readDb();
    return data.departments;
  },

  addDepartment: (dept) => {
    const data = readDb();
    const newDept = {
      id: `dept_${Date.now()}`,
      code: dept.code,
      name: dept.name,
      head: dept.head,
      studentsCount: 0,
      facultyCount: 0,
      established: new Date().getFullYear()
    };
    data.departments.push(newDept);
    writeDb(data);
    return newDept;
  },

  addCourse: (crs) => {
    const data = readDb();
    const newCrs = {
      code: crs.code,
      name: crs.name,
      credits: Number(crs.credits) || 3,
      department: crs.department,
      semester: crs.semester || "Semester 5",
      facultyId: crs.facultyId,
      facultyName: crs.facultyName,
      room: crs.room || "Hall 301",
      type: crs.type || "Theory"
    };
    data.courses.push(newCrs);
    writeDb(data);
    return newCrs;
  },

  // Examinations
  getExaminations: () => {
    const data = readDb();
    return data.examinations || [];
  },

  // Library
  getLibrary: () => {
    const data = readDb();
    return data.library || { issuedBooks: [], catalog: [] };
  },

  renewBook: (accessionNo) => {
    const data = readDb();
    if (!data.library || !data.library.issuedBooks) return null;
    const book = data.library.issuedBooks.find(b => b.accessionNo === accessionNo);
    if (!book) return null;
    book.status = "Renewed";
    const curDue = new Date(book.dueDate);
    curDue.setDate(curDue.getDate() + 14); // extend 14 days
    book.dueDate = curDue.toISOString().split('T')[0];
    writeDb(data);
    return book;
  },

  // Hostel & Transport
  getHostelTransport: () => {
    const data = readDb();
    return data.hostelTransport || { hostel: {}, gatePasses: [], transport: {} };
  },

  applyGatePass: (gp) => {
    const data = readDb();
    if (!data.hostelTransport) data.hostelTransport = { hostel: {}, gatePasses: [], transport: {} };
    const newPass = {
      id: `GP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      type: gp.type || "Day Outing",
      date: gp.date || new Date().toISOString().split('T')[0],
      outTime: gp.outTime || "10:00 AM",
      inTime: gp.inTime || "08:00 PM",
      reason: gp.reason || "Personal errand",
      status: "Approved",
      approvedBy: "Warden Auto-Verification"
    };
    data.hostelTransport.gatePasses.unshift(newPass);
    writeDb(data);
    return newPass;
  },

  // Certificates
  getCertificates: () => {
    const data = readDb();
    return data.certificates || [];
  },

  requestCertificate: (cert) => {
    const data = readDb();
    if (!data.certificates) data.certificates = [];
    const newCert = {
      id: `CERT-${new Date().getFullYear()}-${String(data.certificates.length + 1).padStart(3, '0')}`,
      type: cert.type || "Bonafide Certificate",
      purpose: cert.purpose || "Official identification requirement",
      requestDate: new Date().toISOString().split('T')[0],
      status: "Ready for Download",
      isDownloadable: true,
      issuedDate: new Date().toISOString().split('T')[0],
      signatory: "Registrar Arthur Sterling"
    };
    data.certificates.unshift(newCert);
    writeDb(data);
    return newCert;
  },

  // Placements
  getPlacements: () => {
    const data = readDb();
    return data.placements || [];
  },

  applyPlacement: (jobId) => {
    const data = readDb();
    if (!data.placements) return null;
    const job = data.placements.find(j => j.id === jobId);
    if (!job) return null;
    job.studentStatus = "Applied - Resume Under Review";
    writeDb(data);
    return job;
  },

  // Feedback
  getFeedback: () => {
    const data = readDb();
    return data.courseFeedback || [];
  },

  submitFeedback: (courseCode, rating, comments) => {
    const data = readDb();
    if (!data.courseFeedback) return null;
    const item = data.courseFeedback.find(f => f.courseCode === courseCode);
    if (item) {
      item.rating = Number(rating);
      item.comments = comments;
      item.submitted = true;
    } else {
      data.courseFeedback.push({
        courseCode,
        courseName: courseCode,
        instructor: "Faculty",
        submitted: true,
        rating: Number(rating),
        comments
      });
    }
    writeDb(data);
    return item;
  }
};
