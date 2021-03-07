export const PresentingUI = superclass => class extends superclass {
  constructor({ presentingUI = false, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('PRESENTING_UI');
    this.presentingUI = presentingUI;
  }
};
