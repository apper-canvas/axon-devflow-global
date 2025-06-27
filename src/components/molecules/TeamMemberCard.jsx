import React from 'react';
import { motion } from 'framer-motion';
import Avatar from '@/components/atoms/Avatar';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const TeamMemberCard = ({ member, tasks = [], onClick }) => {
  const memberTasks = tasks.filter(task => task.assigneeId === member.Id);
  const completedTasks = memberTasks.filter(task => task.status === 'done');
  const inProgressTasks = memberTasks.filter(task => task.status === 'inprogress');
  
  const completionRate = memberTasks.length > 0 
    ? Math.round((completedTasks.length / memberTasks.length) * 100) 
    : 0;

  const workloadPercentage = Math.min((memberTasks.length / member.capacity) * 100, 100);

  const getWorkloadColor = (percentage) => {
    if (percentage >= 90) return 'text-red-500 bg-red-50';
    if (percentage >= 70) return 'text-amber-500 bg-amber-50';
    return 'text-emerald-500 bg-emerald-50';
  };

  const getRoleIcon = (role) => {
    const icons = {
      dev: 'Code',
      tester: 'Bug',
      pm: 'Users',
    };
    return icons[role] || 'User';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)' }}
      className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Avatar 
            name={member.name} 
            avatar={member.avatar}
            size="xl"
          />
          <div className="flex-1">
            <h3 className="font-bold text-lg text-slate-800 mb-1">
              {member.name}
            </h3>
            <div className="flex items-center space-x-2">
              <ApperIcon name={getRoleIcon(member.role)} size={16} />
              <Badge variant={member.role}>
                {member.role === 'dev' ? 'Developer' : 
                 member.role === 'tester' ? 'Tester' : 
                 'Project Manager'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-slate-800">
              {memberTasks.length}
            </div>
            <div className="text-sm text-slate-600">Active Tasks</div>
          </div>
          <div className="text-center p-3 bg-emerald-50 rounded-lg">
            <div className="text-2xl font-bold text-emerald-600">
              {completionRate}%
            </div>
            <div className="text-sm text-slate-600">Completion Rate</div>
          </div>
        </div>

        {/* Workload Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Workload</span>
            <span className={`text-sm font-bold px-2 py-1 rounded-full ${getWorkloadColor(workloadPercentage)}`}>
              {Math.round(workloadPercentage)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(workloadPercentage, 100)}%` }}
              className={`h-2 rounded-full ${
                workloadPercentage >= 90 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                workloadPercentage >= 70 ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
                'bg-gradient-to-r from-emerald-500 to-emerald-600'
              }`}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Task Status Breakdown */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-slate-600">In Progress</span>
            </div>
            <span className="font-medium text-slate-800">{inProgressTasks.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="text-slate-600">Completed</span>
            </div>
            <span className="font-medium text-slate-800">{completedTasks.length}</span>
          </div>
        </div>

        {/* Capacity Info */}
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <div className="flex items-center space-x-1">
              <ApperIcon name="Zap" size={14} />
              <span>Capacity</span>
            </div>
            <span className="font-medium">{member.capacity} tasks</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamMemberCard;