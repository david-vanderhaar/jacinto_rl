import { Base } from './Base';
import * as Helper from '../../helper'

export class AddStatusEffect extends Base {
  constructor({ effect, processDelay = 25, ...args }) {
    super({ ...args });
    this.effect = effect;
    this.processDelay = processDelay;
  }
  perform() {
    let success = this.game.engine.addStatusEffect(this.effect);
    let positions = Helper.getPointsOnCircumference(this.actor.pos.x, this.actor.pos.y, 4);
    positions.forEach((pos) => {
      this.addParticle(3, { ...pos }, {
        x: -1 * Math.sign(pos.x - this.actor.pos.x),
        y: -1 * Math.sign(pos.y - this.actor.pos.y)
      });
    });
    return {
      success,
      alternative: null,
    };
  }
}
;
