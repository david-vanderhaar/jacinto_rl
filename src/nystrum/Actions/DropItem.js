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
    if (!item) return {success: false, alternative: null}

    const newItemPosition = this.newItemPosition()
    const tile = this.game.map[Helper.coordsToString(newItemPosition)]
    if (!tile) return {success: false, alternative: null}

    const didDropItem = this.actor.removeFromContainer(item);
    if (!didDropItem) return {success: false, alternative: null}

    item.pos = newItemPosition
    tile.entities.push(item);

    this.game.addMessage(`${this.actor.name} drops ${item.name}.`, MESSAGE_TYPE.ACTION);
    return {
      success: true,
      alternative: null,
    };
  }
}
;
