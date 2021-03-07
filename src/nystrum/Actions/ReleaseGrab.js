import SOUNDS from '../sounds';
import { Base } from './Base';
import * as Constant from '../constants';

export class ReleaseGrab extends Base {
  constructor({ ...args }) {
    super({ ...args });
  }
  perform() {
    let success = false;
    let alternative = null;
    const releasedEntity = this.actor.release();
    if (releasedEntity) {
      this.actor.energy -= this.energyCost;
      // add particles
      this.addParticle(2, { ...releasedEntity.pos }, { x: 0, y: 0 }, Constant.PARTICLE_TEMPLATES.succede.renderer);
      success = true;
      SOUNDS.release_0.play();
    }
    ;
    return {
      success,
      alternative,
    };
  }
}
;
