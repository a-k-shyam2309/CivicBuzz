import React from 'react';

const STATUS_CONFIGS = {
  SUBMITTED: {
    label: 'Submitted',
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
  },
  ASSIGNED: {
    label: 'Assigned to Dept',
    bg: 'bg-purple-50 text-purple-700 border-purple-200',
    dot: 'bg-purple-500',
  },
  IN_PROGRESS: {
    label: 'Work in Progress',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500 animate-pulse',
  },
  READY_FOR_CITIZEN_VERIFICATION: {
    label: 'Ready for Verification',
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold',
    dot: 'bg-emerald-600 animate-ping',
  },
  RESOLVED: {
    label: 'Citizen Verified & Resolved',
    bg: 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold',
    dot: 'bg-emerald-600',
  },
  RESOLUTION_REJECTED: {
    label: 'Disputed / Reopened',
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500 animate-pulse',
  },
  CLOSED: {
    label: 'Closed',
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-500',
  },
};

export const StatusBadge = ({ status, size = 'md' }) => {
  const config = STATUS_CONFIGS[status] || {
    label: status || 'Unknown',
    bg: 'bg-slate-50 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
  };

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${sizeClass} font-medium ${config.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
