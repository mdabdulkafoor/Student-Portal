import React, { useState } from 'react';
import { 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  Award, 
  Send,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';

export default function FeedbackView({ feedback, onRefresh }) {
  const { showToast } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState('CS503');
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fbList = feedback || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comments.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.submitFeedback({
        courseCode: selectedCourse,
        rating,
        comments
      });

      if (res.success) {
        showToast(`Feedback submitted for ${selectedCourse}! Thank you for your review.`);
        setComments('');
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      showToast('Error saving feedback', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Academic Feedback & Course Evaluation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Confidential student feedback to improve teaching quality, syllabus delivery, and laboratory resources
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Feedback Survey Form (7 cols) */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 text-base mb-1">Submit Course & Faculty Review</h3>
          <p className="text-xs text-slate-400 mb-5">Your candid evaluation is anonymous and helps enhance curriculum delivery</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Select Course & Faculty
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
              >
                <option value="CS501">CS501: Advanced DBMS (Dr. Sarah Jenkins)</option>
                <option value="CS502">CS502: Cloud Computing (Prof. David Chen)</option>
                <option value="CS503">CS503: AI & Machine Learning (Dr. Sarah Jenkins)</option>
                <option value="CS504">CS504: Computer Networks & Security (Prof. David Chen)</option>
                <option value="CS505">CS505: Software Engineering & Agile (Dr. Alan Wright)</option>
                <option value="CS506">CS506: Cloud & AI Practical Lab (Dr. Sarah Jenkins)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Overall Teaching & Clarity Rating (1 to 5 Stars)
              </label>
              <div className="flex items-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-slate-300 hover:text-amber-400 transition"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 ml-2">
                  {rating === 5 ? 'Excellent (5/5)' : rating === 4 ? 'Very Good (4/5)' : rating === 3 ? 'Good (3/5)' : 'Needs Improvement'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Constructive Remarks & Recommendations
              </label>
              <textarea
                rows={4}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Share your thoughts on lecture pacing, lab materials, coding exercises, or office hours availability..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-brand-500/20"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/30 flex items-center justify-center gap-2 transition"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Submitting Evaluation...' : 'Submit Evaluation'}
            </button>
          </form>
        </div>

        {/* Evaluation History Box (5 cols) */}
        <div className="md:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Submitted Feedback Records</h3>
            <p className="text-xs text-slate-400 mb-4">Reviews recorded for Semester 5</p>

            <div className="space-y-3">
              {fbList.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-brand-700">{item.courseCode}</span>
                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {item.rating || 5}/5
                    </span>
                  </div>
                  <p className="text-slate-800 font-semibold">{item.courseName}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Faculty: {item.instructor}</p>
                  {item.comments && (
                    <p className="text-slate-600 italic mt-2 text-[11px] bg-white p-2 rounded-lg border border-slate-100">
                      "{item.comments}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            All submitted student ratings are compiled directly for Institutional Quality Assurance (IQAC).
          </div>
        </div>

      </div>
    </div>
  );
}
