import { toast } from 'react-toastify';

class SprintServiceClass {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'sprint';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "start_date" } },
          { field: { Name: "end_date" } },
          { field: { Name: "status" } },
          { field: { Name: "team_id" } },
          { field: { Name: "goals" } },
          { field: { Name: "Tags" } },
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
      return (response.data || []).map(sprint => ({
        ...sprint,
        name: sprint.Name,
        startDate: sprint.start_date,
        endDate: sprint.end_date,
        teamId: sprint.team_id,
        createdAt: sprint.created_at,
        updatedAt: sprint.updated_at
      }));
    } catch (error) {
      console.error('Error fetching sprints:', error);
      toast.error('Failed to load sprints');
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "start_date" } },
          { field: { Name: "end_date" } },
          { field: { Name: "status" } },
          { field: { Name: "team_id" } },
          { field: { Name: "goals" } },
          { field: { Name: "Tags" } },
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
      const sprint = response.data;
      return {
        ...sprint,
        name: sprint.Name,
        startDate: sprint.start_date,
        endDate: sprint.end_date,
        teamId: sprint.team_id,
        createdAt: sprint.created_at,
        updatedAt: sprint.updated_at
      };
    } catch (error) {
      console.error(`Error fetching sprint with ID ${id}:`, error);
      toast.error('Failed to load sprint');
      return null;
    }
  }

  async create(sprintData) {
    try {
      // Map UI format to database fields and filter for Updateable fields only
      const dbSprintData = {
        Name: sprintData.name || sprintData.Name,
        start_date: sprintData.startDate || sprintData.start_date,
        end_date: sprintData.endDate || sprintData.end_date,
        status: sprintData.status,
        team_id: sprintData.teamId || sprintData.team_id,
        goals: sprintData.goals,
        Tags: sprintData.Tags || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const params = {
        records: [dbSprintData]
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
          const newSprint = successfulRecords[0].data;
          return {
            ...newSprint,
            name: newSprint.Name,
            startDate: newSprint.start_date,
            endDate: newSprint.end_date,
            teamId: newSprint.team_id,
            createdAt: newSprint.created_at,
            updatedAt: newSprint.updated_at
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error creating sprint:', error);
      toast.error('Failed to create sprint');
      return null;
    }
  }

  async update(id, sprintData) {
    try {
      // Map UI format to database fields and filter for Updateable fields only
      const dbSprintData = {
        Id: parseInt(id),
        Name: sprintData.name || sprintData.Name,
        start_date: sprintData.startDate || sprintData.start_date,
        end_date: sprintData.endDate || sprintData.end_date,
        status: sprintData.status,
        team_id: sprintData.teamId || sprintData.team_id,
        goals: sprintData.goals,
        Tags: sprintData.Tags || '',
        updated_at: new Date().toISOString()
      };

      const params = {
        records: [dbSprintData]
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
          const updatedSprint = successfulUpdates[0].data;
          return {
            ...updatedSprint,
            name: updatedSprint.Name,
            startDate: updatedSprint.start_date,
            endDate: updatedSprint.end_date,
            teamId: updatedSprint.team_id,
            createdAt: updatedSprint.created_at,
            updatedAt: updatedSprint.updated_at
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error updating sprint:', error);
      toast.error('Failed to update sprint');
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
      console.error('Error deleting sprint:', error);
      toast.error('Failed to delete sprint');
      return false;
    }
  }
}

export const SprintService = new SprintServiceClass();