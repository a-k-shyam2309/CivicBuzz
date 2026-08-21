import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Layers,
  Search,
  Filter,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Eye,
  TrendingUp,
} from 'lucide-react';
import { complaintService } from '../services/complaintService';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';

export const PublicIssues = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'ALL';

  const [activeTab, setActiveTab] = useState('ALL_ISSUES'); // 'ALL_ISSUES' or 'CLUSTERS'
  const [complaints, setComplaints] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const params = {};
        if (selectedCategory !== 'ALL') params.category = selectedCategory;
        if (selectedStatus !== 'ALL') params.status = selectedStatus;
        if (searchKeyword.trim()) params.search = searchKeyword.trim();

        const [compList, clusterList] = await Promise.all([
          complaintService.listComplaints(params),
          complaintService.getIssueClusters(),
        ]);
        setComplaints(compList || []);
        setClusters(clusterList || []);
      } catch (err) {
        console.warn('Public issues error', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory, selectedStatus, searchKeyword]);

  const CATEGORIES = ['ALL', 'ROAD', 'SANITATION', 'LIGHTING', 'DRAINAGE', 'PARKS', 'ENCROACHMENT'];
  const STATUSES = ['ALL', 'SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'READY_FOR_CITIZEN_VERIFICATION', 'RESOLVED', 'RESOLUTION_REJECTED'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Layers className="w-3.5 h-3.5" />
            <span>Public Civic Transparency Feed</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Citywide Grievances & Problem Clusters
          </h1>
          <p className="text-xs text-slate-300">
            Transparent public dashboard showing all civic complaints, duplicate issue clusters,
            department workflows, and ground resolution proofs. (Complainant privacy strictly protected).
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Main Feed vs Clusters Toggle */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('ALL_ISSUES')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'ALL_ISSUES'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Grievances ({complaints.length})
            </button>
            <button
              onClick={() => setActiveTab('CLUSTERS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'CLUSTERS'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Issue Clusters ({clusters.length})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Filter by keyword or ID..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
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
              {cat.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Content Stream */}
      {isLoading ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-semibold">Loading public grievance records...</p>
        </div>
      ) : activeTab === 'ALL_ISSUES' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {complaints.length === 0 ? (
            <div className="col-span-3 bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400 text-xs">
              No civic grievances match the selected filters.
            </div>
          ) : (
            complaints.map((c) => (
              <div
                key={c.complaint_id}
                onClick={() => navigate(`/track?id=${c.complaint_id}`)}
                className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-emerald-500/50 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 card-hover"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      #{c.complaint_id}
                    </span>
                    <StatusBadge status={c.status} size="sm" />
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-tight">
                    {c.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{c.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="flex items-center gap-1 truncate max-w-[60%]">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      {c.location?.ward_name || 'Ward 12'}
                    </span>
                    <PriorityBadge level={c.priority?.level || c.severity} score={c.priority?.score} />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Dept: {c.department_name}</span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      Track <Eye className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Issue Clusters View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clusters.length === 0 ? (
            <div className="col-span-3 bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400 text-xs">
              No active issue clusters generated yet.
            </div>
          ) : (
            clusters.map((cl, idx) => (
              <div
                key={idx}
                onClick={() => cl.primary_complaint_id && navigate(`/track?id=${cl.primary_complaint_id}`)}
                className="bg-white p-5 rounded-3xl border-2 border-slate-200 hover:border-blue-500 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 card-hover"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-blue-50 text-blue-800 rounded-md">
                    {cl.cluster_id}
                  </span>
                  <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-bold">
                    {cl.reports_count || 1} Related Reports
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{cl.problem}</h3>

                <div className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Ward:</span>
                    <span className="font-semibold text-slate-800">{cl.ward || 'Ward 12'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Assigned Dept:</span>
                    <span className="font-semibold text-blue-700">{cl.department}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Priority:</span>
                    <span className="font-bold text-rose-600">{cl.priority}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400">
                  Multiple citizen reports clustered spatially & semantically. Escalated for bulk remediation.
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PublicIssues;
