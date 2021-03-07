import { Base } from './Base';
import { Attack } from "./Attack";

export class Move extends Base {
  constructor({ targetPos, processDelay = 25, ...args }) {
    super({ ...args });
    this.targetPos = targetPos;
    this.processDelay = processDelay;
  }
  perform() {
    let success = false;
    let alternative = null;
    let moveSuccess = this.actor.move(this.targetPos);
    if (moveSuccess) {
      success = true;
    } else {
      success = true;
      alternative = new Attack({
        targetPos: this.targetPos,
        game: this.game,
        actor: this.actor,
        energyCost: 0
      });
    }
    return {
      success,
      alternative,
    };
  }
}
;
