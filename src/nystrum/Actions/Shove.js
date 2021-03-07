import { Base } from './Base';
import { Attack } from "./Attack";
import * as Constant from '../constants';

export class Shove extends Base {
  constructor({ targetPos, direction, ...args }) {
    super({ ...args });
    this.targetPos = targetPos;
    this.direction = direction;
  }
  perform() {
    let success = false;
    let alternative = null;
    let moveSuccess = this.actor.shove(this.targetPos, this.direction);
    if (moveSuccess) {
      this.actor.energy -= this.energyCost;
      success = true;
    }
    else {
      success = true;
      alternative = new Attack({
        targetPos: this.targetPos,
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
