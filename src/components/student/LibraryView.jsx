import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Bookmark, 
  ExternalLink,
  BookMarked
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';

export default function LibraryView({ library, onRefresh }) {
  const { showToast } = useAuth();
  const [searchCatalog, setSearchCatalog] = useState('');
  const [renewing, setRenewing] = useState(null);

  const issuedBooks = library?.issuedBooks || [];
  const catalog = library?.catalog || [];

  const handleRenew = async (accessionNo, title) => {
    setRenewing(accessionNo);
    try {
      const res = await api.renewBook(accessionNo);
      if (res.success) {
        showToast(`Book renewed: '${title}'. New due date is ${res.book.dueDate}.`);
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      showToast('Error renewing book loan', 'error');
    } finally {
      setRenewing(null);
    }
  };

  const filteredCatalog = catalog.filter(c =>
    c.title.toLowerCase().includes(searchCatalog.toLowerCase()) ||
    c.author.toLowerCase().includes(searchCatalog.toLowerCase()) ||
    c.category.toLowerCase().includes(searchCatalog.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Central Digital Library Services
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track active book loans, renew due dates, and search campus repository volumes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1.5 rounded-xl">
            {issuedBooks.length} Books Checked Out (Limit: 5)
          </span>
        </div>
      </div>

      {/* 1. Active Book Loans */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
        <div className="pb-4 border-b border-slate-100 flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <BookMarked className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Currently Issued Volumes</h3>
              <p className="text-xs text-slate-400">Return or renew before due date to avoid overdue charges</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {issuedBooks.map((book) => (
            <div
              key={book.id}
              className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-4 flex flex-col justify-between hover:border-brand-300 transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-[10px] font-bold text-brand-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {book.accessionNo}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    book.status === 'Renewed' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {book.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 line-clamp-2 mt-1">
                  {book.title}
                </h4>

                <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                  Author: {book.author}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-200/80 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Issued Date:</span>
                    <span className="font-semibold text-slate-700">{book.issuedDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Due Date:</span>
                    <span className="font-bold text-rose-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {book.dueDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Overdue Fines:</span>
                    <span className="font-bold text-emerald-600">$0.00 (Nil)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleRenew(book.accessionNo, book.title)}
                disabled={renewing === book.accessionNo}
                className="mt-4 w-full py-2 bg-white hover:bg-brand-50 border border-slate-200 hover:border-brand-300 text-brand-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${renewing === book.accessionNo ? 'animate-spin' : ''}`} />
                {renewing === book.accessionNo ? 'Extending Loan...' : 'Renew for +14 Days'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Library Catalog Search */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-5">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Search Physical Library Catalog</h3>
            <p className="text-xs text-slate-400">Search over 85,000 academic books, journals, and thesis papers</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchCatalog}
              onChange={(e) => setSearchCatalog(e.target.value)}
              placeholder="Search by title, author, subject..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredCatalog.map((item) => (
            <div key={item.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-xl transition">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                  {item.category}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1">{item.title}</h4>
                <p className="text-xs text-slate-500">By {item.author} • Location: <strong className="text-slate-700">{item.shelf}</strong></p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">
                  {item.availableCopies} Copies Available
                </span>
                <button
                  onClick={() => showToast(`Reservation request registered for '${item.title}'. Pick up at Circulation Desk.`)}
                  className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Reserve Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
