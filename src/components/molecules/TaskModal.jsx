import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Badge from '@/components/atoms/Badge';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';

const TaskModal = ({ 
  task, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  teamMembers = [],
  sprints = [],
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    role: 'dev',
    assigneeId: '',
    sprintId: '',
    estimate: '',
    tags: [],
  });

  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        role: task.role || 'dev',
        assigneeId: task.assigneeId?.toString() || '',
        sprintId: task.sprintId?.toString() || '',
        estimate: task.estimate?.toString() || '',
        tags: task.tags || [],
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        role: 'dev',
        assigneeId: '',
        sprintId: '',
        estimate: '',
        tags: [],
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      assigneeId: formData.assigneeId ? parseInt(formData.assigneeId) : null,
      sprintId: formData.sprintId ? parseInt(formData.sprintId) : null,
      estimate: formData.estimate ? parseInt(formData.estimate) : null,
    };
    onSave(submitData);
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'inprogress', label: 'In Progress' },
    { value: 'inreview', label: 'In Review' },
    { value: 'done', label: 'Done' },
  ];

  const priorityOptions = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  const roleOptions = [
    { value: 'dev', label: 'Developer' },
    { value: 'tester', label: 'Tester' },
    { value: 'pm', label: 'Project Manager' },
  ];

  const assigneeOptions = teamMembers.map(member => ({
    value: member.Id.toString(),
    label: member.name,
  }));

  const sprintOptions = sprints.map(sprint => ({
    value: sprint.Id.toString(),
    label: sprint.name,
  }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            icon="X"
            className="text-slate-400 hover:text-slate-600"
          />
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            <Input
              label="Task Title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                title: e.target.value 
              }))}
              placeholder="Enter task title..."
              required
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  description: e.target.value 
                }))}
                placeholder="Enter task description..."
                rows={4}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  status: e.target.value 
                }))}
                options={statusOptions}
              />

              <Select
                label="Priority"
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  priority: e.target.value 
                }))}
                options={priorityOptions}
              />

              <Select
                label="Role"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  role: e.target.value 
                }))}
                options={roleOptions}
              />

              <Input
                label="Estimate (hours)"
                type="number"
                value={formData.estimate}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  estimate: e.target.value 
                }))}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Assignee"
                value={formData.assigneeId}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  assigneeId: e.target.value 
                }))}
                options={assigneeOptions}
                placeholder="Select assignee"
              />

              <Select
                label="Sprint"
                value={formData.sprintId}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  sprintId: e.target.value 
                }))}
                options={sprintOptions}
                placeholder="Select sprint"
              />
            </div>

            {/* Tags Section */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, index) => (
                  <Badge 
                    key={index}
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag}
                    <ApperIcon name="X" size={12} />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag(e)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddTag}
                  disabled={!newTag.trim()}
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Current Assignee Display */}
            {formData.assigneeId && (
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="text-sm font-medium text-slate-700 mb-2">
                  Current Assignee
                </h4>
                {(() => {
                  const assignee = teamMembers.find(m => 
                    m.Id.toString() === formData.assigneeId
                  );
                  return assignee ? (
                    <div className="flex items-center space-x-3">
                      <Avatar 
                        name={assignee.name} 
                        avatar={assignee.avatar}
                        size="md"
                      />
                      <div>
                        <p className="font-medium text-slate-800">
                          {assignee.name}
                        </p>
                        <p className="text-sm text-slate-600">
                          {assignee.role}
                        </p>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
            <div>
              {task && (
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => onDelete(task.Id)}
                  icon="Trash2"
                >
                  Delete Task
                </Button>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                icon="Save"
              >
                {task ? 'Update Task' : 'Create Task'}
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default TaskModal;