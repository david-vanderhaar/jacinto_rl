import { MESSAGE_TYPE } from '../message';
import * as Helper from '../../helper';
import { result } from 'lodash';

export const RangedAttacking = superclass => class extends superclass {
  constructor({ attackRange = 0, baseRangedAccuracy = 0, baseRangedDamage = 0, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('RANGED_ATTACKING');
    this.attackRange = attackRange;
    this.baseRangedAccuracy = baseRangedAccuracy;
    this.baseRangedDamage = baseRangedDamage;
  }

  getRangedAttackChance(targetPos = null) {
    const weaponAccuracy = this.getRangedWeaponAccuracy();
    const coverDebuff = targetPos ? this.getRangedAttackCoverDebuff(targetPos) : 0;
    const distanceDebuff = targetPos ? this.getRangedAttackDistanceDebuff(targetPos) : 0;
    console.log('weaponAccuracy ', weaponAccuracy)
    console.log('coverDebuff ', coverDebuff)
    console.log('distanceDebuff ', distanceDebuff)
    console.log('this.baseRangedAccuracy ', this.baseRangedAccuracy)
    const result = this.baseRangedAccuracy + weaponAccuracy + coverDebuff + distanceDebuff;
    console.log(result);
    return result;
  }

  getRangedAttackCoverDebuff(targetPos) {
    const path = Helper.calculateStraightPath(this.getPosition(), targetPos);
    const coverAccuracyModifer = path.reduce((acc, curr) => {
      let tile = this.game.map[Helper.coordsToString(curr)];
      let entitiesProvidingCover = Helper.filterEntitiesByType(tile.entities, 'COVERING');
      let coverModifer = 0;
      if (entitiesProvidingCover.length > 0) coverModifer = entitiesProvidingCover[0].accuracyModifer;
      return acc + coverModifer;
    }, 0);
    console.log('coverAccuracyModifer ', coverAccuracyModifer);
    return coverAccuracyModifer;
  }

  getRangedAttackDistanceDebuff(targetPos) {
    const distanceToTarget = Helper.calculatePath(this.game, targetPos, this.getPosition(), 8).length;
    return -1 * (distanceToTarget / (this.getAttackRange() * 3))
  }

  getAttackRange() {
    let range = this.attackRange;
    if (this.entityTypes.includes('EQUIPING')) {
      this.equipment.forEach((slot) => {
        if (slot.item) {
          if (slot.item.entityTypes.includes('RANGED_ATTACKING')) {
            range += slot.item.attackRange;
          }
        }
      });
    }
    return range;
  }

  getRangedWeaponAccuracy() {
    let accuracy = 0;
    if (this.entityTypes.includes('EQUIPING')) {
      this.equipment.forEach((slot) => {
        if (slot.item) {
          if (slot.item.entityTypes.includes('RANGED_ATTACKING')) {
            accuracy += slot.item.getRangedAttackChance();
          }
        }
      });
    }
    return accuracy;
  }

  getRangedAttackDamage(additional = 0) {

    return this.baseRangedDamage + this.getRangedWeaponDamage() + additional;
  }

  getRangedWeaponDamage() {
    let damage = 0;
    if (this.entityTypes.includes('EQUIPING')) {
      this.equipment.forEach((slot) => {
        if (slot.item) {
          if (slot.item.entityTypes.includes('RANGED_ATTACKING')) {
            damage += slot.item.getRangedAttackDamage();
          }
        }
      });
    }
    return damage;
  }

  canRangedAttack(entity) {
    return true;
  }

  rangedAttack(targetPos, additionalDamage = 0, additionalAccuracy = 0) {
    let success = false;
    let hit = false;
    let tile = this.game.map[Helper.coordsToString(targetPos)];
    if (!tile) {
      return [success, hit];
    }
    let targets = Helper.getDestructableEntities(tile.entities);
    if (targets.length > 0) {
      const attackChance = this.getRangedAttackChance(targetPos);
      const hitChance = attackChance + additionalAccuracy;
      console.log('attackChance ', attackChance);
      console.log('additionalAccuracy ', additionalAccuracy);
      console.log('hitChance ', hitChance);
      hit = Math.random() < hitChance;
      console.log('hit ', hit);
      if (!hit) {
        success = true;
        return [success, hit];
      }
      let target = targets[0];
      if (this.canRangedAttack(target)) {
        let damage = this.getRangedAttackDamage(additionalDamage);
        this.game.addMessage(`${this.name} does ${damage} to ${target.name}`, MESSAGE_TYPE.DANGER);
        target.decreaseDurability(damage);
        success = true;
      }
    }
    return [success, hit];
  }
};
