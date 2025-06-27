import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { TaskService } from '@/services/api/TaskService';
import { SprintService } from '@/services/api/SprintService';

const Sidebar = () => {
  const location = useLocation();
  const [tasks, setTasks] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    completionRate: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksData, sprintsData] = await Promise.all([
        TaskService.getAll(),
        SprintService.getAll()
      ]);
      
      setTasks(tasksData);
      setSprints(sprintsData);
      
      // Calculate stats
      const completedTasks = tasksData.filter(task => task.status === 'done');
      const inProgressTasks = tasksData.filter(task => task.status === 'inprogress');
      const completionRate = tasksData.length > 0 
        ? Math.round((completedTasks.length / tasksData.length) * 100) 
        : 0;

      setStats({
        totalTasks: tasksData.length,
        completedTasks: completedTasks.length,
        inProgressTasks: inProgressTasks.length,
        completionRate,
      });
    } catch (error) {
      console.error('Failed to load sidebar data:', error);
    }
  };

  const navigationItems = [
    {
      path: '/board',
      icon: 'Kanban',
      label: 'Board',
      description: 'Kanban view of all tasks',
    },
    {
      path: '/sprints',
      icon: 'Calendar',
      label: 'Sprints',
      description: 'Sprint planning & management',
    },
    {
      path: '/team',
      icon: 'Users',
      label: 'Team',
      description: 'Team members & workload',
    },
    {
      path: '/analytics',
      icon: 'BarChart3',
      label: 'Analytics',
      description: 'Performance metrics',
    },
  ];

  const isActive = (path) => {
    if (path === '/board') {
      return location.pathname === '/' || location.pathname === '/board';
    }
    return location.pathname === path;
  };

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-80 bg-white border-r border-slate-200 h-[calc(100vh-4rem)] overflow-y-auto"
    >
      <div className="p-6">
        {/* Navigation */}
        <nav className="space-y-2 mb-8">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive: active }) => `
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                ${active || isActive(item.path)
                  ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 shadow-sm border border-primary-200'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }
              `}
            >
              <ApperIcon 
                name={item.icon} 
                size={20} 
                className={isActive(item.path) ? 'text-primary-600' : ''}
              />
              <div className="flex-1">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs opacity-75">{item.description}</div>
              </div>
            </NavLink>
          ))}
        </nav>

        {/* Quick Stats */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-5 mb-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center">
            <ApperIcon name="Activity" size={18} className="mr-2" />
            Quick Stats
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Total Tasks</span>
              <span className="font-bold text-lg text-slate-800">
                {stats.totalTasks}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Completed</span>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-emerald-600">
                  {stats.completedTasks}
                </span>
                <Badge 
                  variant="default" 
                  size="sm"
                  className="bg-emerald-100 text-emerald-800"
                >
                  {stats.completionRate}%
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">In Progress</span>
              <span className="font-bold text-lg text-blue-600">
                {stats.inProgressTasks}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500">Sprint Progress</span>
                <span className="text-xs font-medium text-slate-700">
                  {stats.completionRate}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.completionRate}%` }}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full"
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Role Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center">
            <ApperIcon name="Filter" size={18} className="mr-2" />
            Filter by Role
          </h3>
          
          <div className="space-y-2">
            {[
              { role: 'dev', label: 'Developer', count: tasks.filter(t => t.role === 'dev').length },
              { role: 'tester', label: 'Tester', count: tasks.filter(t => t.role === 'tester').length },
              { role: 'pm', label: 'Project Manager', count: tasks.filter(t => t.role === 'pm').length },
            ].map((item) => (
              <button
                key={item.role}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    item.role === 'dev' ? 'bg-blue-500' :
                    item.role === 'tester' ? 'bg-amber-500' :
                    'bg-purple-500'
                  }`} />
                  <span className="text-sm font-medium text-slate-700">
                    {item.label}
                  </span>
                </div>
                <Badge variant="default" size="sm">
                  {item.count}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center">
            <ApperIcon name="Clock" size={18} className="mr-2" />
            Recent Activity
          </h3>
          
          <div className="space-y-3">
            {tasks.slice(0, 3).map((task) => (
              <div key={task.Id} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  task.status === 'done' ? 'bg-emerald-500' :
                  task.status === 'inprogress' ? 'bg-blue-500' :
                  'bg-slate-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {task.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(task.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;