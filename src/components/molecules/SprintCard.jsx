import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const SprintCard = ({ sprint, tasks = [], onClick, isActive = false }) => {
  const sprintTasks = tasks.filter(task => task.sprintId === sprint.Id);
  const completedTasks = sprintTasks.filter(task => task.status === 'done');
  const progressPercentage = sprintTasks.length > 0 
    ? Math.round((completedTasks.length / sprintTasks.length) * 100) 
    : 0;

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-emerald-500',
      planned: 'bg-blue-500',
      completed: 'bg-slate-400',
    };
    return colors[status] || 'bg-slate-400';
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: 'Play',
      planned: 'Calendar',
      completed: 'CheckCircle',
    };
    return icons[status] || 'Circle';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)' }}
      className={`
        bg-white rounded-xl shadow-card hover:shadow-card-hover 
        transition-all duration-300 cursor-pointer overflow-hidden
        ${isActive ? 'ring-2 ring-primary-500 ring-offset-2' : ''}
      `}
      onClick={onClick}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(sprint.status)}`} />
            <div>
              <h3 className="font-bold text-lg text-slate-800 mb-1">
                {sprint.name}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <ApperIcon name={getStatusIcon(sprint.status)} size={14} />
                <span className="capitalize">{sprint.status}</span>
              </div>
            </div>
          </div>
          
          {isActive && (
            <Badge variant="default" className="bg-primary-100 text-primary-800">
              Current
            </Badge>
          )}
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Progress</span>
            <span className="text-sm font-bold text-primary-600">
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Tasks Summary */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-slate-800">
              {sprintTasks.length}
            </div>
            <div className="text-sm text-slate-600">Total Tasks</div>
          </div>
          <div className="text-center p-3 bg-emerald-50 rounded-lg">
            <div className="text-2xl font-bold text-emerald-600">
              {completedTasks.length}
            </div>
            <div className="text-sm text-slate-600">Completed</div>
          </div>
        </div>

        {/* Sprint Duration */}
        <div className="flex items-center justify-between text-sm text-slate-600">
          <div className="flex items-center space-x-1">
            <ApperIcon name="Calendar" size={14} />
            <span>{format(new Date(sprint.startDate), 'MMM dd')}</span>
          </div>
          <ApperIcon name="ArrowRight" size={14} />
          <div className="flex items-center space-x-1">
            <ApperIcon name="Flag" size={14} />
            <span>{format(new Date(sprint.endDate), 'MMM dd')}</span>
          </div>
        </div>

        {/* Goals */}
        {sprint.goals && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <p className="text-sm text-slate-600 line-clamp-2">
              {sprint.goals}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SprintCard;