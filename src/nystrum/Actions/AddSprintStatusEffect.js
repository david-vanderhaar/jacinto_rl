import * as Constant from '../constants';
import * as Helper from '../../helper';
import { AddStatusEffect } from './AddStatusEffect';
import { Sprint } from '../StatusEffects/Sprint';

export class AddSprintStatusEffect extends AddStatusEffect {
  constructor({ buffValue = Constant.ENERGY_THRESHOLD, ...args }) {
    super({ ...args });
    this.processDelay = 25
    this.effect = new Sprint({
      buffValue,
      game: this.game,
      actor: this.actor,
      lifespan: Constant.ENERGY_THRESHOLD * 10,
      stepInterval: Constant.ENERGY_THRESHOLD,
    });
    this.particleTemplate = {
      renderer: {
        color: '#424242',
        background: '#e6e6e6',
        character: '〣'
      },
    };
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
};
