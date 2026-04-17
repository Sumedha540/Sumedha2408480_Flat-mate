import React from 'react';
import { CheckCircleIcon, ClockIcon, XCircleIcon, CircleDotIcon } from 'lucide-react';

type Status = 'submitted' | 'approved' | 'rejected' | 'completed' | 'confirmed';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig = {
  submitted: {
    label: 'Submitted',
    icon: ClockIcon,
    className: 'bg-yellow-100 text-yellow-700'
  },
  approved: {
    label: 'Approved',
    icon: CheckCircleIcon,
    className: 'bg-green-100 text-green-700'
  },
  confirmed: {
    label: 'Confirmed',
    icon: CheckCircleIcon,
    className: 'status-badge-confirmed'
  },
  rejected: {
    label: 'Rejected',
    icon: XCircleIcon,
    className: 'status-badge-rejected'
  },
  completed: {
    label: 'Completed',
    icon: CircleDotIcon,
    className: 'bg-blue-100 text-blue-700'
  }
};

export function StatusBadge({
  status,
  className = ''
}: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.submitted;
  const Icon = config.icon;
  
  return (
    <span 
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5
        text-sm font-bold rounded-full
        ${config.className}
        ${className}
      `}
    >
      <Icon className="w-4 h-4" />
      {config.label}
    </span>
  );
}