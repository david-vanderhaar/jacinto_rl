export const Covering = superclass => class extends superclass {
  constructor({ accuracyModifer = 0, damageModifer = 0, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('COVERING');
    this.providesCover = true;
    this.accuracyModifer = accuracyModifer;
    this.damageModifer = damageModifer;
  }
};
