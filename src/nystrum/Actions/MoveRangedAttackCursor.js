import * as _ from 'lodash';
import { Base } from './Base';
import * as Helper from '../../helper';
import {THEMES} from '../constants';

export class MoveRangedAttackCursor extends Base {
  constructor({ direction, range, targetPos = null, availablePositions = [], ...args }) {
    super({ ...args });
    this.direction = direction;
    this.range = range;
    this.targetPos = targetPos;
    this.availablePositions = availablePositions;
    this.processDelay = 0;
    this.energyCost = 0;
  }

  isInRange (targetPos) {
    return _.find(this.availablePositions, {x: targetPos.x, y: targetPos.y});
  }

  isInRangeV1 (targetPos) {
    const initiatedFrom = this.actor.getPosition();
    const path = Helper.calculateStraightPath(initiatedFrom, targetPos);
    return this.range ? path.length <= this.range : true;
  }

  perform() {
    let success = false;
    let alternative = null;
    if (!this.targetPos && !this.direction) {
      return {success, alternative}
    }
    let targetPos = this.targetPos;
    if (!this.targetPos) {
      targetPos = Helper.getPositionInDirection(this.actor.getCursorPositions()[0], this.direction);
    }
    // const pathIsNotBlocked = path.reduce((acc, curr) => acc && this.game.rangedCursorCanOccupyPosition(curr), true);
    // if (this.isInRange(targetPos) && pathIsNotBlocked && this.game.rangedCursorCanOccupyPosition(targetPos, this.actor)) {
    // if (this.isInRange(targetPos) && this.game.rangedCursorCanOccupyPosition(targetPos, this.actor)) {
    if (this.isInRange(targetPos)) {
      this.actor.moveCursorToPosition(targetPos);
      success = true;
    }
    return {
      success,
      alternative,
    };
  }
}
