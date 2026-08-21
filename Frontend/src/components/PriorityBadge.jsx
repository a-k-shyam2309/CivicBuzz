import React from 'react';
import { AlertTriangle, AlertCircle, Info, ShieldAlert } from 'lucide-react';

const PRIORITY_CONFIGS = {
  CRITICAL: {
    label: 'Critical Priority',
    bg: 'bg-rose-50 text-rose-700 border-rose-300',
    icon: ShieldAlert,
  },
  HIGH: {
    label: 'High Priority',
    bg: 'bg-amber-50 text-amber-800 border-amber-300',
    icon: AlertTriangle,
  },
  MEDIUM: {
    label: 'Medium Priority',
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: AlertCircle,
  },
  LOW: {
    label: 'Low Priority',
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Info,
  },
};

export const PriorityBadge = ({ level, score = null }) => {
  const config = PRIORITY_CONFIGS[level?.toUpperCase()] || PRIORITY_CONFIGS.MEDIUM;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-semibold ${config.bg}`}
      title={score ? `Priority Score: ${score}/100` : undefined}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
      {score !== null && <span className="opacity-75 text-[10px]">({score})</span>}
    </span>
  );
};

export default PriorityBadge;
