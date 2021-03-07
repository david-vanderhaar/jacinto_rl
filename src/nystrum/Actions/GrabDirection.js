import SOUNDS from '../sounds';
import { Base } from './Base';
import * as Constant from '../constants';

export class GrabDirection extends Base {
  constructor({ targetPos, ...args }) {
    super({ ...args });
    this.targetPos = targetPos;
  }
  perform() {
    let success = false;
    let alternative = null;
    if (this.actor.grab(this.targetPos)) {
      this.actor.energy -= this.energyCost;
      success = true;
      // add particles
      this.addParticle(2, { ...this.targetPos }, { x: 0, y: 0 }, Constant.PARTICLE_TEMPLATES.succede.renderer);
      SOUNDS.grab_0.play();
    }
    return {
      success,
      alternative,
    };
  }
}
;
