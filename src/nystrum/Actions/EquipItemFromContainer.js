import { MESSAGE_TYPE } from '../message';
import { Base } from './Base';
export class EquipItemFromContainer extends Base {
  // entities can only equip items from their container/inventory
  constructor({ item, ...args }) {
    super({ ...args });
    this.item = item;
  }
  perform() {
    let success = false;
    let alternative = null;
    if (this.item.equipmentType) {
      let itemInSlot = this.actor.getItemInSlot(this.item.equipmentType);
      if (itemInSlot) {
        this.actor.addToContainer(itemInSlot);
        this.actor.unequip(itemInSlot);
      }
      this.actor.removeFromContainer(this.item);
      this.actor.equip(this.item.equipmentType, this.item);
      this.game.addMessage(`${this.actor.name} equips ${this.item.name}.`, MESSAGE_TYPE.ACTION);
      success = true;
    }
    return {
      success,
      alternative,
    };
  }
}
;
