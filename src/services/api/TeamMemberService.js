import { toast } from 'react-toastify';

class TeamMemberServiceClass {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'team_member';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "role" } },
          { field: { Name: "avatar" } },
          { field: { Name: "capacity" } },
          { field: { Name: "email" } },
          { field: { Name: "skills" } },
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
      return (response.data || []).map(member => ({
        ...member,
        name: member.Name,
        createdAt: member.created_at,
        updatedAt: member.updated_at,
        skills: member.skills ? member.skills.split(',') : []
      }));
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Failed to load team members');
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "role" } },
          { field: { Name: "avatar" } },
          { field: { Name: "capacity" } },
          { field: { Name: "email" } },
          { field: { Name: "skills" } },
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
      const member = response.data;
      return {
        ...member,
        name: member.Name,
        createdAt: member.created_at,
        updatedAt: member.updated_at,
        skills: member.skills ? member.skills.split(',') : []
      };
    } catch (error) {
      console.error(`Error fetching team member with ID ${id}:`, error);
      toast.error('Failed to load team member');
      return null;
    }
  }

  async create(memberData) {
    try {
      // Map UI format to database fields and filter for Updateable fields only
      const dbMemberData = {
        Name: memberData.name || memberData.Name,
        role: memberData.role,
        avatar: memberData.avatar,
        capacity: memberData.capacity,
        email: memberData.email,
        skills: Array.isArray(memberData.skills) ? memberData.skills.join(',') : memberData.skills,
        Tags: memberData.Tags || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const params = {
        records: [dbMemberData]
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
          const newMember = successfulRecords[0].data;
          return {
            ...newMember,
            name: newMember.Name,
            createdAt: newMember.created_at,
            updatedAt: newMember.updated_at,
            skills: newMember.skills ? newMember.skills.split(',') : []
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error creating team member:', error);
      toast.error('Failed to create team member');
      return null;
    }
  }

  async update(id, memberData) {
    try {
      // Map UI format to database fields and filter for Updateable fields only
      const dbMemberData = {
        Id: parseInt(id),
        Name: memberData.name || memberData.Name,
        role: memberData.role,
        avatar: memberData.avatar,
        capacity: memberData.capacity,
        email: memberData.email,
        skills: Array.isArray(memberData.skills) ? memberData.skills.join(',') : memberData.skills,
        Tags: memberData.Tags || '',
        updated_at: new Date().toISOString()
      };

      const params = {
        records: [dbMemberData]
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
          const updatedMember = successfulUpdates[0].data;
          return {
            ...updatedMember,
            name: updatedMember.Name,
            createdAt: updatedMember.created_at,
            updatedAt: updatedMember.updated_at,
            skills: updatedMember.skills ? updatedMember.skills.split(',') : []
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error updating team member:', error);
      toast.error('Failed to update team member');
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
      console.error('Error deleting team member:', error);
      toast.error('Failed to delete team member');
      return false;
    }
  }
}

export const TeamMemberService = new TeamMemberServiceClass();