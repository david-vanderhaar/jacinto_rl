import * as Helper from '../../helper';

export const Acting = superclass => class extends superclass {
  constructor({ actions = [], speed = 100, energy = 0, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('ACTING');
    this.actions = actions;
    this.speed = speed;
    this.energy = speed;
    this.lastActionResult = null
  }

  getLastActionResult() {return this.lastActionResult}
  resetLastActionResult() {return this.lastActionResult = null}
  
  lastActionFailed() {
    const result = this.getLastActionResult()
    return result ? !result.success : false
  }

  lastActionSucceded () { return !this.lastActionFailed() }
  
  getAction() {
    let action = Helper.getRandomInArray(this.actions);
    if (action) {
      return action;
    }
  }
  gainEnergy(value = this.speed) {
    this.energy += value;
  }

  restoreFullEnergy() {
    this.energy = this.speed;
  }

  hasEnoughEnergy() {
    return this.energy > 0;
  }
};
