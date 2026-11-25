import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Shield, 
  Heart, 
  Edit3, 
  Save, 
  X, 
  Camera, 
  Building, 
  BookOpen, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';

export default function ProfileView({ student, onUpdateProfile }) {
  const { showToast } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Editable Form State
  const [formData, setFormData] = useState({
    phone: student?.phone || '',
    altPhone: student?.altPhone || '',
    address: student?.address || '',
    photo: student?.photo || '',
    parent: {
      fatherName: student?.parent?.fatherName || '',
      fatherOccupation: student?.parent?.fatherOccupation || '',
      motherName: student?.parent?.motherName || '',
      motherOccupation: student?.parent?.motherOccupation || '',
      guardianPhone: student?.parent?.guardianPhone || '',
      guardianEmail: student?.parent?.guardianEmail || '',
      emergencyContact: student?.parent?.emergencyContact || '',
      homeAddress: student?.parent?.homeAddress || ''
    }
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.updateStudentProfile(student.id, formData);
      if (res.success) {
        onUpdateProfile(res.student);
        showToast('Student profile details updated successfully!');
        setIsEditing(false);
      }
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5 sm:gap-6">
            <div className="relative group">
              <img
                src={student?.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                alt={student?.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-brand-500/20 shadow-md"
              />
              <button
                onClick={() => setIsEditing(true)}
                className="absolute inset-0 bg-slate-900/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                title="Change Photo"
              >
                <Camera className="w-6 h-6" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {student?.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Enrolled Active
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-brand-700 mt-1">
                {student?.program} • {student?.department}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 font-medium">
                <span>Reg No: <strong className="text-slate-800">{student?.registerNo}</strong></span>
                <span>•</span>
                <span>Roll No: <strong className="text-slate-800">{student?.rollNo}</strong></span>
                <span>•</span>
                <span>Advisor: <strong className="text-slate-800">{student?.advisor}</strong></span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/30 flex items-center justify-center gap-2 transition self-start md:self-auto"
          >
            <Edit3 className="w-4 h-4" />
            Edit Profile Information
          </button>
        </div>
      </div>

      {/* Main Grid: 4 Pillars of Profile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 1. Personal Information */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Personal Information</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-medium">Full Legal Name</span>
              <p className="font-bold text-slate-800 mt-0.5">{student?.name}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Date of Birth</span>
              <p className="font-bold text-slate-800 mt-0.5">{student?.dob || '2003-08-14'}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Gender</span>
              <p className="font-bold text-slate-800 mt-0.5">{student?.gender || 'Male'}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Blood Group</span>
              <p className="font-bold text-slate-800 mt-0.5">{student?.bloodGroup || 'O+'}</p>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 font-medium">Current Residential Address</span>
              <p className="font-bold text-slate-800 mt-0.5 leading-relaxed">{student?.address}</p>
            </div>
          </div>
        </div>

        {/* 2. Contact Details */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Contact Details</h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <span className="text-slate-400 font-medium">Institutional Email</span>
              <p className="font-bold text-brand-700 mt-0.5">{student?.email}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Primary Mobile Number</span>
              <p className="font-bold text-slate-800 mt-0.5">{student?.phone}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Alternate Contact Phone</span>
              <p className="font-bold text-slate-800 mt-0.5">{student?.altPhone || 'Not Provided'}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Emergency Help Contact</span>
              <p className="font-bold text-rose-700 mt-0.5">{student?.parent?.emergencyContact}</p>
            </div>
          </div>
        </div>

        {/* 3. Academic Details */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Academic Details</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-medium">Department</span>
              <p className="font-bold text-slate-800 mt-0.5">{student?.deptCode} ({student?.department})</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Degree Program</span>
              <p className="font-bold text-slate-800 mt-0.5">{student?.program}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Year & Semester</span>
              <p className="font-bold text-slate-800 mt-0.5">{student?.year} - {student?.semester}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Batch & Academic Year</span>
              <p className="font-bold text-slate-800 mt-0.5">{student?.batch} ({student?.academicYear})</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Admission Date</span>
              <p className="font-bold text-slate-800 mt-0.5">{student?.admissionDate}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Section & Roll</span>
              <p className="font-bold text-slate-800 mt-0.5">Section {student?.section} • #{student?.rollNo}</p>
            </div>
          </div>
        </div>

        {/* 4. Parent / Guardian Details */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Parent / Guardian Information</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-medium">Father's Name</span>
              <p className="font-bold text-slate-800 mt-0.5">{student?.parent?.fatherName}</p>
              <span className="text-[11px] text-slate-400">{student?.parent?.fatherOccupation}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Mother's Name</span>
              <p className="font-bold text-slate-800 mt-0.5">{student?.parent?.motherName}</p>
              <span className="text-[11px] text-slate-400">{student?.parent?.motherOccupation}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Guardian Phone</span>
              <p className="font-bold text-slate-800 mt-0.5">{student?.parent?.guardianPhone}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Guardian Email</span>
              <p className="font-bold text-slate-800 mt-0.5">{student?.parent?.guardianEmail}</p>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 font-medium">Permanent Home Address</span>
              <p className="font-bold text-slate-800 mt-0.5 leading-relaxed">{student?.parent?.homeAddress}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Edit Student Profile Details</h3>
                  <p className="text-xs text-slate-400">Update personal contacts and emergency details</p>
                </div>
              </div>
              <button 
                onClick={() => setIsEditing(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Primary Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Alternate Phone
                  </label>
                  <input
                    type="text"
                    value={formData.altPhone}
                    onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Avatar Photo URL
                  </label>
                  <input
                    type="url"
                    value={formData.photo}
                    onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Current Residential Address
                  </label>
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Guardian Phone
                  </label>
                  <input
                    type="text"
                    value={formData.parent.guardianPhone}
                    onChange={(e) => setFormData({
                      ...formData,
                      parent: { ...formData.parent, guardianPhone: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Guardian Email
                  </label>
                  <input
                    type="email"
                    value={formData.parent.guardianEmail}
                    onChange={(e) => setFormData({
                      ...formData,
                      parent: { ...formData.parent, guardianEmail: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/30 flex items-center gap-2"
                >
                  {saving ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
