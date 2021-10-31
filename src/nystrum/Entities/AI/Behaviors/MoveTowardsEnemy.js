import { Move } from '../../../Actions/Move';
import Behavior from './Behavior';
import { calculatePath } from '../../../../helper'; 

export default class MoveTowardsEnemy extends Behavior {
  constructor({ ...args }) {
    super({ ...args });
  }

  isValid () {
    return true;
  }

  getDistanceToTarget (target) {
    return calculatePath(this.actor.game, target.getPosition(), this.actor.getPosition(), 8).length;
  }

  findClosestEnemy() {
    let closest = null;
    this.actor.getEnemies().forEach((enemy) => {
      if (!closest) closest = enemy;
      if (this.getDistanceToTarget(enemy) < this.getDistanceToTarget(closest)) {
        closest = enemy;
      }
    });
    return closest;
  }

  constructActionClassAndParams () {
    let actionClass = null;
    let actionParams = null;

    // find closest enemy
    const enemy = this.findClosestEnemy();
    if (!enemy) return [null, null]; 
    // get path to enemy
    let path = calculatePath(this.actor.game, enemy.getPosition(), this.actor.getPosition());
    let moveToPosition = path.length > 0 ? path[0] : null;
    if (!moveToPosition) return [null, null]

    actionClass = Move; 
    actionParams = {
      hidden: true,
      targetPos: moveToPosition,
    }

    return [actionClass, actionParams];
  }
}
