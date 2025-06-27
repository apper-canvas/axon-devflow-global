import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TeamMemberCard from '@/components/molecules/TeamMemberCard';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { TeamMemberService } from '@/services/api/TeamMemberService';
import { TaskService } from '@/services/api/TaskService';

const TeamView = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [workloadFilter, setWorkloadFilter] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [membersData, tasksData] = await Promise.all([
        TeamMemberService.getAll(),
        TaskService.getAll()
      ]);
      
      setTeamMembers(membersData);
      setTasks(tasksData);
    } catch (err) {
      setError('Failed to load team data. Please try again.');
      console.error('Error loading team data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMemberClick = (member) => {
    console.log('Member clicked:', member);
    // TODO: Navigate to member details or open modal
  };

  const calculateTeamMetrics = () => {
    const totalMembers = teamMembers.length;
    const activeTasks = tasks.filter(task => task.status !== 'done').length;
    const completedTasks = tasks.filter(task => task.status === 'done').length;
    
    // Calculate average workload
    const totalWorkload = teamMembers.reduce((sum, member) => {
      const memberTasks = tasks.filter(task => task.assigneeId === member.Id);
      return sum + (memberTasks.length / member.capacity) * 100;
    }, 0);
    const avgWorkload = totalMembers > 0 ? Math.round(totalWorkload / totalMembers) : 0;

    // Count members by role
    const roleCount = {
      dev: teamMembers.filter(m => m.role === 'dev').length,
      tester: teamMembers.filter(m => m.role === 'tester').length,
      pm: teamMembers.filter(m => m.role === 'pm').length,
    };

    return {
      totalMembers,
      activeTasks,
      completedTasks,
      avgWorkload,
      roleCount,
    };
  };

  const getFilteredMembers = () => {
    return teamMembers.filter(member => {
      if (roleFilter && member.role !== roleFilter) return false;
      
      if (workloadFilter) {
        const memberTasks = tasks.filter(task => task.assigneeId === member.Id);
        const workloadPercentage = (memberTasks.length / member.capacity) * 100;
        
        if (workloadFilter === 'high' && workloadPercentage < 80) return false;
        if (workloadFilter === 'medium' && (workloadPercentage < 40 || workloadPercentage >= 80)) return false;
        if (workloadFilter === 'low' && workloadPercentage >= 40) return false;
      }
      
      return true;
    });
  };

  const metrics = calculateTeamMetrics();
  const filteredMembers = getFilteredMembers();

  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'dev', label: 'Developers' },
    { value: 'tester', label: 'Testers' },
    { value: 'pm', label: 'Project Managers' },
  ];

  const workloadOptions = [
    { value: '', label: 'All Workloads' },
    { value: 'high', label: 'High (80%+)' },
    { value: 'medium', label: 'Medium (40-79%)' },
    { value: 'low', label: 'Low (<40%)' },
  ];

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

  if (teamMembers.length === 0) {
    return (
      <Empty
        title="No team members yet"
        description="Add team members to start tracking workload and assignments"
        icon="Users"
        actionLabel="Add Team Member"
        onAction={() => console.log('Add team member')}
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
            Team Overview
          </h1>
          <p className="text-slate-600">
            Monitor team workload and task distribution
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button
            variant="secondary"
            icon="Download"
            className="hidden sm:flex"
          >
            Export Report
          </Button>
          <Button
            variant="primary"
            icon="UserPlus"
          >
            Add Member
          </Button>
        </div>
      </motion.div>

      {/* Team Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-2">
            <ApperIcon name="Users" size={24} className="text-primary-500" />
            <span className="text-2xl font-bold text-slate-800">{metrics.totalMembers}</span>
          </div>
          <p className="text-sm text-slate-600">Team Members</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-2">
            <ApperIcon name="Clock" size={24} className="text-blue-500" />
            <span className="text-2xl font-bold text-blue-600">{metrics.activeTasks}</span>
          </div>
          <p className="text-sm text-slate-600">Active Tasks</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-2">
            <ApperIcon name="CheckCircle" size={24} className="text-emerald-500" />
            <span className="text-2xl font-bold text-emerald-600">{metrics.completedTasks}</span>
          </div>
          <p className="text-sm text-slate-600">Completed Tasks</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-2">
            <ApperIcon name="Zap" size={24} className="text-amber-500" />
            <span className="text-2xl font-bold text-amber-600">{metrics.avgWorkload}%</span>
          </div>
          <p className="text-sm text-slate-600">Avg Workload</p>
        </div>
      </motion.div>

      {/* Role Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-card p-6 mb-8"
      >
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <ApperIcon name="PieChart" size={20} className="mr-2" />
          Team Composition
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="w-12 h-12 mx-auto bg-blue-500 rounded-lg flex items-center justify-center mb-3">
              <ApperIcon name="Code" size={24} className="text-white" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{metrics.roleCount.dev}</div>
            <div className="text-sm text-slate-600">Developers</div>
          </div>
          
          <div className="text-center p-4 bg-amber-50 rounded-lg">
            <div className="w-12 h-12 mx-auto bg-amber-500 rounded-lg flex items-center justify-center mb-3">
              <ApperIcon name="Bug" size={24} className="text-white" />
            </div>
            <div className="text-2xl font-bold text-amber-600">{metrics.roleCount.tester}</div>
            <div className="text-sm text-slate-600">Testers</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="w-12 h-12 mx-auto bg-purple-500 rounded-lg flex items-center justify-center mb-3">
              <ApperIcon name="Users" size={24} className="text-white" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{metrics.roleCount.pm}</div>
            <div className="text-sm text-slate-600">Project Managers</div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-card p-6 mb-6"
      >
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Filter Team Members
            </h3>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              options={roleOptions}
              placeholder="Filter by role"
              className="min-w-[160px]"
            />
            
            <Select
              value={workloadFilter}
              onChange={(e) => setWorkloadFilter(e.target.value)}
              options={workloadOptions}
              placeholder="Filter by workload"
              className="min-w-[160px]"
            />
            
            {(roleFilter || workloadFilter) && (
              <Button
                variant="ghost"
                size="md"
                onClick={() => {
                  setRoleFilter('');
                  setWorkloadFilter('');
                }}
                icon="X"
                className="whitespace-nowrap"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Team Members Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <TeamMemberCard
              key={member.Id}
              member={member}
              tasks={tasks}
              onClick={() => handleMemberClick(member)}
            />
          ))}
        </div>
        
        {filteredMembers.length === 0 && (
          <Empty
            title="No team members match your filters"
            description="Try adjusting your filters to see more team members"
            icon="Users"
            showAction={false}
          />
        )}
      </motion.div>
    </div>
  );
};

export default TeamView;