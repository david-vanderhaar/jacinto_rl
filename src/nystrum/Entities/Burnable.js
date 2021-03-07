export const Burnable = superclass => class extends superclass {
  constructor({ ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('BURNABLE');
    this.canBurn = true;
    this.willResetCanBurn = false;
  }
  resetCanBurn() {
    this.willResetCanBurn = false;
    this.canBurn = true;
  }
  burn() {
    if (this.canBurn) {
      this.decreaseDurability(2);
      return true;
    }
    return false;
  }
};
