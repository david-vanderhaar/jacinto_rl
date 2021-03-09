import { Base } from './Base';
import * as Helper from '../../helper';
import {THEMES} from '../constants';

export class MoveRangedAttackCursor extends Base {
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
    const path = Helper.calculateStraightPath(initiatedFrom, targetPos);
    const isInRange = this.range ? path.length <= this.range : true;
    const pathIsNotBlocked = path.reduce((acc, curr) => acc && this.game.rangedCursorCanOccupyPosition(curr));
    if (isInRange && pathIsNotBlocked && this.game.rangedCursorCanOccupyPosition(targetPos, this.actor)) {
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
