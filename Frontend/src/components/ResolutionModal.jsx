import React, { useState } from 'react';
import { CheckCircle, XCircle, Star, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { complaintService } from '../services/complaintService';

export const ResolutionModal = ({
  complaint,
  isOpen,
  onClose,
  onResolutionSuccess,
}) => {
  const [activeTab, setActiveTab] = useState('APPROVE'); // 'APPROVE' or 'REJECT'
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState('');
  const [disputeReason, setDisputeReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !complaint) return null;

  const handleApprove = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await complaintService.verifyCitizenResolution(
        complaint.complaint_id,
        rating,
        comments
      );
      if (onResolutionSuccess) {
        onResolutionSuccess(res);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to verify resolution.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    if (!disputeReason || disputeReason.trim().length < 5) {
      setError('Please provide a specific reason explaining why the issue is not resolved.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await complaintService.rejectCitizenResolution(
        complaint.complaint_id,
        disputeReason
      );
      if (onResolutionSuccess) {
        onResolutionSuccess(res);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit dispute.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Citizen Ground Verification
              </span>
            </div>
            <h3 className="text-lg font-bold mt-1">
              Verify Repair: #{complaint.complaint_id}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Department Work Summary Notice */}
        <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex items-start gap-3 text-xs text-emerald-900">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Department Has Claimed Work Completion:</span>
            <p className="text-emerald-800 mt-0.5">
              Please inspect the physical site. The government department cannot finalize this
              grievance as resolved without your explicit verification.
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 p-3 gap-2 bg-slate-100/70 border-b border-slate-200">
          <button
            type="button"
            onClick={() => {
              setActiveTab('APPROVE');
              setError(null);
            }}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'APPROVE'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            Problem Resolved
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('REJECT');
              setError(null);
            }}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'REJECT'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            <XCircle className="w-4 h-4" />
            Not Resolved Properly
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'APPROVE' ? (
            <form onSubmit={handleApprove} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Rate Work Quality & Timeliness:
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          (hoverRating || rating) >= star
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">
                    {rating} of 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Citizen Feedback / Appreciation (Optional):
                </label>
                <textarea
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="e.g. Verified on site, road pothole has been smoothly patched and leveled."
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-3.5 h-3.5" />
                  )}
                  {isSubmitting ? 'Confirming...' : 'Confirm Resolution (Mark Resolved)'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleReject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-rose-800 mb-1.5">
                  Explain Why the Issue Is Incomplete or Defective:
                </label>
                <textarea
                  rows={4}
                  required
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="e.g. Only half of the pothole was filled with loose gravel. Water is still leaking from the pipe."
                  className="w-full text-xs p-3 border border-rose-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none bg-rose-50/20"
                />
              </div>

              <p className="text-[11px] text-slate-500">
                Disputing this resolution will automatically reopen the complaint, notify the
                Department Head, and escalate the record to the Municipal Audit log.
              </p>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                  {isSubmitting ? 'Submitting Dispute...' : 'Reject Resolution & Reopen Complaint'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResolutionModal;
