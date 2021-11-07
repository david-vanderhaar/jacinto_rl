import { Base } from './Base';

export class Move extends Base {
  constructor({ targetPos, processDelay = 25, ...args }) {
    super({ ...args });
    this.targetPos = targetPos;
    this.processDelay = processDelay;
  }
  perform() {
    let success = this.actor.move(this.targetPos);
    let alternative = null;
    return {
      success,
      alternative,
    };
  }
}
