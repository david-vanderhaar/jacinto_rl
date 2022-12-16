import { MESSAGE_TYPE } from '../message';
import { Base } from './Base';
import * as Helper from '../../helper';

export class DropItem extends Base {
  constructor({ item = null, itemName = null, targetPos = null, ...args }) {
    super({ ...args });
    this.item = item;
    this.itemName = itemName;
    this.targetPos = targetPos;
  }

  getitem() {
    if (this.item) return this.item
    if (this.itemName) return this.actor.contains(this.itemName)
    return null
  }

  newItemPosition() {
    return this.targetPos || this.actor.getPosition()
  }

  perform() {
    const item = this.getitem()
    this.game.addMessage(`${this.actor.name} drops ${item.name}.`, MESSAGE_TYPE.ACTION);
    const didDropItem = this.actor.removeFromContainer(item);
    if (!didDropItem) return {success: false, alternative: null}
    const newItemPosition = this.newItemPosition()
    item.pos = newItemPosition
    this.game.map[Helper.coordsToString(newItemPosition)].entities.push(item);
    return {
      success: true,
      alternative: null,
    };
  }
}
;
