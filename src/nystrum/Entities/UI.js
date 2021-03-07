export const UI = superclass => class extends superclass {
  constructor({ initiatedBy = null, range = null, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('UI');
    this.initiatedBy = initiatedBy;
    this.active = true;
    this.range = range;
  }
  hasEnoughEnergy() {
    return this.active;
  }
};
