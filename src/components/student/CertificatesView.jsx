import React, { useState } from 'react';
import { 
  FileCheck2, 
  Download, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  X,
  ShieldCheck,
  Building
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { generateBonafidePDF } from '../../utils/pdfGenerator';
import { api } from '../../api';

export default function CertificatesView({ student, certificates, onRefresh }) {
  const { showToast } = useAuth();
  const [requestModal, setRequestModal] = useState(false);
  const [certType, setCertType] = useState('Bonafide Certificate');
  const [purpose, setPurpose] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const certList = certificates || [];

  const handleDownloadCertificate = (cert) => {
    if (cert.type === 'Bonafide Certificate' && student) {
      const filename = generateBonafidePDF(student, cert.purpose);
      showToast(`Downloaded Official Certificate: ${filename}`);
    } else {
      showToast(`Downloaded: ${cert.type} (PDF)`);
    }
  };

  const handleRequestCertificate = async (e) => {
    e.preventDefault();
    if (!purpose.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.requestCertificate({
        studentId: student?.id,
        type: certType,
        purpose
      });

      if (res.success) {
        showToast('Certificate generated and ready for immediate download!');
        setRequestModal(false);
        setPurpose('');
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      showToast('Error requesting certificate', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Institutional Certificates & Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official digital documents, bonafide credentials, and registrar certification letters
          </p>
        </div>

        <button
          onClick={() => setRequestModal(true)}
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/30 flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Request Official Document
        </button>
      </div>

      {/* Certificates List */}
      <div className="space-y-4">
        {certList.map((cert) => (
          <div
            key={cert.id}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand-300 transition"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-400">{cert.id}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">
                    {cert.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{cert.type}</h3>
                <p className="text-xs text-slate-600 mt-1">Stated Purpose: <strong className="text-slate-700">{cert.purpose}</strong></p>
                <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-2 font-medium">
                  <span>Requested: {cert.requestDate}</span>
                  <span>•</span>
                  <span>Signatory: {cert.signatory}</span>
                </div>
              </div>
            </div>

            {cert.isDownloadable && (
              <button
                onClick={() => handleDownloadCertificate(cert)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition self-start sm:self-auto"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Request Modal */}
      {requestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Request Official Certificate</h3>
              <button onClick={() => setRequestModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestCertificate} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Document Category</label>
                <select
                  value={certType}
                  onChange={(e) => setCertType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  <option value="Bonafide Certificate">Bonafide Certificate (Immediate PDF)</option>
                  <option value="Tuition Fee Estimation Certificate">Tuition Fee Estimation Certificate</option>
                  <option value="Medium of Instruction Certificate">Medium of Instruction Certificate</option>
                  <option value="Academic Transcript Copy">Official Academic Transcript Copy</option>
                  <option value="No Objection Certificate (NOC)">No Objection Certificate (NOC)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Purpose / Recipient Agency</label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Visa Processing / Bank Education Loan / Internship"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  required
                />
              </div>

              <div className="p-3 bg-blue-50/70 rounded-xl text-xs text-blue-900 border border-blue-200">
                <p className="font-bold">Digital Attestation</p>
                Documents issued are sealed with the institutional QR verification seal by the Office of the Registrar.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setRequestModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600">Cancel</button>
                <button type="submit" disabled={submitting} className="px-5 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold">Generate Certificate</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
