export const Pushable = superclass => class extends superclass {
  constructor({ pushable = true, ...args }) {
    super({ ...args });
    this.pushable = pushable;
    this.entityTypes = this.entityTypes.concat('PUSHABLE');
  }
};
