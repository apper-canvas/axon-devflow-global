import mockTasks from '@/services/mockData/tasks.json';

class TaskServiceClass {
  constructor() {
    this.tasks = [...mockTasks];
  }

  async getAll() {
    await this.delay(300);
    return [...this.tasks];
  }

  async getById(id) {
    await this.delay(200);
    const task = this.tasks.find(task => task.Id === id);
    if (!task) {
      throw new Error(`Task with Id ${id} not found`);
    }
    return { ...task };
  }

  async create(taskData) {
    await this.delay(400);
    const newTask = {
      ...taskData,
      Id: this.getNextId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, taskData) {
    await this.delay(350);
    const index = this.tasks.findIndex(task => task.Id === id);
    if (index === -1) {
      throw new Error(`Task with Id ${id} not found`);
    }
    
    const updatedTask = {
      ...this.tasks[index],
      ...taskData,
      Id: id,
      updatedAt: new Date().toISOString(),
    };
    
    this.tasks[index] = updatedTask;
    return { ...updatedTask };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.tasks.findIndex(task => task.Id === id);
    if (index === -1) {
      throw new Error(`Task with Id ${id} not found`);
    }
    
    this.tasks.splice(index, 1);
    return true;
  }

  getNextId() {
    const maxId = Math.max(...this.tasks.map(task => task.Id), 0);
    return maxId + 1;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const TaskService = new TaskServiceClass();