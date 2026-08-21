import React, { useState, useEffect } from 'react';
import {
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  Camera,
  Play,
  Check,
  MapPin,
  FileText,
  ShieldAlert,
} from 'lucide-react';
import { departmentService } from '../services/departmentService';
import { complaintService } from '../services/complaintService';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { ImageUploader } from '../components/ImageUploader';

export const DepartmentDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Submit Completion Evidence Modal state
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [completionModalOpen, setCompletionModalOpen] = useState(false);
  const [workDescription, setWorkDescription] = useState('');
  const [afterImageUrl, setAfterImageUrl] = useState(
    'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80'
  );
  const [isSubmittingWork, setIsSubmittingWork] = useState(false);
  const [modalError, setModalError] = useState(null);

  const loadDepartmentData = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;

      const [deptStats, deptComplaints] = await Promise.all([
        departmentService.getDepartmentStats(),
        departmentService.getDepartmentComplaints(params),
      ]);
      setStats(deptStats);
      setComplaints(deptComplaints || []);
    } catch (err) {
      console.warn('Department data load error', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDepartmentData();
  }, [statusFilter]);

  const handleStartWork = async (complaintId) => {
    try {
      await departmentService.startWork(complaintId, 'Field crew dispatched on site.');
      showToast(`Work initiated on complaint #${complaintId}.`, 'success');
      await loadDepartmentData();
    } catch (err) {
      showToast(err.message || 'Failed to update work status.', 'error');
    }
  };

  const handleSubmitResolutionEvidence = async (e) => {
    e.preventDefault();
    if (!workDescription || workDescription.trim().length < 5) {
      setModalError('Please provide a detailed description of remediation work completed.');
      return;
    }
    if (!afterImageUrl) {
      setModalError('Please provide an after-remediation photo proof URL.');
      return;
    }

    setIsSubmittingWork(true);
    setModalError(null);
    try {
      await complaintService.submitResolutionEvidence(
        selectedComplaint.complaint_id,
        workDescription,
        afterImageUrl
      );
      showToast(
        `Work proof submitted for #${selectedComplaint.complaint_id}! Status moved to Ready for Citizen Verification.`,
        'success'
      );
      setCompletionModalOpen(false);
      await loadDepartmentData();
    } catch (err) {
      setModalError(err.message || 'Failed to submit completion proof.');
    } finally {
      setIsSubmittingWork(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Department Operations Suite</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {stats?.department_name || 'Roads & Potholes Department'}
          </h1>
          <p className="text-xs text-slate-300">
            Dispatch field crews, upload before/after remediation evidence, and submit work for citizen verification.
          </p>
        </div>

        <div className="p-3 bg-blue-950 border border-blue-800/80 rounded-2xl text-xs text-blue-200">
          <span className="font-bold block">Governance Policy:</span>
          <span>Departments cannot directly force resolved status.</span>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-2xl font-black text-slate-900">{stats.total_assigned}</span>
            <span className="block text-xs font-semibold text-slate-500 mt-1">Total Assigned</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-2xl font-black text-amber-600">{stats.in_progress}</span>
            <span className="block text-xs font-semibold text-slate-500 mt-1">In Progress</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-2xl font-black text-blue-600">{stats.pending_citizen_verification}</span>
            <span className="block text-xs font-semibold text-slate-500 mt-1">Pending Citizen Verify</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-2xl font-black text-emerald-600">{stats.resolved}</span>
            <span className="block text-xs font-semibold text-slate-500 mt-1">Confirmed Resolved</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-2xl font-black text-rose-600">{stats.reopened_escalations}</span>
            <span className="block text-xs font-semibold text-slate-500 mt-1">Disputed Reopened</span>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-sm text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Filter Work Queue:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:outline-none"
          >
            <option value="ALL">All Assigned Grievances</option>
            <option value="ASSIGNED">Newly Assigned (Awaiting Crew)</option>
            <option value="IN_PROGRESS">Field Work in Progress</option>
            <option value="READY_FOR_CITIZEN_VERIFICATION">Awaiting Citizen Inspection</option>
            <option value="RESOLUTION_REJECTED">Disputed / Rework Escalations</option>
            <option value="RESOLVED">Ground Verified & Resolved</option>
          </select>
        </div>

        <span className="text-slate-400">
          Showing <strong>{complaints.length}</strong> complaints
        </span>
      </div>

      {/* Complaints Table / List */}
      {isLoading ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-semibold">Loading department work items...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400 text-xs">
          No complaints in this department queue for the selected filter.
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((c) => (
            <div
              key={c.complaint_id}
              className="bg-white rounded-3xl border-2 border-slate-200 hover:border-blue-500/50 shadow-xs hover:shadow-md transition-all p-6 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg">
                    #{c.complaint_id}
                  </span>
                  <StatusBadge status={c.status} />
                  <PriorityBadge level={c.priority?.level || c.severity} score={c.priority?.score} />
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{c.location?.ward_name || 'Ward 12'}</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base leading-tight">{c.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{c.description}</p>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-slate-100">
                <div className="flex items-center gap-4 text-slate-500">
                  <span>Location: <strong>{c.location?.address}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  {c.status === 'ASSIGNED' && (
                    <button
                      type="button"
                      onClick={() => handleStartWork(c.complaint_id)}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5" /> Start Field Work
                    </button>
                  )}

                  {(c.status === 'IN_PROGRESS' || c.status === 'RESOLUTION_REJECTED') && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedComplaint(c);
                        setCompletionModalOpen(true);
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5" /> Submit Work Proof
                    </button>
                  )}

                  {c.status === 'READY_FOR_CITIZEN_VERIFICATION' && (
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-800 rounded-xl font-bold">
                      Awaiting Citizen Confirmation
                    </span>
                  )}

                  {c.status === 'RESOLVED' && (
                    <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Ground Verified by Citizen
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Work Completion Evidence Modal */}
      {completionModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Submit Remediation Proof: #{selectedComplaint.complaint_id}
              </h3>
              <button onClick={() => setCompletionModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitResolutionEvidence} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Description of Field Work Done
                </label>
                <textarea
                  rows={3}
                  required
                  value={workDescription}
                  onChange={(e) => setWorkDescription(e.target.value)}
                  placeholder="e.g. Cleared 2 metric tons of silt from the main storm drain and replaced broken manhole cover with heavy-duty cast iron slab."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  After-Remediation Photo Proof URL
                </label>
                <input
                  type="url"
                  required
                  value={afterImageUrl}
                  onChange={(e) => setAfterImageUrl(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Important:</strong> Submitting this proof notifies the citizen complainant for ground
                  verification. The complaint is NOT marked resolved until confirmed by the citizen.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCompletionModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingWork}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow transition-all flex items-center gap-2"
                >
                  {isSubmittingWork && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  Submit for Citizen Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentDashboard;
