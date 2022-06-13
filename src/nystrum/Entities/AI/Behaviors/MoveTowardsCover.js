import { Move } from '../../../Actions/Move';
import Behavior from './Behavior';
import { calculatePathAroundObstacles } from '../../../../helper'; 

export default class MoveTowardsCover extends Behavior {
  constructor({ ...args }) {
    super({ ...args });

    this.targetCover = null;
  }

  isValid() {
    return this.enemiesExist() && !this.actor.isCovered();
  }

  enemiesExist () {
    return this.actor.getEnemies().length > 0;
  }

  getDistanceToTarget (target) {
    return calculatePathAroundObstacles(this.actor.game, target.getPosition(), this.actor.getPosition(), 8).length;
  }

  findClosestCover() {
    let currentClosest = null;
    const cover = this.actor.getCoverEntities()
    cover.forEach((entity) => {
      if (!currentClosest) currentClosest = entity;
      const distanceTo = this.getDistanceToTarget(entity);
      const distanceToCurrentClosest = this.getDistanceToTarget(currentClosest);
      if (distanceTo < distanceToCurrentClosest) {
        currentClosest = entity;
      }
    });
    return currentClosest;
  }

  constructActionClassAndParams () {
    let actionClass = null;
    let actionParams = null;

    let cover = null;
    let moveToPosition = this.actor.getPosition();

    // find closest cover
    if (!this.targetCover) {
      cover = this.findClosestCover();
    } else {
      cover = this.targetCover
    }

    if (!cover) return [actionClass, actionParams]; 

    // get path to cover
    let path = calculatePathAroundObstacles(this.actor.game, cover.getPosition(), this.actor.getPosition());
    moveToPosition = path.length > 0 ? path[0] : null;

    actionClass = Move; 
    actionParams = {
      hidden: true,
      targetPos: moveToPosition,
    }

    return [actionClass, actionParams];
  }
  // constructActionClassAndParams () {
  //   let actionClass = Say;
  //   let actionParams = {message: 'grrr'};

  //   if (this.actor.isCovered()) return [actionClass, actionParams];

  //   let cover = null;
  //   let moveToPosition = this.actor.getPosition();

  //   // find closest cover
  //   if (!this.targetCover) {
  //     cover = this.findClosestCover();
  //   } else {
  //     cover = this.targetCover
  //   }

  //   if (!cover) return [actionClass, actionParams]; 

  //   // get path to cover
  //   let path = calculatePathAroundObstacles(this.actor.game, cover.getPosition(), this.actor.getPosition());
  //   moveToPosition = path.length > 0 ? path[0] : null;

  //   actionClass = Move; 
  //   actionParams = {
  //     hidden: true,
  //     targetPos: moveToPosition,
  //   }

  //   return [actionClass, actionParams];
  // }
}
