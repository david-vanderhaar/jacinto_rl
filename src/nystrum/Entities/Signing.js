export const Signing = superclass => class extends superclass {
  constructor({ ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('SIGNING');
    this.signHistory = [];
  }
  addSign(sign) {
    if (this.signHistory.length >= 4) {
      this.signHistory.shift();
    }
    this.signHistory.push(sign);
  }
  clearSigns() {
    this.signHistory = [];
  }
};
