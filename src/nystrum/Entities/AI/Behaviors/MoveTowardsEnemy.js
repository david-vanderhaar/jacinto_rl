import { Move } from '../../../Actions/Move';
import Behavior from './Behavior';
import { calculatePathAroundObstacles } from '../../../../helper'; 

export default class MoveTowardsEnemy extends Behavior {
  constructor({ ...args }) {
    super({ ...args });
  }

  isValid () {
    return true;
  }

  getDistanceToTarget (target) {
    return calculatePathAroundObstacles(this.actor.game, target.getPosition(), this.actor.getPosition(), 8).length;
  }

  findClosestEnemy() {
    let currentClosestEnemy = null;
    this.actor.getEnemies().forEach((enemy) => {
      if (!currentClosestEnemy) currentClosestEnemy = enemy;
      const distanceToEnemy = this.getDistanceToTarget(enemy);
      const distanceToCurrentClosestEnemy = this.getDistanceToTarget(currentClosestEnemy);
      if (distanceToEnemy < distanceToCurrentClosestEnemy) {
        currentClosestEnemy = enemy;
      }
    });
    return currentClosestEnemy;
  }

  constructActionClassAndParams () {
    let actionClass = null;
    let actionParams = null;

    // find closest enemy
    const enemy = this.findClosestEnemy();
    if (!enemy) return [null, null]; 
    // get path to enemy
    let path = calculatePathAroundObstacles(this.actor.game, enemy.getPosition(), this.actor.getPosition());
    let moveToPosition = path.length > 0 ? path[0] : null;
    if (!moveToPosition) return [null, null]

    actionClass = Move; 
    actionParams = {
      hidden: true,
      targetPos: moveToPosition,
      onFailure: () => this.interrupt(),
    }

    return [actionClass, actionParams];
  }
}
