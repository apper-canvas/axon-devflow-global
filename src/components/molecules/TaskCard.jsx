import React from 'react';
import { motion } from 'framer-motion';
import Badge from '@/components/atoms/Badge';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';

const TaskCard = ({ 
  task, 
  onClick, 
  isDragging = false,
  teamMembers = [],
  ...props 
}) => {
  const assignee = teamMembers.find(member => member.Id === task.assigneeId);
  
  const getRoleColor = (role) => {
    const colors = {
      dev: 'border-l-blue-500',
      tester: 'border-l-amber-500',
      pm: 'border-l-purple-500',
    };
    return colors[role] || 'border-l-slate-300';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-500',
      medium: 'text-amber-500',
      low: 'text-slate-400',
    };
    return colors[priority] || 'text-slate-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ 
        y: -2, 
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)' 
      }}
      className={`
        bg-white rounded-lg border-l-4 ${getRoleColor(task.role)}
        shadow-card hover:shadow-card-hover transition-all duration-200
        cursor-pointer group
        ${isDragging ? 'shadow-drag rotate-2 scale-105' : ''}
      `}
      onClick={onClick}
      {...props}
    >
      <div className="p-4">
        {/* Header with Priority and Role */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <ApperIcon 
              name="Flag" 
              size={14} 
              className={getPriorityColor(task.priority)}
            />
            <Badge variant={task.role} size="sm">
              {task.role.toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center space-x-1">
            {task.tags && task.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-primary-600 transition-colors">
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p className="text-sm text-slate-600 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {assignee && (
              <Avatar 
                name={assignee.name} 
                avatar={assignee.avatar}
                size="sm"
              />
            )}
            {task.estimate && (
              <div className="flex items-center text-xs text-slate-500">
                <ApperIcon name="Clock" size={12} className="mr-1" />
                {task.estimate}h
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <ApperIcon name="Calendar" size={12} />
            <span>{new Date(task.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;