import mockTeamMembers from '@/services/mockData/teamMembers.json';

class TeamMemberServiceClass {
  constructor() {
    this.teamMembers = [...mockTeamMembers];
  }

  async getAll() {
    await this.delay(300);
    return [...this.teamMembers];
  }

  async getById(id) {
    await this.delay(200);
    const member = this.teamMembers.find(member => member.Id === id);
    if (!member) {
      throw new Error(`Team member with Id ${id} not found`);
    }
    return { ...member };
  }

  async create(memberData) {
    await this.delay(400);
    const newMember = {
      ...memberData,
      Id: this.getNextId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.teamMembers.push(newMember);
    return { ...newMember };
  }

  async update(id, memberData) {
    await this.delay(350);
    const index = this.teamMembers.findIndex(member => member.Id === id);
    if (index === -1) {
      throw new Error(`Team member with Id ${id} not found`);
    }
    
    const updatedMember = {
      ...this.teamMembers[index],
      ...memberData,
      Id: id,
      updatedAt: new Date().toISOString(),
    };
    
    this.teamMembers[index] = updatedMember;
    return { ...updatedMember };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.teamMembers.findIndex(member => member.Id === id);
    if (index === -1) {
      throw new Error(`Team member with Id ${id} not found`);
    }
    
    this.teamMembers.splice(index, 1);
    return true;
  }

  getNextId() {
    const maxId = Math.max(...this.teamMembers.map(member => member.Id), 0);
    return maxId + 1;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const TeamMemberService = new TeamMemberServiceClass();