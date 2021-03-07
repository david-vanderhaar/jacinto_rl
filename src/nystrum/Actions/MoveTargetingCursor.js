import { Base } from './Base';
import * as Helper from '../../helper';

export class MoveTargetingCursor extends Base {
  constructor({ direction, range, ...args }) {
    super({ ...args });
    this.direction = direction;
    this.range = range;
    this.processDelay = 0;
    this.energyCost = 0;
  }
  perform() {
    let success = false;
    let alternative = null;
    const initiatedFrom = this.actor.getPosition();
    const targetPos = Helper.getPositionInDirection(this.actor.getCursorPositions()[0], this.direction);
    const path = Helper.calculatePath(this.game, targetPos, initiatedFrom, 8);
    const isInRange = this.range ? path.length <= this.range : true;
    if (isInRange && this.game.canOccupyPosition(targetPos, this.actor)) {
      this.actor.moveCursorInDirection(this.direction);
      success = true;
    }
    return {
      success,
      alternative,
    };
  }
}
;
