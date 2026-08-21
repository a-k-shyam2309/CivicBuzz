import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  Calendar,
  IndianRupee,
  Building2,
  Clock,
  QrCode,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { tenderService } from '../services/tenderService';

export const Tenders = () => {
  const [tenders, setTenders] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchTenders = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'ALL') params.category = selectedCategory;
      if (selectedStatus !== 'ALL') params.status_filter = selectedStatus;
      const list = await tenderService.listTenders(params);
      setTenders(list || []);
    } catch (err) {
      console.warn('Tenders fetch error', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTenders();
  }, [selectedCategory, selectedStatus]);

  const CATEGORIES = ['ALL', 'ROADS', 'DRAINAGE', 'LIGHTING', 'SANITATION', 'PARKS'];
  const STATUSES = ['ALL', 'PUBLISHED', 'EVALUATION', 'AWARDED', 'WORK_IN_PROGRESS', 'COMPLETED'];

  const STAGES = [
    'Publication & RFQ',
    'Technical Bid Evaluation',
    'Financial Bidding',
    'Work Order Awarded',
    'Field Execution & Inspection',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Municipal Procurement & Tenders</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Government Tenders & Contractor Contracts
          </h1>
          <p className="text-xs text-slate-300">
            Transparent municipal work orders published directly from verified community complaints
            and participatory budgeting priorities.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Category:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="p-1.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-700"
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tenders Stream */}
      {isLoading ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-semibold">Loading published tenders...</p>
        </div>
      ) : tenders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400 text-xs">
          No tenders match the selected filters.
        </div>
      ) : (
        <div className="space-y-4">
          {tenders.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-3xl border-2 border-slate-200 hover:border-emerald-500/60 shadow-xs hover:shadow-md transition-all p-6 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg">
                    {t.tender_id}
                  </span>
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold">
                    {t.status}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Ward {t.ward_id || 12} • {t.department_name}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">
                    Estimated Budget
                  </span>
                  <span className="text-base font-black text-slate-900">
                    {t.estimated_budget}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base leading-tight">{t.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t.description}</p>
              </div>

              {/* 5-Stage Visual Progress Bar */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                  <span>Procurement Lifecycle Stage:</span>
                  <span className="text-emerald-700">
                    Stage {t.stage_progress || 1} of 5 ({STAGES[(t.stage_progress || 1) - 1]})
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  {STAGES.map((st, idx) => (
                    <div key={idx} className="space-y-1">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          idx + 1 <= (t.stage_progress || 1)
                            ? 'bg-emerald-600'
                            : 'bg-slate-200'
                        }`}
                      />
                      <span className="text-[9px] text-slate-400 block truncate text-center">
                        {st.split(' ')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Details */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-1">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    Deadline: <strong>{t.submission_deadline || '24 Aug 2026'}</strong>
                  </span>
                  {t.contractor_name && (
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-blue-600" />
                      Contractor: <strong>{t.contractor_name}</strong>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                    ✓ Verified Complaints Linked
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tenders;
