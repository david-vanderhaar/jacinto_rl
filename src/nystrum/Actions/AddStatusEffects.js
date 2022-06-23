import { Base } from './Base';
import * as Helper from '../../helper'

export class AddStatusEffects extends Base {
  constructor({ effects, processDelay = 25, ...args }) {
    super({ ...args });
    this.effects = effects;
    this.processDelay = processDelay;
  }

  addParticleAnimationAt({pos}) {
    let positions = Helper.getPointsOnCircumference(pos.x, pos.y, 4);
    positions.forEach((pos) => {
      this.addParticle(3, { ...pos }, {
        x: -1 * Math.sign(pos.x - pos.x),
        y: -1 * Math.sign(pos.y - pos.y)
      });
    });
  }

  perform() {
    let success = false;
    this.effects.forEach((effect) => {
      const effectSuccess = this.game.engine.addStatusEffect(effect);
      success = effectSuccess || success;
      if (effectSuccess) this.addParticleAnimationAt({pos: effect.actor.getPosition()});
    });

    return {
      success,
      alternative: null,
    };
  }
}
;
