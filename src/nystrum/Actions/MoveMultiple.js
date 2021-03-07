import { Base } from './Base';
import { Attack } from "./Attack";
import * as Constant from '../constants';

export class MoveMultiple extends Base {
  constructor({ direction, stepCount, processDelay = 25, ...args }) {
    super({ ...args });
    this.direction = direction;
    this.stepCount = stepCount;
    this.processDelay = processDelay;
  }
  perform() {
    let success = false;
    let alternative = null;
    let newX = this.actor.pos.x + this.direction[0];
    let newY = this.actor.pos.y + this.direction[1];
    let targetPos = { x: newX, y: newY };
    if (this.stepCount > 0 && this.actor.move(targetPos)) {
      this.stepCount -= 1;
      this.actor.setNextAction(this);
      success = true;
    }
    else {
      success = true;
      alternative = new Attack({
        targetPos: targetPos,
        game: this.game,
        actor: this.actor,
        energyCost: Constant.ENERGY_THRESHOLD
      });
    }
    return {
      success,
      alternative,
    };
  }
}
;
