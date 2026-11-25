import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function generateMarksheetPDF(student, semResult) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Colors
  const navy = [30, 58, 138];
  const gold = [217, 119, 6];
  const darkGray = [51, 65, 85];
  const lightGray = [241, 245, 249];

  // Header Banner
  doc.setFillColor(...navy);
  doc.rect(0, 0, 210, 32, 'F');

  // University Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('APEX INSTITUTE OF TECHNOLOGY', 105, 12, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Autonomous Institution Affiliated to State Technological University | Accredited A++ Grade', 105, 18, { align: 'center' });
  doc.text('Tech Corridor, Silicon Valley, CA 94025 | www.apexuniv.edu', 105, 23, { align: 'center' });

  // Subheader
  doc.setFillColor(...gold);
  doc.rect(0, 32, 210, 2, 'F');

  doc.setTextColor(...navy);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('OFFICIAL GRADE REPORT & STATEMENT OF MARKS', 105, 42, { align: 'center' });

  // Student Info Box
  doc.setFillColor(...lightGray);
  doc.roundedRect(14, 46, 182, 34, 3, 3, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, 46, 182, 34, 3, 3, 'S');

  doc.setFontSize(9);
  doc.setTextColor(...darkGray);

  // Left Column
  doc.setFont('helvetica', 'bold');
  doc.text('Student Name:', 20, 53);
  doc.setFont('helvetica', 'normal');
  doc.text(student.name || 'Alex Morgan', 56, 53);

  doc.setFont('helvetica', 'bold');
  doc.text('Register Number:', 20, 60);
  doc.setFont('helvetica', 'normal');
  doc.text(student.registerNo || '2022CS1042', 56, 60);

  doc.setFont('helvetica', 'bold');
  doc.text('Program / Degree:', 20, 67);
  doc.setFont('helvetica', 'normal');
  doc.text(student.program || 'B.Tech - Computer Science', 56, 67);

  doc.setFont('helvetica', 'bold');
  doc.text('Department:', 20, 74);
  doc.setFont('helvetica', 'normal');
  doc.text(student.department || 'Computer Science & Engineering', 56, 74);

  // Right Column
  doc.setFont('helvetica', 'bold');
  doc.text('Examination:', 116, 53);
  doc.setFont('helvetica', 'normal');
  doc.text(semResult.semester || 'Semester 5', 150, 53);

  doc.setFont('helvetica', 'bold');
  doc.text('Academic Year:', 116, 60);
  doc.setFont('helvetica', 'normal');
  doc.text(student.academicYear || '2024 - 2025', 150, 60);

  doc.setFont('helvetica', 'bold');
  doc.text('Result Status:', 116, 67);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(22, 101, 52); // green
  doc.text(semResult.status || 'PASS / FINALIZED', 150, 67);
  doc.setTextColor(...darkGray);

  doc.setFont('helvetica', 'bold');
  doc.text('Date of Issue:', 116, 74);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), 150, 74);

  // Table of Subjects
  const tableRows = (semResult.subjects || []).map((s, idx) => [
    idx + 1,
    s.code,
    s.name,
    s.credits,
    s.internal,
    s.external,
    s.total,
    s.grade,
    s.gradePoint,
    'PASS'
  ]);

  autoTable(doc, {
    startY: 85,
    head: [[
      '#',
      'Course Code',
      'Course Title',
      'Credits',
      'Internal (40)',
      'External (60)',
      'Total (100)',
      'Grade',
      'Points',
      'Result'
    ]],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: navy,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 22, halign: 'center' },
      2: { cellWidth: 62 },
      3: { cellWidth: 14, halign: 'center' },
      4: { cellWidth: 18, halign: 'center' },
      5: { cellWidth: 18, halign: 'center' },
      6: { cellWidth: 16, halign: 'center', fontStyle: 'bold' },
      7: { cellWidth: 14, halign: 'center', fontStyle: 'bold' },
      8: { cellWidth: 12, halign: 'center' },
      9: { cellWidth: 14, halign: 'center', textColor: [22, 101, 52], fontStyle: 'bold' }
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.5
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    }
  });

  const finalY = doc.lastAutoTable.finalY + 8;

  // Performance Summary Card
  doc.setFillColor(...lightGray);
  doc.roundedRect(14, finalY, 182, 22, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, finalY, 182, 22, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...navy);
  doc.text('SEMESTER PERFORMANCE SUMMARY', 20, finalY + 7);

  doc.setTextColor(...darkGray);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Credits Registered: ${semResult.totalCredits || 19}`, 20, finalY + 15);
  doc.text(`Credits Earned: ${semResult.creditsEarned || semResult.totalCredits || 19}`, 75, finalY + 15);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(37, 99, 235);
  doc.text(`SGPA: ${semResult.gpa || 8.95}`, 130, finalY + 15);
  doc.text(`CGPA: ${student.cgpa || 8.92}`, 165, finalY + 15);

  // Grading System Guide
  const guideY = finalY + 28;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...navy);
  doc.text('GRADING SCALE: ', 14, guideY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkGray);
  doc.text('O: 90-100 (Points: 10) | A+: 80-89 (Points: 9) | A: 70-79 (Points: 8) | B+: 60-69 (Points: 7) | B: 50-59 (Points: 6) | F: Below 50 (Fail)', 40, guideY);

  // Signatures
  const sigY = guideY + 24;
  doc.setDrawColor(148, 163, 184);
  doc.line(20, sigY, 70, sigY);
  doc.line(140, sigY, 190, sigY);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Prepared & Verified By', 45, sigY + 5, { align: 'center' });
  doc.text('Academic Coordinator', 45, sigY + 9, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.text('Dr. Richard Sterling, Ph.D.', 165, sigY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text('Controller of Examinations', 165, sigY + 9, { align: 'center' });

  // Official Seal representation
  doc.setDrawColor(...navy);
  doc.setLineWidth(0.5);
  doc.circle(105, sigY + 2, 12, 'S');
  doc.setFontSize(6.5);
  doc.setTextColor(...navy);
  doc.text('OFFICIAL SEAL', 105, sigY + 1, { align: 'center' });
  doc.text('APEX UNIV', 105, sigY + 5, { align: 'center' });

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('This is an authentic digital grade report generated via Apex Student Portal. Verification code: ' + Math.random().toString(36).substring(2, 10).toUpperCase(), 105, 287, { align: 'center' });

  // Save the PDF
  const filename = `Apex_Marksheet_${student.registerNo || '2022CS1042'}_${(semResult.semester || 'Sem5').replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
  return filename;
}

export function generateFeeReceiptPDF(student, receipt) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const navy = [30, 58, 138];
  const darkGray = [51, 65, 85];
  const lightGray = [241, 245, 249];

  // Header banner
  doc.setFillColor(...navy);
  doc.rect(0, 0, 210, 30, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('APEX INSTITUTE OF TECHNOLOGY', 105, 12, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Office of the Comptroller & Student Accounts | Silicon Valley, CA 94025', 105, 18, { align: 'center' });
  doc.text('Phone: +1 (555) 019-2834 | Email: fees@apexuniv.edu', 105, 23, { align: 'center' });

  // Receipt Title
  doc.setTextColor(...navy);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('OFFICIAL FEE PAYMENT RECEIPT', 105, 40, { align: 'center' });

  // Receipt Number & Date Box
  doc.setFillColor(...lightGray);
  doc.roundedRect(14, 46, 182, 30, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, 46, 182, 30, 2, 2, 'S');

  doc.setFontSize(9);
  doc.setTextColor(...darkGray);

  doc.setFont('helvetica', 'bold');
  doc.text('Receipt No:', 20, 54);
  doc.setFont('helvetica', 'normal');
  doc.text(receipt.receiptNo || 'APEX-2026-S5-042', 50, 54);

  doc.setFont('helvetica', 'bold');
  doc.text('Transaction ID:', 20, 62);
  doc.setFont('helvetica', 'normal');
  doc.text(receipt.transactionId || 'TXN9842187654', 50, 62);

  doc.setFont('helvetica', 'bold');
  doc.text('Payment Date:', 20, 70);
  doc.setFont('helvetica', 'normal');
  doc.text(receipt.date || new Date().toISOString().split('T')[0], 50, 70);

  doc.setFont('helvetica', 'bold');
  doc.text('Semester:', 116, 54);
  doc.setFont('helvetica', 'normal');
  doc.text(receipt.semester || 'Semester 5', 145, 54);

  doc.setFont('helvetica', 'bold');
  doc.text('Payment Method:', 116, 62);
  doc.setFont('helvetica', 'normal');
  doc.text(receipt.paymentMethod || 'Credit Card (Visa)', 145, 62);

  doc.setFont('helvetica', 'bold');
  doc.text('Payment Status:', 116, 70);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 101, 52);
  doc.text('PAID & CONFIRMED', 145, 70);
  doc.setTextColor(...darkGray);

  // Student Info Row
  doc.setFont('helvetica', 'bold');
  doc.text('Student Name: ', 14, 84);
  doc.setFont('helvetica', 'normal');
  doc.text(student.name || 'Alex Morgan', 40, 84);

  doc.setFont('helvetica', 'bold');
  doc.text('Register No: ', 116, 84);
  doc.setFont('helvetica', 'normal');
  doc.text(student.registerNo || '2022CS1042', 140, 84);

  // Fee Table
  autoTable(doc, {
    startY: 90,
    head: [[
      '#',
      'Description / Fee Category',
      'Term',
      'Amount (USD)'
    ]],
    body: [
      ['1', receipt.description || 'Semester Tuition & Institutional Facilities Fee', receipt.semester || 'Sem 5', `$${receipt.amount?.toLocaleString() || '3,000'}.00`],
      ['2', 'University Examination & Assessment Registration Fee', receipt.semester || 'Sem 5', '$0.00 (Included)'],
      ['3', 'High-Speed Computing Lab & Internet Bandwidth Levy', receipt.semester || 'Sem 5', '$0.00 (Included)']
    ],
    theme: 'striped',
    headStyles: {
      fillColor: navy,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 110 },
      2: { cellWidth: 30, halign: 'center' },
      3: { cellWidth: 32, halign: 'right', fontStyle: 'bold' }
    },
    styles: { fontSize: 8.5, cellPadding: 3 }
  });

  const finalY = doc.lastAutoTable.finalY + 6;

  // Total Box
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(120, finalY, 76, 14, 2, 2, 'F');
  doc.setDrawColor(34, 197, 94);
  doc.roundedRect(120, finalY, 76, 14, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(22, 101, 52);
  doc.text('TOTAL PAID:', 125, finalY + 9);
  doc.text(`$${receipt.amount?.toLocaleString() || '3,000'}.00`, 190, finalY + 9, { align: 'right' });

  // Paid Stamp
  doc.setFontSize(12);
  doc.setTextColor(22, 101, 52);
  doc.setDrawColor(22, 101, 52);
  doc.setLineWidth(0.8);
  doc.roundedRect(20, finalY, 45, 14, 2, 2, 'S');
  doc.text('PAID / CLEARED', 42.5, finalY + 9, { align: 'center' });

  // Authorized Signatures
  const sigY = finalY + 45;
  doc.setDrawColor(148, 163, 184);
  doc.line(130, sigY, 185, sigY);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkGray);
  doc.text('Finance & Accounts Officer', 157.5, sigY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text('Apex Institute of Technology', 157.5, sigY + 9, { align: 'center' });

  // Footer notes
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Note: This is a system-generated computer receipt and does not require a physical signature.', 14, 275);
  doc.text('For billing questions or tax deduction certificates, contact bursar@apexuniv.edu.', 14, 280);

  const filename = `Apex_Fee_Receipt_${receipt.receiptNo || 'APEX-2026'}.pdf`;
  doc.save(filename);
  return filename;
}

export function generateHallTicketPDF(student, exams) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const navy = [30, 58, 138];
  const darkGray = [51, 65, 85];
  const lightGray = [241, 245, 249];

  // Header banner
  doc.setFillColor(...navy);
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('APEX INSTITUTE OF TECHNOLOGY', 105, 12, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('OFFICE OF THE CONTROLLER OF EXAMINATIONS | AUTONOMOUS', 105, 18, { align: 'center' });
  doc.text('END-SEMESTER UNIVERSITY FINAL EXAMINATIONS - FALL 2026', 105, 24, { align: 'center' });

  // Title
  doc.setTextColor(...navy);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('EXAMINATION HALL TICKET / ADMIT CARD', 105, 42, { align: 'center' });

  // Student Details Box
  doc.setFillColor(...lightGray);
  doc.roundedRect(14, 48, 182, 38, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, 48, 182, 38, 2, 2, 'S');

  doc.setFontSize(9);
  doc.setTextColor(...darkGray);

  doc.setFont('helvetica', 'bold');
  doc.text('Candidate Name:', 20, 56);
  doc.setFont('helvetica', 'normal');
  doc.text(student.name || 'Alex Morgan', 58, 56);

  doc.setFont('helvetica', 'bold');
  doc.text('Register Number:', 20, 64);
  doc.setFont('helvetica', 'normal');
  doc.text(student.registerNo || '2022CS1042', 58, 64);

  doc.setFont('helvetica', 'bold');
  doc.text('Degree & Branch:', 20, 72);
  doc.setFont('helvetica', 'normal');
  doc.text(`${student.program || 'B.Tech'} - ${student.deptCode || 'CSE'}`, 58, 72);

  doc.setFont('helvetica', 'bold');
  doc.text('Semester & Section:', 20, 80);
  doc.setFont('helvetica', 'normal');
  doc.text(`${student.semester || 'Semester 5'} - Section ${student.section || 'A'}`, 58, 80);

  // Right column
  doc.setFont('helvetica', 'bold');
  doc.text('Exam Center:', 116, 56);
  doc.setFont('helvetica', 'normal');
  doc.text('Apex Main Campus (Block A)', 148, 56);

  doc.setFont('helvetica', 'bold');
  doc.text('Seat Allotment:', 116, 64);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(37, 99, 235);
  doc.text('EH1-A42', 148, 64);
  doc.setTextColor(...darkGray);

  doc.setFont('helvetica', 'bold');
  doc.text('Attendance Status:', 116, 72);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 101, 52);
  doc.text('ELIGIBLE (88.4%)', 148, 72);
  doc.setTextColor(...darkGray);

  doc.setFont('helvetica', 'bold');
  doc.text('Date of Issue:', 116, 80);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString(), 148, 80);

  // Schedule Table
  const examRows = (exams || [
    { courseCode: 'CS501', courseName: 'Advanced Database Management Systems', date: '2026-12-14', time: '09:30 AM - 12:30 PM', hall: 'Exam Hall 1' },
    { courseCode: 'CS502', courseName: 'Cloud Computing & Microservices', date: '2026-12-16', time: '09:30 AM - 12:30 PM', hall: 'Exam Hall 1' },
    { courseCode: 'CS503', courseName: 'Artificial Intelligence & Machine Learning', date: '2026-12-18', time: '09:30 AM - 12:30 PM', hall: 'Exam Hall 2' },
    { courseCode: 'CS504', courseName: 'Computer Networks & Security', date: '2026-12-21', time: '09:30 AM - 12:30 PM', hall: 'Exam Hall 2' },
    { courseCode: 'CS505', courseName: 'Software Engineering & Agile Methodology', date: '2026-12-23', time: '09:30 AM - 12:30 PM', hall: 'Exam Hall 1' }
  ]).map((e, idx) => [
    idx + 1,
    e.date,
    e.time,
    e.courseCode,
    e.courseName,
    e.hall || 'Exam Hall 1',
    '' // signature box
  ]);

  autoTable(doc, {
    startY: 92,
    head: [[
      '#',
      'Date of Exam',
      'Timing Session',
      'Course Code',
      'Subject Title',
      'Hall Venue',
      'Invigilator Sign'
    ]],
    body: examRows,
    theme: 'grid',
    headStyles: {
      fillColor: navy,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 24, halign: 'center' },
      2: { cellWidth: 34, halign: 'center' },
      3: { cellWidth: 22, halign: 'center', fontStyle: 'bold' },
      4: { cellWidth: 50 },
      5: { cellWidth: 22, halign: 'center' },
      6: { cellWidth: 22 }
    },
    styles: { fontSize: 8, cellPadding: 2.5 }
  });

  const finalY = doc.lastAutoTable.finalY + 8;

  // Instructions Box
  doc.setFillColor(...lightGray);
  doc.roundedRect(14, finalY, 182, 34, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, finalY, 182, 34, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...navy);
  doc.text('CRITICAL INSTRUCTIONS FOR CANDIDATES:', 20, finalY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...darkGray);
  doc.text('1. Candidates must carry this Hall Ticket alongside their physical Institutional Student ID Card.', 20, finalY + 12);
  doc.text('2. Entry into the examination hall closes strictly 15 minutes after the scheduled commencement time.', 20, finalY + 17);
  doc.text('3. Mobile phones, smartwatches, programmable calculators, or unauthorized study sheets are strictly prohibited.', 20, finalY + 22);
  doc.text('4. Any form of malpractice will result in immediate disqualification and disciplinary tribunal action.', 20, finalY + 27);

  // Signatures
  const sigY = finalY + 48;
  doc.setDrawColor(148, 163, 184);
  doc.line(20, sigY, 70, sigY);
  doc.line(140, sigY, 190, sigY);

  doc.setFontSize(8);
  doc.text('Candidate Full Signature', 45, sigY + 5, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.text('Controller of Examinations', 165, sigY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text('Apex Institute of Technology', 165, sigY + 9, { align: 'center' });

  const filename = `Apex_Hall_Ticket_${student.registerNo || '2022CS1042'}_Fall2026.pdf`;
  doc.save(filename);
  return filename;
}

export function generateBonafidePDF(student, reason = 'General Academic Verification') {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const navy = [30, 58, 138];
  const darkGray = [51, 65, 85];

  // Header banner
  doc.setFillColor(...navy);
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('APEX INSTITUTE OF TECHNOLOGY', 105, 12, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Accredited A++ Grade Autonomous University | Tech Corridor, Silicon Valley, CA', 105, 18, { align: 'center' });
  doc.text('Office of the Registrar | Web: www.apexuniv.edu | Email: registrar@apexuniv.edu', 105, 24, { align: 'center' });

  // Ref & Date
  const refNo = `APEX/REG/BONA/${new Date().getFullYear()}/${student.registerNo || '2022CS1042'}`;
  doc.setTextColor(...darkGray);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`Ref No: ${refNo}`, 20, 46);
  doc.text(`Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 150, 46);

  // Certificate Title
  doc.setTextColor(...navy);
  doc.setFontSize(16);
  doc.text('BONAFIDE CERTIFICATE', 105, 62, { align: 'center' });

  // Body Text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...darkGray);
  doc.setLineHeightFactor(1.6);

  const text1 = `This is to certify that Mr./Ms. ${student.name || 'Alex Morgan'}, son/daughter of ${student?.parent?.fatherName || 'Robert Morgan'}, bearing Register Number ${student.registerNo || '2022CS1042'}, is a bona fide regular student of this institution.`;
  const text2 = `He/She is currently pursuing the ${student.year || '3rd Year'} (${student.semester || 'Semester 5'}) of the ${student.program || 'Bachelor of Technology (B.Tech)'} degree program in the Department of ${student.department || 'Computer Science & Engineering'} for the Academic Year ${student.academicYear || '2024 - 2025'}.`;
  const text3 = `During his/her period of study, his/her conduct, academic progress, and character have been consistently found to be SATISFACTORY and exemplary.`;
  const text4 = `This certificate is issued upon the candidate's formal request for the explicit purpose of: ${reason}.`;

  const split1 = doc.splitTextToSize(text1, 170);
  const split2 = doc.splitTextToSize(text2, 170);
  const split3 = doc.splitTextToSize(text3, 170);
  const split4 = doc.splitTextToSize(text4, 170);

  doc.text(split1, 20, 80);
  doc.text(split2, 20, 102);
  doc.text(split3, 20, 126);
  doc.text(split4, 20, 144);

  // Official Seal
  doc.setDrawColor(...navy);
  doc.setLineWidth(0.8);
  doc.circle(50, 195, 16, 'S');
  doc.setFontSize(7.5);
  doc.setTextColor(...navy);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL SEAL', 50, 193, { align: 'center' });
  doc.text('APEX REGISTRAR', 50, 198, { align: 'center' });

  // Signature
  doc.line(130, 200, 185, 200);
  doc.setFontSize(9.5);
  doc.text('Dean Arthur Sterling', 157.5, 206, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Registrar & Academic Administrator', 157.5, 211, { align: 'center' });
  doc.text('Apex Institute of Technology', 157.5, 216, { align: 'center' });

  // Verification footer
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Official institutional document verified digitally via the Apex Academic Management Portal.', 105, 280, { align: 'center' });

  const filename = `Apex_Bonafide_Certificate_${student.registerNo || '2022CS1042'}.pdf`;
  doc.save(filename);
  return filename;
}
