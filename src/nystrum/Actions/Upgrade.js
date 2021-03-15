import * as Helper from '../../helper';
import { Base } from './Base';
import SOUNDS from '../sounds';

export class Upgrade extends Base {
  constructor({ upgrade, ...args }) {
    super({ ...args });
    this.upgrade = upgrade;
    this.particleTemplate = {
      renderer: {
        sprite: '',
        character: '^',
        color: 'white',
        background: '#3e7dc9',
      }
    };
  }
  perform() {
    let success = false;
    if (this.actor.upgrade(this.upgrade)) {
      success = true;
      let positions = Helper.getPointsOnCircumference(this.actor.pos.x, this.actor.pos.y, 5);
      positions.forEach((pos) => {
        this.addParticle(4, { ...pos }, {
          x: -1 * Math.sign(pos.x - this.actor.pos.x),
          y: -1 * Math.sign(pos.y - this.actor.pos.y)
        });
      });
      SOUNDS.save.play();
    }
    return {
      success,
      alternative: null,
    };
  }
}
;
