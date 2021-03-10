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

  getRangedAttackChance(distanceToTarget) {
    const weaponAccuracy = this.getRangedWeaponAccuracy();
    // TODO: change the 10 to something more relevant or remove distance
    const result = this.baseRangedAccuracy + weaponAccuracy - (distanceToTarget / (this.getAttackRange() * 3));
    return result;
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
            accuracy += slot.item.getRangedAttackChance(0);
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

  rangedAttack(targetPos, additional = 0) {
    let success = false;
    let hit = false;
    let tile = this.game.map[Helper.coordsToString(targetPos)];
    if (!tile) {
      return [success, hit];
    }
    let targets = Helper.getDestructableEntities(tile.entities);
    if (targets.length > 0) {
      const distanceToTarget = Helper.calculatePath(this.game, targetPos, this.getPosition(), 8).length;
      hit = Math.random() < this.getRangedAttackChance(distanceToTarget);
      if (!hit) {
        success = true;
        return [success, hit];
      }
      let target = targets[0];
      if (this.canRangedAttack(target)) {
        let damage = this.getRangedAttackDamage(additional);
        this.game.addMessage(`${this.name} does ${damage} to ${target.name}`, MESSAGE_TYPE.DANGER);
        target.decreaseDurability(damage);
        success = true;
      }
    }
    return [success, hit];
  }
};
