import { Move } from '../../../Actions/Move';
import Behavior from './Behavior';
import { calculatePathAroundObstacles } from '../../../../helper'; 

export default class MoveTowardsPlayer extends Behavior {
  constructor({maintainDistanceOf = 3, ...args }) {
    super({ ...args });
    this.maintainDistanceOf = maintainDistanceOf
  }

  isValid () {
    return !this.enemiesExist();
  }

  enemiesExist () {
    return this.actor.getEnemies().length > 0;
  }

  getDistanceToTarget (target) {
    return calculatePathAroundObstacles(this.actor.game, target.getPosition(), this.actor.getPosition(), 8).length;
  }

  constructActionClassAndParams () {
    let actionClass = null;
    let actionParams = null;

    // find player
    const player = this.actor.game.getFirstPlayer()
    if (!player) return [null, null]; 
    // get path to player
    let path = calculatePathAroundObstacles(this.actor.game, player.getPosition(), this.actor.getPosition());
    path = path.slice(0, -this.maintainDistanceOf)
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
