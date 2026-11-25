import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Calendar, 
  User, 
  Tag, 
  Paperclip, 
  ChevronRight, 
  Download, 
  X,
  Building,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AnnouncementsView({ announcements }) {
  const { showToast } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeModalAnn, setActiveModalAnn] = useState(null);

  const categories = ['ALL', 'Examination', 'Department', 'Events', 'College'];
  const list = announcements || [];

  const filtered = list.filter(item => {
    const matchCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                        item.content.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleDownloadAttachment = (attachmentName) => {
    showToast(`Downloading attachment: ${attachmentName}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Search */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Institutional Notices & Circulars
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official announcements, examination advisories, and campus event broadcasts
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search circulars..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 outline-none"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveModalAnn(item)}
            className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:border-brand-300 hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  item.priority === 'Urgent'
                    ? 'bg-rose-100 text-rose-700'
                    : item.priority === 'Important'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {item.category}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {item.date} • {item.department}
                </span>
              </div>

              <span className="text-xs font-semibold text-brand-600 group-hover:translate-x-1 transition flex items-center gap-1">
                Read Notice <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition">
              {item.title}
            </h3>

            <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
              {item.content}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5" /> Issued by: {item.author}
              </span>
              {item.attachment && (
                <span className="flex items-center gap-1 text-brand-600 font-semibold bg-brand-50 px-2.5 py-0.5 rounded-lg">
                  <Paperclip className="w-3 h-3" /> {item.attachment}
                </span>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No circulars match your search.</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting the category filter or searching different terms.</p>
          </div>
        )}
      </div>

      {/* Full Notice Modal */}
      {activeModalAnn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                activeModalAnn.priority === 'Urgent'
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-brand-50 text-brand-700'
              }`}>
                {activeModalAnn.category} Circular
              </span>
              <button
                onClick={() => setActiveModalAnn(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4">
              <h2 className="text-lg font-bold text-slate-900 leading-snug">
                {activeModalAnn.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2 font-medium">
                <span>Date: <strong>{activeModalAnn.date}</strong></span>
                <span>•</span>
                <span>Target: <strong>{activeModalAnn.department}</strong></span>
                <span>•</span>
                <span>Author: <strong>{activeModalAnn.author}</strong></span>
              </div>

              <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed space-y-3">
                <p>{activeModalAnn.content}</p>
                <p className="text-slate-500 italic">
                  For clarifications regarding this circular, contact the administrative desk or the departmental coordinator during standard working hours.
                </p>
              </div>

              {activeModalAnn.attachment && (
                <div className="mt-4 p-3.5 bg-blue-50/70 border border-brand-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Paperclip className="w-4 h-4 text-brand-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">{activeModalAnn.attachment}</p>
                      <span className="text-[10px] text-slate-400">Official Annexure PDF Document</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadAttachment(activeModalAnn.attachment)}
                    className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-slate-100 text-right">
                <button
                  onClick={() => setActiveModalAnn(null)}
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                >
                  Close Circular
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
