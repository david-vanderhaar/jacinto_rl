import { MESSAGE_TYPE } from '../message';
import { Base } from './Base';
import * as Helper from '../../helper';

export class DropItem extends Base {
  constructor({ item, ...args }) {
    super({ ...args });
    this.item = item;
  }
  perform() {
    this.game.addMessage(`${this.actor.name} drops ${this.item.name}.`, MESSAGE_TYPE.ACTION);
    const didDropItem = this.actor.removeFromContainer(this.item);
    if (!didDropItem) return {success: false, alternative: null}
    this.item.pos = this.actor.getPosition()
    this.game.map[Helper.coordsToString(this.actor.getPosition())].entities.push(this.item);
    return {
      success: true,
      alternative: null,
    };
  }
}
;
