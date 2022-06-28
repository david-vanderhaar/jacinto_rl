import { SandSkin } from '../StatusEffects/SandSkin';
import { MeleeDamage } from '../StatusEffects/MeleeDamage';

export const CanActivateStatusEffects = superclass => class extends superclass {
  constructor({ availableStatusEffects = [], statusEffectRange = 2, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('CAN_ACTIVATE_STATUS_EFFECTS');
    this.statusEffectRange = statusEffectRange;
    this.statusEffectRangeMax = 10;
    this.availableStatusEffects = availableStatusEffects;
  }

  getAvailableStatusEffects () {
    return this.availableStatusEffects;
  }

  addAvailableStatusEffect (effectClass) {
    this.availableStatusEffects.push(effectClass)
  }
  
  getStatusEffectRange() { return this.statusEffectRange }

  decreaseStatusEffectRange(value) {
    this.statusEffectRange = Math.max(0, this.statusEffectRange - value);
  }

  increaseStatusEffectRange(value) {
    this.statusEffectRange = Math.min(this.statusEffectRangeMax, this.statusEffectRange + value);
  }
};
