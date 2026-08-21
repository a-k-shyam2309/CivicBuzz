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
  ChevronRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import { complaintService } from '../services/complaintService';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { ResolutionModal } from '../components/ResolutionModal';

const DEFAULT_DEMO_COMPLAINTS = [
  {
    complaint_id: 'CB-1001',
    title: 'Severe Asphalt Pothole near Master Canteen',
    description: 'Deep 2-foot wide pothole on Janpath Road near Master Canteen square causing heavy traffic congestion and accidents.',
    category: 'ROAD',
    sub_category: 'POTHOLE',
    status: 'READY_FOR_CITIZEN_VERIFICATION',
    severity: 'HIGH',
    department_name: 'Roads & Potholes Department',
    department_code: 'ROADS_AND_POTHOLES',
    location: {
      address: 'Janpath Road, Master Canteen, Bhubaneswar',
      ward_name: 'Ward 12',
      ward_id: 12,
      latitude: 20.2961,
      longitude: 85.8245,
    },
    evidence: [
      {
        evidence_type: 'BEFORE_IMAGE',
        file_url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        uploaded_by: 'Subham Samal (Citizen)',
        timestamp: '2026-08-21T09:30:00Z',
      },
      {
        evidence_type: 'AFTER_IMAGE',
        file_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
        uploaded_by: 'Ward 12 Road Remediation Crew',
        timestamp: '2026-08-21T11:45:00Z',
      },
    ],
    timeline: [
      {
        step: 'Complaint Submitted',
        status: 'SUBMITTED',
        timestamp: '2026-08-21T09:30:00Z',
        actor_role: 'CITIZEN',
        notes: 'Complaint filed with photo evidence and GPS coordinates.',
      },
      {
        step: 'AI Triage & Classification',
        status: 'ASSIGNED',
        timestamp: '2026-08-21T09:31:00Z',
        actor_role: 'AI_SYSTEM',
        notes: 'Gemini AI classified as HIGH severity and routed to Roads Department.',
      },
      {
        step: 'Field Remediation Work Done',
        status: 'READY_FOR_CITIZEN_VERIFICATION',
        timestamp: '2026-08-21T11:45:00Z',
        actor_role: 'OFFICER',
        notes: 'Asphalt cold mix and bituminous leveling completed. Awaiting citizen inspection.',
      },
    ],
  },
  {
    complaint_id: 'CB-2042',
    title: 'Overflowing Waste Bins near Saheed Nagar',
    description: 'Community garbage bins overflowing near Saheed Nagar market with foul odor.',
    category: 'SANITATION',
    sub_category: 'OVERFLOWING_BIN',
    status: 'IN_PROGRESS',
    severity: 'MEDIUM',
    department_name: 'Sanitation & Solid Waste Management',
    department_code: 'SOLID_WASTE_MANAGEMENT',
    location: {
      address: 'Saheed Nagar Market, Bhubaneswar',
      ward_name: 'Ward 30',
      ward_id: 30,
      latitude: 20.2912,
      longitude: 85.8456,
    },
    evidence: [
      {
        evidence_type: 'BEFORE_IMAGE',
        file_url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
        uploaded_by: 'Citizen',
        timestamp: '2026-08-21T10:15:00Z',
      },
    ],
    timeline: [
      {
        step: 'Grievance Registered',
        status: 'SUBMITTED',
        timestamp: '2026-08-21T10:15:00Z',
        actor_role: 'CITIZEN',
        notes: 'Sanitation complaint submitted.',
      },
      {
        step: 'Sanitation Crew Dispatched',
        status: 'IN_PROGRESS',
        timestamp: '2026-08-21T10:45:00Z',
        actor_role: 'OFFICER',
        notes: 'Solid waste compactor truck en route.',
      },
    ],
  },
];

export const TrackComplaint = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';
  const { isAuthenticated, user } = useAuth();

  const [searchInput, setSearchInput] = useState(initialId);
  const [activeComplaint, setActiveComplaint] = useState(null);
  const [allGrievances, setAllGrievances] = useState(DEFAULT_DEMO_COMPLAINTS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false);

  // Fetch a specific complaint by ID
  const fetchComplaint = async (idToFetch) => {
    if (!idToFetch) return;
    const cleanId = idToFetch.trim().toUpperCase();
    setIsLoading(true);
    setError(null);

    // 1. Check in local stored grievances first
    const stored = JSON.parse(localStorage.getItem('civicbuzz_my_complaints') || '[]');
    const localMatch = [...stored, ...allGrievances].find(
      (c) => c.complaint_id?.toUpperCase() === cleanId
    );

    try {
      const data = await complaintService.getComplaintById(cleanId);
      setActiveComplaint(data);
      setSearchParams({ id: cleanId });
    } catch {
      if (localMatch) {
        setActiveComplaint(localMatch);
        setSearchParams({ id: cleanId });
      } else {
        setError(`Complaint #${cleanId} not found in database. Showing latest active complaint.`);
        if (allGrievances.length > 0) {
          setActiveComplaint(allGrievances[0]);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load all user and public complaints on mount
  useEffect(() => {
    const loadGrievancesList = async () => {
      const localStored = JSON.parse(localStorage.getItem('civicbuzz_my_complaints') || '[]');
      let combined = [...localStored];

      try {
        const publicList = await complaintService.getPublicComplaints({ limit: 10 });
        if (publicList && publicList.length > 0) {
          combined = [...combined, ...publicList];
        }
      } catch {
        // use fallback
      }

      // De-duplicate by complaint_id
      const seen = new Set();
      const unique = [];
      for (const item of [...combined, ...DEFAULT_DEMO_COMPLAINTS]) {
        if (item?.complaint_id && !seen.has(item.complaint_id)) {
          seen.add(item.complaint_id);
          unique.push(item);
        }
      }

      setAllGrievances(unique);

      if (initialId) {
        fetchComplaint(initialId);
      } else if (unique.length > 0) {
        setActiveComplaint(unique[0]);
        setSearchParams({ id: unique[0].complaint_id });
      }
    };

    loadGrievancesList();
  }, [initialId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchComplaint(searchInput.trim());
    }
  };

  const handleSelectGrievance = (c) => {
    setActiveComplaint(c);
    setSearchInput(c.complaint_id);
    setSearchParams({ id: c.complaint_id });
  };

  const handleResolutionUpdated = (res) => {
    if (activeComplaint) {
      fetchComplaint(activeComplaint.complaint_id);
    }
  };

  const beforeEvidence = activeComplaint?.evidence?.find(
    (e) => e.evidence_type === 'BEFORE_IMAGE' || e.evidence_type === 'IMAGE'
  ) || activeComplaint?.evidence?.[0];

  const afterEvidence = activeComplaint?.evidence?.find(
    (e) => e.evidence_type === 'AFTER_IMAGE' || e.evidence_type === 'WORK_COMPLETION_IMAGE'
  ) || activeComplaint?.evidence?.[1];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Bar Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>{t.trackHeaderTitle || 'Track Grievance Resolution'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t.trackHeaderTitle || 'Live Grievance Lifecycle & Ground Verification'}
          </h1>
          <p className="text-xs text-slate-300">
            {t.trackHeaderDesc || 'Inspect real-time AI triage, field remediation progress, before/after evidence photos, and complete ground verification.'}
          </p>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t.searchPlaceholder || 'ENTER COMPLAINT ID (E.G. CB-1001)...'}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/90 border border-slate-700 rounded-2xl text-xs font-mono tracking-wider text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl shadow transition-all flex items-center gap-2 cursor-pointer"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>{t.searchBtn || 'Search'}</span>
          </button>
        </form>
      </div>

      {/* Grievance Quick-Select Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            {t.recentGrievancesTitle || 'Your Submitted & Recent Grievances:'}
          </span>
          <span className="text-[11px] text-slate-400">Click to inspect timeline</span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {allGrievances.map((c) => {
            const isSelected = activeComplaint?.complaint_id === c.complaint_id;
            return (
              <button
                key={c.complaint_id}
                type="button"
                onClick={() => handleSelectGrievance(c)}
                className={`flex-shrink-0 px-3.5 py-2 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50/60 hover:border-emerald-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold">#{c.complaint_id}</span>
                    <StatusBadge status={c.status} />
                  </div>
                  <span className={`text-[11px] block mt-0.5 max-w-[180px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {c.title || c.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Active Complaint Inspector View */}
      {activeComplaint && (
        <div className="space-y-6">
          {/* Main Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold px-3 py-1 bg-slate-900 text-white rounded-xl">
                    #{activeComplaint.complaint_id}
                  </span>
                  <StatusBadge status={activeComplaint.status} />
                  <PriorityBadge level={activeComplaint.severity} score={activeComplaint.priority?.score} />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {activeComplaint.title || activeComplaint.description?.substring(0, 50)}
                </h2>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{activeComplaint.location?.ward_name || 'Ward 12'}</span>
                  </div>
                  <span>•</span>
                  <span>{activeComplaint.department_name || 'Roads & Potholes'}</span>
                </div>
              </div>

              {/* Citizen Action Verification CTA */}
              {activeComplaint.status === 'READY_FOR_CITIZEN_VERIFICATION' && (
                <div className="p-4 bg-blue-50/80 border-2 border-blue-200 rounded-2xl space-y-2 flex-shrink-0 text-center sm:text-left">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Citizen Verification Pending!</span>
                  </div>
                  <p className="text-[11px] text-blue-700 max-w-xs">
                    Field work completed by department. Please physically inspect the site and confirm or dispute.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsResolutionModalOpen(true)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition-all cursor-pointer"
                  >
                    Inspect & Verify Resolution
                  </button>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Grievance Description
              </span>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {activeComplaint.description}
              </p>
            </div>

            {/* Before / After Photo Comparison Grid */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {t.resolutionProofTitle || 'Department Remediation Proof (Before & After):'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Before Photo */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3 space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 block">
                    {t.beforeProof || 'Before (Reported by Citizen)'}
                  </span>
                  <div className="h-48 rounded-xl overflow-hidden bg-slate-200 relative">
                    <img
                      src={beforeEvidence?.file_url || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'}
                      alt="Before evidence"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>Uploaded by Citizen</span>
                    <span>Verified</span>
                  </div>
                </div>

                {/* After Photo */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3 space-y-2">
                  <span className="text-[11px] font-bold text-blue-900 block">
                    {t.afterProof || 'After (Remediation by Department)'}
                  </span>
                  <div className="h-48 rounded-xl overflow-hidden bg-slate-200 relative flex items-center justify-center">
                    {afterEvidence?.file_url ? (
                      <img
                        src={afterEvidence.file_url}
                        alt="After evidence"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-4 text-slate-400 text-xs">
                        <Camera className="w-8 h-8 mx-auto mb-1 opacity-50" />
                        <span>Field work in progress. Remediation proof will appear here.</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>Field Department Crew</span>
                    <span className="text-blue-700 font-bold">
                      {afterEvidence?.file_url ? 'Proof Uploaded' : 'Awaiting Completion'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline View */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {t.timelineTitle || 'Audit & Remediation Timeline'}
              </span>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {(activeComplaint.timeline || []).map((step, idx) => (
                  <div key={idx} className="relative space-y-1 text-xs">
                    <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow" />
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{step.step || step.status}</span>
                      <span className="text-[10px] text-slate-400">
                        {step.timestamp ? new Date(step.timestamp).toLocaleString() : ''}
                      </span>
                    </div>
                    <p className="text-slate-600">{step.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resolution Verification Modal */}
      {isResolutionModalOpen && activeComplaint && (
        <ResolutionModal
          complaint={activeComplaint}
          onClose={() => setIsResolutionModalOpen(false)}
          onResolutionUpdated={handleResolutionUpdated}
        />
      )}
    </div>
  );
};

export default TrackComplaint;
