import { MESSAGE_TYPE } from '../message';
import { Base } from './Base';
import * as Helper from '../../helper';
import SOUNDS from '../sounds';

export class PickupAllItems extends Base {
  constructor({ ...args }) {
    super({ ...args });
  }
  perform() {
    let success = false;
    const items = this.game.map[Helper.coordsToString(this.actor.pos)].entities.filter((e) => e.id !== this.actor.id);
    if (items.length) {
      // const item = Helper.getRandomInArray(items);
      items.forEach((item) => {
        this.game.addMessage(`${this.actor.name} picks up ${item.name}.`, MESSAGE_TYPE.ACTION);
        this.actor.addToContainer(item);
        this.processPickupEffects(item, this.actor)
        let entities = this.game.map[Helper.coordsToString(this.actor.pos)].entities;
        this.game.map[Helper.coordsToString(this.actor.pos)].entities = entities.filter((it) => it.id !== item.id);
        success = true;
      });
      SOUNDS.grab_0.play();
    }
    return {
      success,
      alternative: null,
    };
  }

  processPickupEffects(item, actor) {
    item?.processPickupEffects && item?.processPickupEffects(actor)
  }
}
;
