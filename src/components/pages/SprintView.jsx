import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import SprintCard from '@/components/molecules/SprintCard';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { SprintService } from '@/services/api/SprintService';
import { TaskService } from '@/services/api/TaskService';

const SprintView = () => {
  const [sprints, setSprints] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSprint, setActiveSprint] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSprintData, setNewSprintData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    goals: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [sprintsData, tasksData] = await Promise.all([
        SprintService.getAll(),
        TaskService.getAll()
      ]);
      
      setSprints(sprintsData);
      setTasks(tasksData);
      
      // Find active sprint
      const active = sprintsData.find(sprint => sprint.status === 'active');
      setActiveSprint(active);
    } catch (err) {
      setError('Failed to load sprint data. Please try again.');
      console.error('Error loading sprint data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSprint = async (e) => {
    e.preventDefault();
    try {
      const newSprint = await SprintService.create({
        ...newSprintData,
        status: 'planned',
        teamId: 1, // Default team ID
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      setSprints(prev => [...prev, newSprint]);
      setIsCreateModalOpen(false);
      setNewSprintData({
        name: '',
        startDate: '',
        endDate: '',
        goals: '',
      });
      toast.success('Sprint created successfully!');
    } catch (error) {
      toast.error('Failed to create sprint. Please try again.');
      console.error('Error creating sprint:', error);
    }
  };

  const handleSprintClick = (sprint) => {
    console.log('Sprint clicked:', sprint);
    // TODO: Navigate to sprint details or open modal
  };

  const calculateSprintMetrics = () => {
    const totalSprints = sprints.length;
    const completedSprints = sprints.filter(s => s.status === 'completed').length;
    const activeSprints = sprints.filter(s => s.status === 'active').length;
    const plannedSprints = sprints.filter(s => s.status === 'planned').length;

    return {
      total: totalSprints,
      completed: completedSprints,
      active: activeSprints,
      planned: plannedSprints,
    };
  };

  const metrics = calculateSprintMetrics();

  if (loading) {
    return <Loading type="cards" count={6} />;
  }

  if (error) {
    return (
      <Error 
        message={error}
        onRetry={loadData}
      />
    );
  }

  if (sprints.length === 0) {
    return (
      <Empty
        title="No sprints yet"
        description="Create your first sprint to start planning your team's work"
        icon="Calendar"
        actionLabel="Create First Sprint"
        onAction={() => setIsCreateModalOpen(true)}
      />
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Sprint Management
          </h1>
          <p className="text-slate-600">
            Plan and track your development sprints
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button
            variant="secondary"
            icon="BarChart3"
            className="hidden sm:flex"
          >
            Sprint Reports
          </Button>
          <Button
            variant="primary"
            icon="Plus"
            onClick={() => setIsCreateModalOpen(true)}
          >
            New Sprint
          </Button>
        </div>
      </motion.div>

      {/* Metrics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-2">
            <ApperIcon name="Calendar" size={24} className="text-primary-500" />
            <span className="text-2xl font-bold text-slate-800">{metrics.total}</span>
          </div>
          <p className="text-sm text-slate-600">Total Sprints</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-2">
            <ApperIcon name="Play" size={24} className="text-emerald-500" />
            <span className="text-2xl font-bold text-emerald-600">{metrics.active}</span>
          </div>
          <p className="text-sm text-slate-600">Active Sprints</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-2">
            <ApperIcon name="CheckCircle" size={24} className="text-blue-500" />
            <span className="text-2xl font-bold text-blue-600">{metrics.completed}</span>
          </div>
          <p className="text-sm text-slate-600">Completed</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-2">
            <ApperIcon name="Clock" size={24} className="text-amber-500" />
            <span className="text-2xl font-bold text-amber-600">{metrics.planned}</span>
          </div>
          <p className="text-sm text-slate-600">Planned</p>
        </div>
      </motion.div>

      {/* Active Sprint Highlight */}
      {activeSprint && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <ApperIcon name="Zap" size={20} className="mr-2 text-emerald-500" />
            Current Sprint
          </h2>
          <div className="max-w-md">
            <SprintCard
              sprint={activeSprint}
              tasks={tasks}
              onClick={() => handleSprintClick(activeSprint)}
              isActive={true}
            />
          </div>
        </motion.div>
      )}

      {/* All Sprints */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <ApperIcon name="List" size={20} className="mr-2" />
          All Sprints
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sprints.map((sprint) => (
            <SprintCard
              key={sprint.Id}
              sprint={sprint}
              tasks={tasks}
              onClick={() => handleSprintClick(sprint)}
              isActive={sprint.Id === activeSprint?.Id}
            />
          ))}
        </div>
      </motion.div>

      {/* Create Sprint Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800">Create New Sprint</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCreateModalOpen(false)}
                icon="X"
                className="text-slate-400 hover:text-slate-600"
              />
            </div>

            <form onSubmit={handleCreateSprint} className="p-6 space-y-4">
              <Input
                label="Sprint Name"
                value={newSprintData.name}
                onChange={(e) => setNewSprintData(prev => ({ 
                  ...prev, 
                  name: e.target.value 
                }))}
                placeholder="Enter sprint name..."
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="date"
                  value={newSprintData.startDate}
                  onChange={(e) => setNewSprintData(prev => ({ 
                    ...prev, 
                    startDate: e.target.value 
                  }))}
                  required
                />

                <Input
                  label="End Date"
                  type="date"
                  value={newSprintData.endDate}
                  onChange={(e) => setNewSprintData(prev => ({ 
                    ...prev, 
                    endDate: e.target.value 
                  }))}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sprint Goals
                </label>
                <textarea
                  value={newSprintData.goals}
                  onChange={(e) => setNewSprintData(prev => ({ 
                    ...prev, 
                    goals: e.target.value 
                  }))}
                  placeholder="What do you want to achieve in this sprint?"
                  rows={3}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  icon="Plus"
                >
                  Create Sprint
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SprintView;