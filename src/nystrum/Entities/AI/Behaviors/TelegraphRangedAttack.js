import * as Helper from '../../../../helper';
import { Say } from '../../../Actions/Say';
import {COLORS} from '../../../Modes/Jacinto/theme';
import MoveTowardsEnemy from './MoveTowardsEnemy';

export default class TelegraphRangedAttack extends MoveTowardsEnemy {
  constructor({ accuracyToAttackThreshold = 0, ...args }) {
    super({ ...args });
    this.accuracyToAttackThreshold = accuracyToAttackThreshold;
    this.chainOnSuccess = true;
  }

  isValid () {
    const attackRange = this.actor.getAttackRange();
    const enemy = this.findClosestEnemyInRange(attackRange) 
    if (!enemy) return false;
    
    const rangedAttackChance = this.actor.getRangedAttackChance(enemy.getPosition());
    if (rangedAttackChance < this.accuracyToAttackThreshold) return false;
    
    return true;
  }

  findClosestEnemyInRange(range) {
    let currentClosestEnemy = null;
    this.actor.getEnemies()
    .filter((enemy) => {
      const distanceToEnemy = this.getDistanceToTarget(enemy);
      return range >= distanceToEnemy;
    })
    .forEach((enemy) => {
      if (!currentClosestEnemy) currentClosestEnemy = enemy;
      const distanceToEnemy = this.getDistanceToTarget(enemy);
      const distanceToCurrentClosestEnemy = this.getDistanceToTarget(currentClosestEnemy);
      if (distanceToEnemy < distanceToCurrentClosestEnemy) {
        currentClosestEnemy = enemy;
      }
    });
    return currentClosestEnemy;
  }

  getDistanceToTarget(target) {
    const targetPos = target.getPosition()
    return Helper.calculatePath(this.actor.game, targetPos, this.actor.getPosition(), 8).length;
  }

  getTargetPosition () {
    return this.findClosestEnemy().getPosition();
  }

  getEquippedWeapon() {
    const equippedWeapons = this.actor.getEquipedWeapons();
    return equippedWeapons[0];
  }

  constructActionClassAndParams () {
    const equippedWeapon = this.getEquippedWeapon();
    const targetPosition = this.getTargetPosition();
    const positions = equippedWeapon.getPositionsInShape(targetPosition);
    const displayChanceText = true
    this.actor.activateCursor(positions, displayChanceText);
    this.actor.updateAllCursorNodes([
      {key: 'fill', value: COLORS.red}, 
      {key: 'stroke', value: 'transparent'}, 
    ]);
    return [
      Say,
      {
        message: 'I am telegraphing my next attack',
        processDelay: 500,
      }
    ]
  }
}
