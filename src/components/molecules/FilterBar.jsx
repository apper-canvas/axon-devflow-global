import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import Input from '@/components/atoms/Input';

const FilterBar = ({
  selectedRole,
  onRoleChange,
  selectedPriority,
  onPriorityChange,
  selectedAssignee,
  onAssigneeChange,
  searchTerm,
  onSearchChange,
  onClearFilters,
  teamMembers = [],
}) => {
  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'dev', label: 'Developer' },
    { value: 'tester', label: 'Tester' },
    { value: 'pm', label: 'Project Manager' },
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  const assigneeOptions = [
    { value: '', label: 'All Assignees' },
    ...teamMembers.map(member => ({
      value: member.Id.toString(),
      label: member.name,
    })),
  ];

  const hasActiveFilters = selectedRole || selectedPriority || selectedAssignee || searchTerm;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-card p-4 mb-6"
    >
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
        <div className="flex-1">
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            icon="Search"
            className="min-w-0"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <Select
            value={selectedRole}
            onChange={(e) => onRoleChange(e.target.value)}
            options={roleOptions}
            placeholder="Filter by role"
            className="min-w-[140px]"
          />
          
          <Select
            value={selectedPriority}
            onChange={(e) => onPriorityChange(e.target.value)}
            options={priorityOptions}
            placeholder="Filter by priority"
            className="min-w-[140px]"
          />
          
          <Select
            value={selectedAssignee}
            onChange={(e) => onAssigneeChange(e.target.value)}
            options={assigneeOptions}
            placeholder="Filter by assignee"
            className="min-w-[160px]"
          />
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="md"
              onClick={onClearFilters}
              icon="X"
              className="whitespace-nowrap"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FilterBar;