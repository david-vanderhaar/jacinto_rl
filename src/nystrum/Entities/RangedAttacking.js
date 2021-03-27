import { MESSAGE_TYPE } from '../message';
import * as Helper from '../../helper';

export const RangedAttacking = superclass => class extends superclass {
  constructor({ attackRange = 0, baseRangedAccuracy = 0, baseRangedDamage = 0, magazineSize = 0, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('RANGED_ATTACKING');
    this.attackRange = attackRange;
    this.baseRangedAccuracy = baseRangedAccuracy;
    this.baseRangedDamage = baseRangedDamage;
    this.magazineSize = magazineSize;
    this.magazine = magazineSize;
  }

  getRangedAttackChance(targetPos = null) {
    const weaponAccuracy = this.getRangedWeaponAccuracy();
    const coverDebuff = targetPos ? this.getRangedAttackCoverDebuff(targetPos) : 0;
    const distanceDebuff = targetPos ? this.getRangedAttackDistanceDebuff(targetPos) : 0;
    const result = this.baseRangedAccuracy + weaponAccuracy + coverDebuff + distanceDebuff;
    return result;
  }

  getRangedAttackCoverDebuff(targetPos) {
    const path = Helper.calculateStraightPath(this.getPosition(), targetPos);
    const coverAccuracyModifer = path.reduce((acc, curr) => {
      let tile = this.game.map[Helper.coordsToString(curr)];
      if (['WALL'].includes(tile.type)) return acc - 1;
      let entitiesProvidingCover = Helper.filterEntitiesByType(tile.entities, 'COVERING');
      let coverModifer = 0;
      if (entitiesProvidingCover.length > 0) coverModifer = entitiesProvidingCover[0].accuracyModifer;
      return acc + coverModifer;
    }, 0);
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

  getEquipedWeapons() {
    if (this.entityTypes.includes('EQUIPING')) {
      return this.equipment.map((slot) => {
        if (slot.item) {
          if (slot.item.entityTypes.includes('RANGED_ATTACKING')) {
            return slot.item;
          }
        }
      });
    }
    return [];
  }

  useAmmo() {
    this.getEquipedWeapons().forEach((weapon) => weapon.magazine = Math.max(0, weapon.magazine - 1));
  }

  reload () {
    let reloaded = false;
    if (this.entityTypes.includes('CONTAINING')) {
      this.getEquipedWeapons().forEach((weapon) => {
        const amount = weapon.magazineSize - weapon.magazine;
        for (let i = 0; i < amount; i++) {
          let ammo = this.contains('Ammo');
          if (ammo) {
            this.removeFromContainer(ammo);
            weapon.magazine += 1;
            reloaded = true;
          }
        }
      });
    }
    return reloaded;
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
      hit = Math.random() < hitChance;
      // TODO: trigger hit and miss animations
      this.useAmmo();
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
