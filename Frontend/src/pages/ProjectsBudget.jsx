import React, { useState, useEffect } from 'react';
import {
  Vote,
  TrendingUp,
  PlusCircle,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  IndianRupee,
  Calendar,
  Layers,
} from 'lucide-react';
import { projectService } from '../services/projectService';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export const ProjectsBudget = () => {
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useNotifications();

  const [rankings, setRankings] = useState([]);
  const [selectedWard, setSelectedWard] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [votingProjectId, setVotingProjectId] = useState(null);
  const [showProposalModal, setShowProposalModal] = useState(false);

  // New proposal form state
  const [proposalData, setProposalData] = useState({
    title: '',
    description: '',
    category: 'ROADS',
    estimated_cost: 500000,
    ward_id: 12,
    location_name: 'Janpath, Ward 12',
    icon: '🛣️',
  });
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);
  const [proposalError, setProposalError] = useState(null);

  const fetchRankings = async () => {
    setIsLoading(true);
    try {
      const wardId = selectedWard !== 'ALL' ? parseInt(selectedWard) : null;
      const data = await projectService.getRankings(wardId);
      setRankings(data || []);
    } catch (err) {
      console.warn('Rankings fetch error', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, [selectedWard]);

  const handleVote = async (projectId, projectTitle) => {
    setVotingProjectId(projectId);
    try {
      await projectService.voteForProject(projectId);
      showToast(`Vote cast successfully for '${projectTitle}'!`, 'success');
      await fetchRankings();
    } catch (err) {
      showToast(err.message || 'You have already voted for this project proposal.', 'error');
    } finally {
      setVotingProjectId(null);
    }
  };

  const handleCreateProposal = async (e) => {
    e.preventDefault();
    if (!proposalData.title || proposalData.title.length < 5) {
      setProposalError('Please provide a project title.');
      return;
    }
    setIsSubmittingProposal(true);
    setProposalError(null);
    try {
      await projectService.createProposal(proposalData);
      showToast('Project proposal published! Community voting is now live.', 'success');
      setShowProposalModal(false);
      await fetchRankings();
    } catch (err) {
      setProposalError(err.message || 'Failed to submit proposal.');
    } finally {
      setIsSubmittingProposal(false);
    }
  };

  const formatRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Vote className="w-3.5 h-3.5" />
            <span>Participatory Budgeting 2026</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Democratic Community Project Allocation
          </h1>
          <p className="text-xs text-slate-300">
            Citizens decide municipal spending. Vote on proposed infrastructure projects. Highly ranked
            projects receive priority municipal budget sanctions and official tenders.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowProposalModal(true)}
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2 flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" /> Propose a Ward Project
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-sm text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Filter by Ward:</span>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-800"
          >
            <option value="ALL">All Municipal Wards</option>
            <option value="12">Ward 12 (Janpath / Master Canteen)</option>
            <option value="30">Ward 30 (Saheed Nagar / Rasulgarh)</option>
            <option value="5">Ward 5 (Patia / Infocity)</option>
            <option value="24">Ward 24 (Khandagiri)</option>
            <option value="58">Ward 58 (Old Town Heritage)</option>
          </select>
        </div>

        <span className="text-slate-400">
          Showing <strong>{rankings.length}</strong> Community Proposals
        </span>
      </div>

      {/* Project Cards Grid */}
      {isLoading ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-semibold">Loading participatory budgeting proposals...</p>
        </div>
      ) : rankings.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400 text-xs">
          No proposals found for the selected ward.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rankings.map(({ rank, project: p }) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl border-2 border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-lg transition-all p-6 flex flex-col justify-between space-y-4 relative card-hover"
            >
              {/* Rank Badge */}
              <div className="flex items-center justify-between">
                <div
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black shadow-xs ${
                    rank === 1
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : rank === 2
                      ? 'bg-slate-200 text-slate-900'
                      : rank === 3
                      ? 'bg-amber-50 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Rank #{rank}</span>
                </div>

                <span className="text-2xl">{p.icon || '🛣️'}</span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base leading-tight mb-2">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {p.description}
                </p>
              </div>

              {/* Budget & Votes Progress */}
              <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Estimated Budget:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {formatRupees(p.estimated_cost)}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Vote className="w-3.5 h-3.5" /> {p.vote_count?.toLocaleString()} Community Votes
                    </span>
                    <span className="text-slate-400">{p.vote_percentage}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(5, p.vote_percentage || 10))}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    Ward {p.ward_id || 12}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {p.timeline_days || 45} Days Est.
                  </span>
                </div>
              </div>

              {/* Action Button: Cast Vote */}
              <button
                type="button"
                onClick={() => handleVote(p.id, p.title)}
                disabled={votingProjectId === p.id}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {votingProjectId === p.id ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Vote className="w-3.5 h-3.5" />
                )}
                {votingProjectId === p.id ? 'Casting Vote...' : 'Vote for this Project'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Propose a Project Modal */}
      {showProposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Vote className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Propose a Community Civic Project</h3>
              </div>
              <button
                onClick={() => setShowProposalModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {proposalError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{proposalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateProposal} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={proposalData.title}
                  onChange={(e) => setProposalData({ ...proposalData, title: e.target.value })}
                  placeholder="e.g. Ward 12 Underground Drainage & Stormwater Upgrade"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Project Description & Justification</label>
                <textarea
                  rows={3}
                  required
                  value={proposalData.description}
                  onChange={(e) => setProposalData({ ...proposalData, description: e.target.value })}
                  placeholder="Explain why this project is needed for the community and what public grievances it resolves..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={proposalData.category}
                    onChange={(e) => setProposalData({ ...proposalData, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="ROADS">Roads & Pavements</option>
                    <option value="DRAINAGE">Drainage & Stormwater</option>
                    <option value="LIGHTING">Solar Streetlighting</option>
                    <option value="PARKS">Public Parks & Trees</option>
                    <option value="SANITATION">Waste Collection Depot</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Municipal Ward</label>
                  <select
                    value={proposalData.ward_id}
                    onChange={(e) => setProposalData({ ...proposalData, ward_id: parseInt(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value={12}>Ward 12 (Janpath)</option>
                    <option value={30}>Ward 30 (Saheed Nagar)</option>
                    <option value={5}>Ward 5 (Patia)</option>
                    <option value={24}>Ward 24 (Khandagiri)</option>
                    <option value={58}>Ward 58 (Old Town)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estimated Budget (INR)</label>
                <input
                  type="number"
                  step="50000"
                  value={proposalData.estimated_cost}
                  onChange={(e) => setProposalData({ ...proposalData, estimated_cost: parseInt(e.target.value) || 0 })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowProposalModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingProposal}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition-all flex items-center gap-2"
                >
                  {isSubmittingProposal && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  Publish Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsBudget;
