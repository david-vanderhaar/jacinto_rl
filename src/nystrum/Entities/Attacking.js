import { MESSAGE_TYPE } from '../message';
import * as Helper from '../../helper';

export const Attacking = superclass => class extends superclass {
  constructor({ attackDamage = 1, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('ATTACKING');
    this.attackDamage = attackDamage;
  }
  getAttackDamage(additional = 0) {

    return this.attackDamage + additional;
  }
  canAttack(entity) {
    return true;
  }
  attack(targetPos, additional = 0) {
    let success = false;
    let tile = this.game.map[Helper.coordsToString(targetPos)];
    if (!tile) {
      return success;
    }
    let targets = Helper.getDestructableEntities(tile.entities);
    if (targets.length > 0) {
      let target = targets[0];
      console.log(target);
      if (this.canAttack(target)) {
        let damage = this.getAttackDamage(additional);
        if (this.entityTypes.includes('EQUIPING')) {
          this.equipment.forEach((slot) => {
            if (slot.item) {
              if (slot.item.entityTypes.includes('ATTACKING')) {
                damage += slot.item.getAttackDamage();
              }
            }
          });
        }
        this.game.addMessage(`${this.name} does ${damage} to ${target.name}`, MESSAGE_TYPE.DANGER);
        console.log('attackDamage ', this.attackDamage);
        console.log('additionalDamage ', additional);
        console.log('damage ', damage);
        target.decreaseDurability(damage);
        success = true;
      }
    }
    return success;
  }
};
