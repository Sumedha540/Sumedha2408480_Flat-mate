import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
interface UserManagementFiltersProps {
  statusFilter: 'all' | 'pending' | 'approved';
  roleFilter: 'all' | 'tenant' | 'owner';
  searchQuery: string;
  onStatusFilterChange: (status: 'all' | 'pending' | 'approved') => void;
  onRoleFilterChange: (role: 'all' | 'tenant' | 'owner') => void;
  onSearchChange: (query: string) => void;
}
export function UserManagementFilters({
  statusFilter,
  roleFilter,
  searchQuery,
  onStatusFilterChange,
  onRoleFilterChange,
  onSearchChange
}: UserManagementFiltersProps) {
  const statusOptions: Array<'all' | 'pending' | 'approved'> = ['all', 'pending', 'approved'];
  const roleOptions: Array<'all' | 'tenant' | 'owner'> = ['all', 'tenant', 'owner'];
  return <motion.div initial={{
    opacity: 0,
    y: -10
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.3
  }} className="bg-white rounded-xl border border-gray-100 p-4 mb-6 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" value={searchQuery} onChange={e => onSearchChange(e.target.value)} placeholder="Search by name or email..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-button-primary focus:border-transparent transition-all" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Status Filter */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Status
          </label>
          <div className="flex gap-2">
            {statusOptions.map(status => <motion.button key={status} whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} onClick={() => onStatusFilterChange(status)} className={`
                  flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${statusFilter === status ? 'bg-button-primary text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}
                `}>
                {status === 'all' ? 'All' : status === 'pending' ? 'Pending' : 'Approved'}
              </motion.button>)}
          </div>
        </div>

        {/* Role Filter */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Role
          </label>
          <div className="flex gap-2">
            {roleOptions.map(role => <motion.button key={role} whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} onClick={() => onRoleFilterChange(role)} className={`
                  flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all capitalize
                  ${roleFilter === role ? 'bg-button-primary text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}
                `}>
                {role}
              </motion.button>)}
          </div>
        </div>
      </div>

      {/* Active Filters Indicator */}
      {(statusFilter !== 'all' || roleFilter !== 'all' || searchQuery) && <motion.div initial={{
      opacity: 0,
      height: 0
    }} animate={{
      opacity: 1,
      height: 'auto'
    }} className="flex items-center gap-2 pt-2 border-t border-gray-100">
          <Filter className="w-4 h-4 text-button-primary" />
          <span className="text-sm text-gray-600">
            Active filters:{' '}
            {[statusFilter !== 'all' && `Status: ${statusFilter}`, roleFilter !== 'all' && `Role: ${roleFilter}`, searchQuery && `Search: "${searchQuery}"`].filter(Boolean).join(', ')}
          </span>
          <button onClick={() => {
        onStatusFilterChange('all');
        onRoleFilterChange('all');
        onSearchChange('');
      }} className="ml-auto text-sm text-button-primary hover:underline">
            Clear all
          </button>
        </motion.div>}
    </motion.div>;
}