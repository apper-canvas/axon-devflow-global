import { toast } from 'react-toastify';

class TaskServiceClass {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "status" } },
          { field: { Name: "priority" } },
          { field: { Name: "role" } },
          { field: { Name: "estimate" } },
          { field: { Name: "Tags" } },
          { field: { Name: "assignee_id" } },
          { field: { Name: "sprint_id" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Map database fields to UI expected format
      return (response.data || []).map(task => ({
        ...task,
        assigneeId: task.assignee_id,
        sprintId: task.sprint_id,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
        tags: task.Tags ? task.Tags.split(',') : []
      }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "status" } },
          { field: { Name: "priority" } },
          { field: { Name: "role" } },
          { field: { Name: "estimate" } },
          { field: { Name: "Tags" } },
          { field: { Name: "assignee_id" } },
          { field: { Name: "sprint_id" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (!response.data) {
        return null;
      }

      // Map database fields to UI expected format
      const task = response.data;
      return {
        ...task,
        assigneeId: task.assignee_id,
        sprintId: task.sprint_id,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
        tags: task.Tags ? task.Tags.split(',') : []
      };
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      toast.error('Failed to load task');
      return null;
    }
  }

  async create(taskData) {
    try {
      // Map UI format to database fields and filter for Updateable fields only
      const dbTaskData = {
        Name: taskData.title || taskData.Name,
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        role: taskData.role,
        estimate: taskData.estimate,
        Tags: Array.isArray(taskData.tags) ? taskData.tags.join(',') : taskData.Tags,
        assignee_id: taskData.assigneeId || taskData.assignee_id,
        sprint_id: taskData.sprintId || taskData.sprint_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const params = {
        records: [dbTaskData]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const newTask = successfulRecords[0].data;
          return {
            ...newTask,
            assigneeId: newTask.assignee_id,
            sprintId: newTask.sprint_id,
            createdAt: newTask.created_at,
            updatedAt: newTask.updated_at,
            tags: newTask.Tags ? newTask.Tags.split(',') : []
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
      return null;
    }
  }

  async update(id, taskData) {
    try {
      // Map UI format to database fields and filter for Updateable fields only
      const dbTaskData = {
        Id: parseInt(id),
        Name: taskData.title || taskData.Name,
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        role: taskData.role,
        estimate: taskData.estimate,
        Tags: Array.isArray(taskData.tags) ? taskData.tags.join(',') : taskData.Tags,
        assignee_id: taskData.assigneeId || taskData.assignee_id,
        sprint_id: taskData.sprintId || taskData.sprint_id,
        updated_at: new Date().toISOString()
      };

      const params = {
        records: [dbTaskData]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedTask = successfulUpdates[0].data;
          return {
            ...updatedTask,
            assigneeId: updatedTask.assignee_id,
            sprintId: updatedTask.sprint_id,
            createdAt: updatedTask.created_at,
            updatedAt: updatedTask.updated_at,
            tags: updatedTask.Tags ? updatedTask.Tags.split(',') : []
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      return false;
    }
  }
}

export const TaskService = new TaskServiceClass();