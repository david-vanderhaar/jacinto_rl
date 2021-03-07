export const Playing = superclass => class extends superclass {
  constructor({ keymap = {}, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('PLAYING');
    this.nextAction = null;
    this.keymap = keymap;
  }
  setNextAction(action) {
    this.nextAction = action;
  }
  getAction() {
    let action = this.nextAction;
    this.nextAction = null;
    return action;
  }
};
