import { MESSAGE_TYPE } from '../message';
import { Base } from './Base';
import * as Helper from '../../helper';

export class PickupItem extends Base {
  constructor({ item, ...args }) {
    super({ ...args });
    this.item = item;
  }
  perform() {
    this.game.addMessage(`${this.actor.name} picks up ${this.item.name}.`, MESSAGE_TYPE.ACTION);
    this.actor.addToContainer(this.item);
    this.processPickupEffects(this.item, this.actor)
    let entities = this.game.map[Helper.coordsToString(this.actor.pos)].entities;
    this.game.map[Helper.coordsToString(this.actor.pos)].entities = entities.filter((it) => it.id !== this.item.id);
    return {
      success: true,
      alternative: null,
    };
  }

  processPickupEffects(item, actor) {
    item?.processPickupEffects && item?.processPickupEffects(actor)
  }
};
