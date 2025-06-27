import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import KanbanBoard from '@/components/organisms/KanbanBoard';
import FilterBar from '@/components/molecules/FilterBar';
import TaskModal from '@/components/molecules/TaskModal';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { TaskService } from '@/services/api/TaskService';
import { TeamMemberService } from '@/services/api/TeamMemberService';
import { SprintService } from '@/services/api/SprintService';

const BoardView = () => {
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState({
    role: '',
    priority: '',
    assigneeId: '',
    search: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [tasksData, membersData, sprintsData] = await Promise.all([
        TaskService.getAll(),
        TeamMemberService.getAll(),
        SprintService.getAll()
      ]);
      
      setTasks(tasksData);
      setTeamMembers(membersData);
      setSprints(sprintsData);
    } catch (err) {
      setError('Failed to load board data. Please try again.');
      console.error('Error loading board data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prev => 
      prev.map(task => 
        task.Id === updatedTask.Id ? updatedTask : task
      )
    );
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleTaskSave = async (taskData) => {
    try {
      if (selectedTask) {
        // Update existing task
        const updatedTask = await TaskService.update(selectedTask.Id, {
          ...taskData,
          updatedAt: new Date().toISOString(),
        });
        handleTaskUpdate(updatedTask);
        toast.success('Task updated successfully!');
      } else {
        // Create new task
        const newTask = await TaskService.create({
          ...taskData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        setTasks(prev => [...prev, newTask]);
        toast.success('Task created successfully!');
      }
      setIsModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      toast.error('Failed to save task. Please try again.');
      console.error('Error saving task:', error);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await TaskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.Id !== taskId));
      toast.success('Task deleted successfully!');
      setIsModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      toast.error('Failed to delete task. Please try again.');
      console.error('Error deleting task:', error);
    }
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleClearFilters = () => {
    setFilters({
      role: '',
      priority: '',
      assigneeId: '',
      search: '',
    });
  };

  if (loading) {
    return <Loading type="kanban" />;
  }

  if (error) {
    return (
      <Error 
        message={error}
        onRetry={loadData}
      />
    );
  }

  if (tasks.length === 0) {
    return (
      <Empty
        title="No tasks yet"
        description="Create your first task to get started with project management"
        icon="Kanban"
        actionLabel="Create First Task"
        onAction={handleCreateTask}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Task Board
          </h1>
          <p className="text-slate-600">
            Manage your team's tasks with drag-and-drop simplicity
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button
            variant="secondary"
            icon="Filter"
            className="hidden sm:flex"
          >
            View Options
          </Button>
          <Button
            variant="primary"
            icon="Plus"
            onClick={handleCreateTask}
          >
            New Task
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <FilterBar
        selectedRole={filters.role}
        onRoleChange={(role) => setFilters(prev => ({ ...prev, role }))}
        selectedPriority={filters.priority}
        onPriorityChange={(priority) => setFilters(prev => ({ ...prev, priority }))}
        selectedAssignee={filters.assigneeId}
        onAssigneeChange={(assigneeId) => setFilters(prev => ({ ...prev, assigneeId }))}
        searchTerm={filters.search}
        onSearchChange={(search) => setFilters(prev => ({ ...prev, search }))}
        onClearFilters={handleClearFilters}
        teamMembers={teamMembers}
      />

      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden">
        <KanbanBoard
          tasks={tasks}
          onTaskUpdate={handleTaskUpdate}
          onTaskClick={handleTaskClick}
          filters={filters}
        />
      </div>

      {/* Task Modal */}
      <TaskModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        onSave={handleTaskSave}
        onDelete={handleTaskDelete}
        teamMembers={teamMembers}
        sprints={sprints}
      />
    </div>
  );
};

export default BoardView;