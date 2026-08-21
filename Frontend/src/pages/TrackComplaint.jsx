import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  QrCode,
  ShieldCheck,
  Star,
  FileText,
  Camera,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { complaintService } from '../services/complaintService';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { ResolutionModal } from '../components/ResolutionModal';

export const TrackComplaint = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';
  const { isAuthenticated, user } = useAuth();

  const [searchInput, setSearchInput] = useState(initialId);
  const [activeComplaint, setActiveComplaint] = useState(null);
  const [myComplaints, setMyComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false);

  // Fetch complaint details by ID
  const fetchComplaint = async (idToFetch) => {
    if (!idToFetch) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await complaintService.getComplaintById(idToFetch.trim());
      setActiveComplaint(data);
      setSearchParams({ id: idToFetch.trim() });
    } catch (err) {
      setError(err.message || 'Complaint not found. Please verify the ID.');
      setActiveComplaint(null);
    } finally {
      setIsLoading(false);
    }
  };

  // On initial mount or URL param change
  useEffect(() => {
    if (initialId) {
      fetchComplaint(initialId);
    }
  }, [initialId]);

  // Load user's filed complaints if authenticated
  useEffect(() => {
    const loadMyComplaints = async () => {
      if (isAuthenticated) {
        try {
          const list = await complaintService.getMyComplaints();
          setMyComplaints(list || []);
          if (!initialId && list && list.length > 0) {
            setActiveComplaint(list[0]);
            setSearchParams({ id: list[0].complaint_id });
          }
        } catch {
          // Graceful fallback
        }
      }
    };
    loadMyComplaints();
  }, [isAuthenticated]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchComplaint(searchInput);
    }
  };

  const handleResolutionUpdated = (res) => {
    if (activeComplaint) {
      fetchComplaint(activeComplaint.complaint_id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Bar Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>Real-Time Grievance Lifecycle Tracking</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Track Grievance Resolution
          </h1>
          <p className="text-xs text-slate-300">
            Inspect real-time AI triage, field remediation progress, before/after evidence photos,
            and complete ground verification.
          </p>

          <form onSubmit={handleSearchSubmit} className="pt-2 flex items-center gap-2 max-w-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Complaint ID (e.g. CB-1001)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
            >
              {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Search'}
            </button>
          </form>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: My Grievances List (if authenticated) */}
        {isAuthenticated && myComplaints.length > 0 && (
          <div className="lg:col-span-1 space-y-3">
            <h3 className="font-bold text-sm text-slate-800 flex items-center justify-between">
              <span>Your Reported Grievances</span>
              <span className="text-xs text-slate-400 font-normal">{myComplaints.length} filed</span>
            </h3>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {myComplaints.map((c) => (
                <div
                  key={c.complaint_id}
                  onClick={() => {
                    setActiveComplaint(c);
                    setSearchParams({ id: c.complaint_id });
                    setSearchInput(c.complaint_id);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    activeComplaint?.complaint_id === c.complaint_id
                      ? 'bg-emerald-50/70 border-emerald-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-slate-500">
                      #{c.complaint_id}
                    </span>
                    <StatusBadge status={c.status} size="sm" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{c.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 truncate">
                    {c.location?.address || 'Bhubaneswar'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Right / Center Col: Detailed Complaint View */}
        <div className={isAuthenticated && myComplaints.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}>
          {isLoading ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-semibold">Loading complaint lifecycle details...</p>
            </div>
          ) : activeComplaint ? (
            <div className="space-y-6">
              {/* Top Summary Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-100 rounded-md text-slate-700">
                        #{activeComplaint.complaint_id}
                      </span>
                      <StatusBadge status={activeComplaint.status} />
                      <PriorityBadge
                        level={activeComplaint.priority?.level || activeComplaint.severity}
                        score={activeComplaint.priority?.score}
                      />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mt-2">
                      {activeComplaint.title}
                    </h2>
                  </div>

                  {activeComplaint.qr_code_url && (
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
                      <QrCode className="w-5 h-5 text-emerald-600" />
                      <span className="font-bold">Public QR Verified</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {activeComplaint.description}
                </p>

                {/* Key Metadata Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-2xl text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Category</span>
                    <span className="font-semibold text-slate-800">{activeComplaint.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Ward Jurisdiction</span>
                    <span className="font-semibold text-slate-800">
                      {activeComplaint.location?.ward_name || `Ward ${activeComplaint.location?.ward_id || 12}`}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Dept</span>
                    <span className="font-semibold text-blue-700">{activeComplaint.department_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Date Filed</span>
                    <span className="font-semibold text-slate-800">
                      {activeComplaint.created_at ? new Date(activeComplaint.created_at).toLocaleDateString() : 'Today'}
                    </span>
                  </div>
                </div>
              </div>

              {/* CRITICAL FEATURE: Citizen Verification Action Banner */}
              {activeComplaint.status === 'READY_FOR_CITIZEN_VERIFICATION' && (
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Action Required by Complainant</span>
                    </div>
                    <h3 className="text-lg font-bold">Department Has Marked Work Completed</h3>
                    <p className="text-xs text-emerald-100 max-w-xl">
                      Please inspect the ground repair. You hold the final authority to confirm resolution
                      or reject with a dispute reason.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsResolutionModalOpen(true)}
                    className="px-6 py-3 bg-white text-emerald-900 font-extrabold text-xs rounded-xl shadow-lg hover:bg-emerald-50 transition-all flex-shrink-0"
                  >
                    Verify & Confirm Resolution
                  </button>
                </div>
              )}

              {/* Dispute Notice if Rejected */}
              {activeComplaint.status === 'RESOLUTION_REJECTED' && (
                <div className="bg-rose-50 border border-rose-200 p-5 rounded-3xl text-xs space-y-1.5">
                  <span className="font-bold text-rose-800 flex items-center gap-1.5 text-sm">
                    <AlertTriangle className="w-4 h-4 text-rose-600" /> Resolution Disputed & Reopened by Citizen
                  </span>
                  <p className="text-rose-700">
                    <strong>Dispute Reason:</strong> "{activeComplaint.dispute_reason || 'Work incomplete on site'}"
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    The complaint has been escalated to the Department Head and Municipal Admin. Additional crew
                    dispatched for rework.
                  </p>
                </div>
              )}

              {/* Resolution Confirmed Badge & Rating */}
              {activeComplaint.status === 'RESOLVED' && activeComplaint.resolution_verification && (
                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-3xl text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Citizen Confirmed Resolution
                    </span>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(activeComplaint.resolution_verification.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-emerald-800 italic">
                    "{activeComplaint.resolution_verification.comments || 'Work inspected and approved.'}"
                  </p>
                </div>
              )}

              {/* Evidence Gallery (Before & After Images) */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-emerald-600" /> Photo & Audio Evidence Trail
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Before Evidence */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                      Before Remediation (Citizen Evidence)
                    </span>
                    <img
                      src={
                        activeComplaint.evidence?.find((e) => e.evidence_type === 'BEFORE_IMAGE')
                          ?.file_url ||
                        'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
                      }
                      alt="Before fix"
                      className="w-full h-44 object-cover rounded-xl shadow-inner"
                    />
                  </div>

                  {/* After Evidence */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                      After Remediation (Department Proof)
                    </span>
                    {activeComplaint.evidence?.find((e) => e.evidence_type === 'AFTER_IMAGE') ? (
                      <img
                        src={
                          activeComplaint.evidence.find((e) => e.evidence_type === 'AFTER_IMAGE')
                            .file_url
                        }
                        alt="After fix"
                        className="w-full h-44 object-cover rounded-xl shadow-inner"
                      />
                    ) : (
                      <div className="w-full h-44 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-xs text-center p-4">
                        <Clock className="w-6 h-6 mb-1 text-slate-300" />
                        <span>Awaiting field remediation and after-repair photo upload</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Chronological Timeline */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" /> Audit Timeline
                </h3>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {activeComplaint.timeline?.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white shadow-xs" />
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{step.step}</span>
                          <span className="text-[10px] text-slate-400">
                            {step.timestamp ? new Date(step.timestamp).toLocaleString() : ''}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px]">{step.notes}</p>
                        <span className="text-[10px] text-emerald-700 font-semibold block">
                          Actor: {step.actor_role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">No Grievance Selected</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Enter a Complaint ID in the search bar above or click one of your submitted grievances.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Citizen Resolution Verification Modal */}
      {activeComplaint && (
        <ResolutionModal
          complaint={activeComplaint}
          isOpen={isResolutionModalOpen}
          onClose={() => setIsResolutionModalOpen(false)}
          onResolutionSuccess={handleResolutionUpdated}
        />
      )}
    </div>
  );
};

export default TrackComplaint;
