import mockSprints from '@/services/mockData/sprints.json';

class SprintServiceClass {
  constructor() {
    this.sprints = [...mockSprints];
  }

  async getAll() {
    await this.delay(300);
    return [...this.sprints];
  }

  async getById(id) {
    await this.delay(200);
    const sprint = this.sprints.find(sprint => sprint.Id === id);
    if (!sprint) {
      throw new Error(`Sprint with Id ${id} not found`);
    }
    return { ...sprint };
  }

  async create(sprintData) {
    await this.delay(400);
    const newSprint = {
      ...sprintData,
      Id: this.getNextId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.sprints.push(newSprint);
    return { ...newSprint };
  }

  async update(id, sprintData) {
    await this.delay(350);
    const index = this.sprints.findIndex(sprint => sprint.Id === id);
    if (index === -1) {
      throw new Error(`Sprint with Id ${id} not found`);
    }
    
    const updatedSprint = {
      ...this.sprints[index],
      ...sprintData,
      Id: id,
      updatedAt: new Date().toISOString(),
    };
    
    this.sprints[index] = updatedSprint;
    return { ...updatedSprint };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.sprints.findIndex(sprint => sprint.Id === id);
    if (index === -1) {
      throw new Error(`Sprint with Id ${id} not found`);
    }
    
    this.sprints.splice(index, 1);
    return true;
  }

  getNextId() {
    const maxId = Math.max(...this.sprints.map(sprint => sprint.Id), 0);
    return maxId + 1;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const SprintService = new SprintServiceClass();