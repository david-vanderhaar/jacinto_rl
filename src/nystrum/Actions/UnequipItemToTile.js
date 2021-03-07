import { MESSAGE_TYPE } from '../message';
import { Base } from './Base';
import * as Helper from '../../helper';

export class UnequipItemToTile extends Base {
  constructor({ item, ...args }) {
    super({ ...args });
    this.item = item;
  }
  perform() {
    this.game.addMessage(`${this.actor.name} drops ${this.item.name}.`, MESSAGE_TYPE.ACTION);
    this.actor.unequip(this.item);
    this.game.map[Helper.coordsToString(this.actor.pos)].entities.splice(0, 0, this.item);
    return {
      success: true,
      alternative: null,
    };
  }
}
;
