import * as Helper from '../../helper';

export const Acting = superclass => class extends superclass {
  constructor({ actions = [], speed = 100, energy = 0, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('ACTING');
    this.actions = actions;
    this.speed = speed;
    this.energy = speed;
  }
  getAction() {
    let action = Helper.getRandomInArray(this.actions);
    if (action) {
      return action;
    }
  }
  gainEnergy(value = this.speed) {
    this.energy += value;
  }
  hasEnoughEnergy() {
    return this.energy > 0;
  }
};
