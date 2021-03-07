import * as Constant from '../constants';
import * as Helper from '../../helper';
import { AddStatusEffect } from './AddStatusEffect';
import { SandSkin } from '../StatusEffects/SandSkin';

export class AddSandSkinStatusEffect extends AddStatusEffect {
  constructor({ defenseBuff, ...args }) {
    super({ ...args });
    this.processDelay = 25
    this.effect = new SandSkin({
      defenseBuff,
      game: this.game,
      actor: this.actor,
      lifespan: Constant.ENERGY_THRESHOLD * 10,
      stepInterval: Constant.ENERGY_THRESHOLD,
    });
    this.particleTemplate = {
      renderer: {
        character: '✦️',
        color: '#A89078',
        background: '#D8C0A8',
      }
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
