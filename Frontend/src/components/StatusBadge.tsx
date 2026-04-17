import React from 'react';
import { CheckCircleIcon, ClockIcon, XCircleIcon, CircleDotIcon, BanknoteIcon } from 'lucide-react';
type Status = 'submitted' | 'approved' | 'rejected' | 'completed' | 'pending-cash' | 'paid' | 'confirmed';
interface StatusBadgeProps {
  status: Status;
  className?: string;
}
const statusConfig = {
  submitted: {
    label: 'Submitted',
    icon: ClockIcon,
    className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
  },
  approved: {
    label: 'Approved',
    icon: CheckCircleIcon,
    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
  },
  confirmed: {
    label: 'Confirmed',
    icon: CheckCircleIcon,
    className: 'bg-green-100 !text-green-700 dark:bg-green-900/30 dark:!text-green-400 font-semibold'
  },
  rejected: {
    label: 'Rejected',
    icon: XCircleIcon,
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  },
  completed: {
    label: 'Completed',
    icon: CircleDotIcon,
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
  },
  'pending-cash': {
    label: 'Pending Cash',
    icon: BanknoteIcon,
    className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
  },
  paid: {
    label: 'Paid',
    icon: CheckCircleIcon,
    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
  }
};
export function StatusBadge({
  status,
  className = ''
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return <span className={`
        inline-flex items-center gap-1.5 px-3 py-1.5
        text-sm font-medium rounded-full
        ${config.className}
        ${className}
      `}>
      <Icon className="w-4 h-4" />
      {config.label}
    </span>;
}