export const HasStatusEffectRange = superclass => class extends superclass {
  constructor({ statusEffectRange = 1, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('HAS_STATUS_EFFECT_RANGE');
    this.statusEffectRange = statusEffectRange;
    this.statusEffectRangeMax = 10;
  }
  
  getStatusEffectRange() { return this.statusEffectRange }

  decreaseStatusEffectRange(value) {
    this.statusEffectRange = Math.max(0, this.statusEffectRange - value);
  }

  increaseStatusEffectRange(value) {
    this.statusEffectRange = Math.min(this.statusEffectRangeMax, this.statusEffectRange + value);
  }
};
