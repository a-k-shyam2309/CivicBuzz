import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  MapPin,
  Camera,
  Bot,
  ShieldCheck,
  Vote,
  FileSpreadsheet,
  ArrowRight,
  TrendingUp,
  Users,
  Building2,
  Check,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { complaintService } from '../services/complaintService';
import { projectService } from '../services/projectService';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';

export const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_reported: 12480,
    total_resolved: 8240,
    active_reports: 1162,
    active_citizens: 247,
    resolution_rate_percent: 78.0,
  });
  const [recentIssues, setRecentIssues] = useState([]);
  const [topProjects, setTopProjects] = useState([]);
  const [trackInputId, setTrackInputId] = useState('');

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const statsData = await complaintService.getPublicStats();
        if (statsData) setStats(statsData);
      } catch (err) {
        console.warn('Stats fetch fallback', err);
      }

      try {
        const issuesData = await complaintService.getPublicComplaints({ limit: 4 });
        if (issuesData) setRecentIssues(issuesData);
      } catch (err) {
        console.warn('Issues fetch fallback', err);
      }

      try {
        const rankingsData = await projectService.getRankings();
        if (rankingsData) setTopProjects(rankingsData.slice(0, 3));
      } catch (err) {
        console.warn('Projects fetch fallback', err);
      }
    };

    loadHomeData();
  }, []);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (trackInputId.trim()) {
      navigate(`/track?id=${trackInputId.trim().toUpperCase()}`);
    }
  };

  const CATEGORIES = [
    { title: 'Roads & Potholes', icon: '🛣️', desc: 'Asphalt potholes, broken dividers & cave-ins', count: '480+ Active' },
    { title: 'Sanitation & Waste', icon: '🗑️', desc: 'Overflowing bins, uncollected waste & dumps', count: '320+ Active' },
    { title: 'Streetlighting', icon: '💡', desc: 'Dark corridors, flickering bulbs & open cables', count: '210+ Active' },
    { title: 'Drainage & Water', icon: '🚰', desc: 'Waterlogging, choked drains & pipeline leaks', count: '190+ Active' },
    { title: 'Parks & Greenery', icon: '🌳', desc: 'Overgrown trees, broken benches & playgrounds', count: '95+ Active' },
    { title: 'Encroachments', icon: '🚧', desc: 'Illegal parking, footpath blockades & noise', count: '65+ Active' },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <img
              src="/logo.png"
              alt="CivicBuzz Official Logo"
              className="w-20 h-20 object-contain drop-shadow-xl hover:scale-105 transition-transform"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Grounded Municipal Governance Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Turn Civic Grievances Into <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Verified Public Action.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base leading-relaxed">
            Report civic problems with photo evidence and GPS location. AI triages and routes the issue
            to municipal departments. <strong>Work is only marked resolved once verified on the ground by you.</strong>
          </p>

          {/* Action Hub */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/report-issue"
              className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl shadow-xl hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Report a Civic Issue Now
            </Link>

            <Link
              to="/budgeting"
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-sm rounded-2xl border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <Vote className="w-4 h-4 text-emerald-400" />
              Participatory Budgeting
            </Link>
          </div>

          {/* Quick Track Input Bar */}
          <form
            onSubmit={handleTrackSubmit}
            className="pt-6 max-w-md mx-auto flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20"
          >
            <input
              type="text"
              value={trackInputId}
              onChange={(e) => setTrackInputId(e.target.value)}
              placeholder="Enter Complaint ID (e.g. CB-1001)..."
              className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all"
            >
              Track Status
            </button>
          </form>
        </div>
      </section>

      {/* 2. Live Impact Statistics Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-lg text-center card-hover">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {stats.total_reported?.toLocaleString()}
            </span>
            <span className="block text-xs font-semibold text-slate-500 mt-1">Total Reported</span>
            <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">↑ 12.5% this month</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-lg text-center card-hover">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">
              {stats.total_resolved?.toLocaleString()}
            </span>
            <span className="block text-xs font-semibold text-slate-500 mt-1">Citizen-Verified Resolved</span>
            <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">
              {stats.resolution_rate_percent}% Resolution Rate
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-lg text-center card-hover">
            <span className="text-2xl sm:text-3xl font-black text-amber-600">
              {stats.active_reports?.toLocaleString()}
            </span>
            <span className="block text-xs font-semibold text-slate-500 mt-1">Under Department Work</span>
            <span className="text-[10px] text-amber-600 font-bold mt-0.5 block">Active Field Crews</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-lg text-center card-hover">
            <span className="text-2xl sm:text-3xl font-black text-blue-600">
              {stats.active_citizens?.toLocaleString()}
            </span>
            <span className="block text-xs font-semibold text-slate-500 mt-1">Active Citizens</span>
            <span className="text-[10px] text-blue-600 font-bold mt-0.5 block">Across 67 BMC Wards</span>
          </div>
        </div>
      </section>

      {/* 3. How CivicBuzz Works (4-Step Flow) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Accountability Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            How Grievances Get Fixed & Ground-Verified
          </h2>
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            A transparent workflow designed so no complaint gets buried in bureaucracy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 font-black text-sm flex items-center justify-center mb-4">
              1
            </div>
            <h3 className="font-bold text-slate-800 text-sm mb-1.5">Evidence Submission</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload photo evidence and pin coordinates. System generates SHA-256 integrity hash.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-black text-sm flex items-center justify-center mb-4">
              2
            </div>
            <h3 className="font-bold text-slate-800 text-sm mb-1.5">AI Triage & Ward Routing</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Gemini AI categorizes severity, clusters duplicates, and maps responsible department.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 font-black text-sm flex items-center justify-center mb-4">
              3
            </div>
            <h3 className="font-bold text-slate-800 text-sm mb-1.5">Department Execution</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Crews perform repairs and upload before/after photos with work descriptions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border-2 border-emerald-500 shadow-md relative bg-emerald-50/20">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center mb-4">
              4
            </div>
            <h3 className="font-bold text-emerald-900 text-sm mb-1.5">Citizen Ground Verification</h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Complainant inspects site. Status is ONLY marked resolved if approved by citizen.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Civic Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Explore Grievance Categories</h2>
            <p className="text-xs text-slate-500 mt-0.5">Report or track problems by municipal department</p>
          </div>
          <Link to="/public-issues" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
            View All Grievances <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.title}
              to={`/public-issues?category=${encodeURIComponent(cat.title.split(' ')[0])}`}
              className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all text-center card-hover flex flex-col items-center justify-between"
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <h3 className="font-bold text-slate-800 text-xs">{cat.title}</h3>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{cat.desc}</p>
              <span className="mt-3 px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[9px] font-bold">
                {cat.count}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Recent Public Issues Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Recent Public Transparency Feed</h2>
            <p className="text-xs text-slate-500 mt-0.5">Real-time status updates with verifiable timeline</p>
          </div>
          <Link to="/public-issues" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
            See Citywide Feed <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentIssues.length === 0 ? (
            <div className="col-span-2 bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
              Loading recent civic grievance feeds...
            </div>
          ) : (
            recentIssues.map((issue) => (
              <div
                key={issue.complaint_id}
                onClick={() => navigate(`/track?id=${issue.complaint_id}`)}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    #{issue.complaint_id}
                  </span>
                  <StatusBadge status={issue.status} />
                </div>

                <h3 className="font-bold text-slate-800 text-sm line-clamp-1">{issue.title}</h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    {issue.ward || 'Ward 12'}
                  </span>
                  <PriorityBadge level={issue.priority_level} />
                  <span>Dept: {issue.responsible_department}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 6. Participatory Budgeting Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl text-white p-8 sm:p-10 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
              <Vote className="w-3.5 h-3.5" />
              <span>Participatory Budgeting 2026</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Vote On Municipal Infrastructure Projects In Your Ward
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Decide how public funds are allocated. Verified citizens cast democratic votes on proposed
              drainage works, streetlight expansions, and park restorations.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/budgeting"
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow transition-all flex items-center gap-2"
              >
                Explore & Vote on Projects <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/tenders"
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition-all flex items-center gap-2"
              >
                Inspect Municipal Tenders
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
