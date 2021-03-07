export const Draggable = superclass => class extends superclass {
  constructor({ draggable = true, ...args }) {
    super({ ...args });
    this.draggable = draggable;
    this.entityTypes = this.entityTypes.concat('DRAGGABLE');
  }
};
