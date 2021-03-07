import { MESSAGE_TYPE } from '../message';
import { Base } from './Base';
import * as Helper from '../../helper';

export class EquipItemFromTile extends Base {
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
      // if (itemInSlot) {
      //   this.game.map[Helper.coordsToString(this.actor.pos)].entities.push(itemInSlot);
      // }
      if (itemInSlot) {
        this.game.addMessage(`${this.actor.name}\'s equipment slots are full.`, MESSAGE_TYPE.ERROR);
      }
      else {
        this.actor.equip(this.item.equipmentType, this.item);
        let entities = this.game.map[Helper.coordsToString(this.actor.pos)].entities;
        this.game.map[Helper.coordsToString(this.actor.pos)].entities = entities.filter((it) => it.id !== this.item.id);
        this.game.addMessage(`${this.actor.name} equips ${this.item.name}.`, MESSAGE_TYPE.ACTION);
        success = true;
        this.actor.energy -= this.energyCost;
      }
    }
    return {
      success,
      alternative,
    };
  }
}
;
