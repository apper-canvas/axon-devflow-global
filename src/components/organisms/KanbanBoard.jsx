import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import TaskCard from '@/components/molecules/TaskCard';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { TaskService } from '@/services/api/TaskService';
import { TeamMemberService } from '@/services/api/TeamMemberService';

const KanbanBoard = ({ 
  tasks = [], 
  onTaskUpdate, 
  onTaskClick,
  filters = {},
}) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedOver, setDraggedOver] = useState(null);

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      const members = await TeamMemberService.getAll();
      setTeamMembers(members);
    } catch (error) {
      console.error('Failed to load team members:', error);
    }
  };

  const columns = [
    {
      id: 'todo',
      title: 'To Do',
      icon: 'Circle',
      color: 'bg-slate-100',
      borderColor: 'border-slate-300',
      count: 0,
    },
    {
      id: 'inprogress',
      title: 'In Progress',
      icon: 'Clock',
      color: 'bg-blue-100',
      borderColor: 'border-blue-300',
      count: 0,
    },
    {
      id: 'inreview',
      title: 'In Review',
      icon: 'Eye',
      color: 'bg-amber-100',
      borderColor: 'border-amber-300',
      count: 0,
    },
    {
      id: 'done',
      title: 'Done',
      icon: 'CheckCircle',
      color: 'bg-emerald-100',
      borderColor: 'border-emerald-300',
      count: 0,
    },
  ];

  // Filter tasks based on filters
  const filteredTasks = tasks.filter(task => {
    if (filters.role && task.role !== filters.role) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.assigneeId && task.assigneeId !== parseInt(filters.assigneeId)) return false;
    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  // Update column counts
  const columnsWithCounts = columns.map(column => ({
    ...column,
    count: filteredTasks.filter(task => task.status === column.id).length,
  }));

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDraggedOver(columnId);
  };

  const handleDragLeave = () => {
    setDraggedOver(null);
  };

  const handleDrop = async (e, columnId) => {
    e.preventDefault();
    setDraggedOver(null);

    if (draggedTask && draggedTask.status !== columnId) {
      try {
        const updatedTask = {
          ...draggedTask,
          status: columnId,
          updatedAt: new Date().toISOString(),
        };
        
        await TaskService.update(draggedTask.Id, updatedTask);
        onTaskUpdate(updatedTask);
        
        toast.success(`Task moved to ${columns.find(c => c.id === columnId)?.title}`);
      } catch (error) {
        toast.error('Failed to update task status');
        console.error('Error updating task:', error);
      }
    }
    
    setDraggedTask(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDraggedOver(null);
  };

  return (
    <div className="h-full overflow-x-auto pb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-w-max lg:min-w-full">
        {columnsWithCounts.map((column) => (
          <motion.div
            key={column.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              min-h-[600px] rounded-xl border-2 transition-all duration-200
              ${draggedOver === column.id 
                ? `${column.borderColor} ${column.color}` 
                : 'border-slate-200 bg-slate-50'
              }
            `}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <ApperIcon 
                    name={column.icon} 
                    size={18} 
                    className="text-slate-600"
                  />
                  <h3 className="font-semibold text-slate-800">
                    {column.title}
                  </h3>
                </div>
                <Badge variant="default" size="sm">
                  {column.count}
                </Badge>
              </div>
              
              {/* Quick Add Button */}
              <Button
                variant="ghost"
                size="sm"
                icon="Plus"
                className="w-full justify-start text-slate-500 hover:text-slate-700 border-dashed border border-slate-300 hover:border-slate-400"
                onClick={() => {
                  // Handle quick task creation for this column
                  console.log(`Quick add to ${column.id}`);
                }}
              >
                Add task
              </Button>
            </div>

            {/* Tasks */}
            <div className="p-4 space-y-3">
              {filteredTasks
                .filter(task => task.status === column.id)
                .map((task) => (
                  <div
                    key={task.Id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                    className="drag-handle"
                  >
                    <TaskCard
                      task={task}
                      teamMembers={teamMembers}
                      onClick={() => onTaskClick(task)}
                      isDragging={draggedTask?.Id === task.Id}
                    />
                  </div>
                ))
              }
              
              {/* Empty State */}
              {filteredTasks.filter(task => task.status === column.id).length === 0 && (
                <div className="text-center py-8">
                  <ApperIcon 
                    name="Package" 
                    size={32} 
                    className="text-slate-300 mx-auto mb-2"
                  />
                  <p className="text-sm text-slate-500">
                    No tasks in {column.title.toLowerCase()}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;