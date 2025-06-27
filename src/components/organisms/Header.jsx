import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const Header = () => {
  const location = useLocation();
  const [currentSprint] = useState("Sprint 23");
  const [sprintStatus] = useState("active");

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/' || path === '/board') return 'Task Board';
    if (path === '/sprints') return 'Sprint Planning';
    if (path === '/team') return 'Team Overview';
    if (path === '/analytics') return 'Analytics';
    return 'DevFlow';
  };

  const getPageIcon = () => {
    const path = location.pathname;
    if (path === '/' || path === '/board') return 'Kanban';
    if (path === '/sprints') return 'Calendar';
    if (path === '/team') return 'Users';
    if (path === '/analytics') return 'BarChart3';
    return 'Zap';
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-slate-200 shadow-sm"
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-6">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">DevFlow</h1>
                <p className="text-xs text-slate-500">Software Team Management</p>
              </div>
            </div>

            {/* Page Title */}
            <div className="hidden md:flex items-center space-x-2 pl-6 border-l border-slate-200">
              <ApperIcon name={getPageIcon()} size={20} className="text-slate-600" />
              <h2 className="text-lg font-semibold text-slate-800">
                {getPageTitle()}
              </h2>
            </div>
          </div>

          {/* Center Section - Current Sprint */}
          <div className="hidden lg:flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-lg">
            <ApperIcon 
              name="Play" 
              size={16} 
              className="text-emerald-500"
            />
            <span className="text-sm font-medium text-slate-700">
              {currentSprint}
            </span>
            <Badge 
              variant="default" 
              size="sm"
              className={`
                ${sprintStatus === 'active' ? 'bg-emerald-100 text-emerald-800' : ''}
              `}
            >
              {sprintStatus}
            </Badge>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Quick Actions */}
            <div className="hidden sm:flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                icon="Search"
                className="text-slate-600 hover:text-slate-800"
              />
              <Button
                variant="ghost"
                size="sm"
                icon="Bell"
                className="text-slate-600 hover:text-slate-800 relative"
              >
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon="Settings"
                className="text-slate-600 hover:text-slate-800"
              />
            </div>

            {/* Create Task Button */}
            <Button
              variant="primary"
              size="sm"
              icon="Plus"
              className="shadow-lg hover:shadow-xl"
            >
              <span className="hidden sm:inline">New Task</span>
            </Button>

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="sm"
              icon="Menu"
              className="sm:hidden text-slate-600 hover:text-slate-800"
            />
          </div>
        </div>

        {/* Mobile Page Title */}
        <div className="md:hidden mt-3 flex items-center space-x-2">
          <ApperIcon name={getPageIcon()} size={18} className="text-slate-600" />
          <h2 className="text-lg font-semibold text-slate-800">
            {getPageTitle()}
          </h2>
        </div>

        {/* Mobile Current Sprint */}
        <div className="lg:hidden mt-3 flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-lg">
            <ApperIcon 
              name="Play" 
              size={14} 
              className="text-emerald-500"
            />
            <span className="text-sm font-medium text-slate-700">
              {currentSprint}
            </span>
            <Badge 
              variant="default" 
              size="sm"
              className="bg-emerald-100 text-emerald-800"
            >
              {sprintStatus}
            </Badge>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;