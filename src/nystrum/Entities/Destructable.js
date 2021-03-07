import { destroyEntity } from './helper';
export const Destructable = superclass => class extends superclass {
  constructor({ durability = 1, defense = 0, onDestroy = () => null, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('DESTRUCTABLE');
    this.durability = durability;
    this.defense = defense;
    this.onDestroy = onDestroy;
  }
  getDefense() {
    let defense = this.defense;
    // add in reducer to get defense stats of all equpiment
    if (this.entityTypes.includes('EQUIPING')) {
      this.equipment.forEach((slot) => {
        if (slot.item) {
          if (slot.item.entityTypes.includes('DESTRUCTABLE')) {
            defense += slot.item.getDefense();
          }
        }
      });
    }
    return defense;
  }
  decreaseDurabilityWithoutDefense(value) {
    this.durability -= value;
    if (this.durability <= 0) {
      this.destroy();
    }
  }
  decreaseDurability(value) {
    const current = this.durability;
    const newDurability = current - (value - this.getDefense());
    this.durability = Math.min(current, newDurability);
    this.renderer.character = this.durability;
    this.game.draw();
    if (this.durability <= 0) {
      this.destroy();
    }
  }
  increaseDurability(value) {
    this.durability += value;
  }
  destroy() {
    this.onDestroy();
    destroyEntity(this);
  }
};
