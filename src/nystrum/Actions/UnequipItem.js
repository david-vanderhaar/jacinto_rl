import { MESSAGE_TYPE } from '../message';
import { Base } from './Base';
export class UnequipItem extends Base {
  constructor({ item, ...args }) {
    super({ ...args });
    this.item = item;
  }
  perform() {
    this.game.addMessage(`${this.actor.name} puts ${this.item.name} away.`, MESSAGE_TYPE.ACTION);
    this.actor.unequip(this.item);
    this.actor.addToContainer(this.item);
    this.actor.energy -= this.energyCost;
    return {
      success: true,
      alternative: null,
    };
  }
}
;
