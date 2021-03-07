import { MoveMultiple } from './MoveMultiple';
import { Attack } from './Attack';
import {ENERGY_THRESHOLD} from '../constants';

export class Tackle extends MoveMultiple {
  constructor({ direction, processDelay = 25, ...args }) {
    super({ ...args });
    this.direction = direction;
    this.stepCount = 0;
    this.processDelay = processDelay;
  }
  perform() {
    let alternative = null;
    let newX = this.actor.pos.x + this.direction[0];
    let newY = this.actor.pos.y + this.direction[1];
    let targetPos = { x: newX, y: newY };

    alternative = new Attack({
      targetPos,
      additionalDamage: this.stepCount,
      game: this.game,
      actor: this.actor,
      energyCost: 0,
    });

    if (this.actor.energy > ENERGY_THRESHOLD) {
      const shoveSuccess = this.actor.shove(targetPos, this.direction);
      if (shoveSuccess) {
        this.stepCount += 1;
        alternative = this
        for (let i = 0; i < 3; i++) {
          this.addParticle(1, {
            x: this.actor.pos.x - (this.direction[0] * i),
            y: this.actor.pos.y - (this.direction[1] * i),
          }, { x: 0, y: 0 });
        }
      }
    }

    return {
      success: true,
      alternative,
    };
  }
};
