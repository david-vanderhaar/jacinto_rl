import { destroyEntity } from './helper';
import * as Helper from '../../helper';

export const Destructable = superclass => class extends superclass {
  constructor({ durability = 1, defense = 0, onDestroy = () => null, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('DESTRUCTABLE');
    this.durability = durability;
    this.durabilityMax = durability;
    this.defense = defense;
    this.onDestroy = onDestroy;
    this.actorSprite = this.renderer.sprite
    this.actorCharacter = this.renderer.character
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
    this.updateActorRenderer();
    if (this.entityTypes.includes('PLAYING')) this.shakePlayer(value)
    if (this.durability <= 0) {
      this.destroy();
    }
  }
  shakePlayer(intensity) {
    const nodeKey = Helper.coordsToString(this.getPosition())
    const actorNode = this.game.tileMap[nodeKey]
    this.game.display.shakeNode({node: actorNode, intensity: intensity})
  }
  increaseDurability(value) {
    this.durability += value;
    this.updateActorRenderer();
  }
  updateActorRenderer() {
    if (this.durability === this.durabilityMax) {
      this.renderer.sprite = this.actorSprite;
      this.renderer.character = this.actorCharacter;
    } else {
      this.renderer.sprite = this.durability;
      this.renderer.character = this.durability;
    }
    this.game.draw();
  }
  destroy() {
    this.onDestroy(this);
    destroyEntity(this);
  }
};
