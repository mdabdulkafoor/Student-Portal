import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  BookOpen, 
  User, 
  Calendar, 
  Layers, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function StudyMaterialsView({ materials }) {
  const { showToast } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedCourse, setSelectedCourse] = useState('ALL');

  const categories = ['ALL', 'Lecture Notes', 'Lab Manual', 'Previous Year Papers'];
  const list = materials || [];

  const uniqueCourses = Array.from(new Set(list.map(m => m.courseCode)));

  const filtered = list.filter(item => {
    const matchCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchCourse = selectedCourse === 'ALL' || item.courseCode === selectedCourse;
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                        item.description.toLowerCase().includes(search.toLowerCase()) ||
                        item.courseCode.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchCourse && matchSearch;
  });

  const handleDownload = (item) => {
    showToast(`Downloading: ${item.title} (${item.fileSize})`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header and Search */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Academic Courseware & Study Materials
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Faculty-uploaded lecture notes, laboratory manuals, and previous year university question papers
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes, algorithms..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 outline-none"
          />
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course Filter Dropdown */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-bold text-slate-400 uppercase">Course:</span>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="ALL">All Subjects</option>
            {uniqueCourses.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200/60">
                    {item.courseCode}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {item.courseName}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                  {item.fileType} • {item.fileSize}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                {item.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <User className="w-3.5 h-3.5 text-slate-400" /> {item.facultyName}
                </span>
                <span>Uploaded: {item.uploadDate}</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">
                {item.downloadsCount} downloads
              </span>
              <button
                onClick={() => handleDownload(item)}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/30 flex items-center gap-1.5 transition"
              >
                <Download className="w-4 h-4" />
                Download Document
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-2 p-12 text-center bg-white rounded-3xl border border-slate-200/80">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No study materials match your filter.</p>
            <p className="text-xs text-slate-400 mt-1">Try switching to All Subjects or selecting another category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
