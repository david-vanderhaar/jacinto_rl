import { Base } from './Base';
import { Attack } from "./Attack";

export class MoveOrAttack extends Base {
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
      alternative = new Attack({
        targetPos: this.targetPos,
        game: this.game,
        actor: this.actor,
        energyCost: this.energyCost
      });
    }
    return {
      success,
      alternative,
    };
  }
}
;
