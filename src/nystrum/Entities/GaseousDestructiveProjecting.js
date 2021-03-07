import * as Constant from '../constants';
import * as Helper from '../../helper';
import { ThrowProjectileGas } from '../Actions/ThrowProjectileGas';

export const GaseousDestructiveProjecting = superclass => class extends superclass {
  constructor({ owner_id = null, path = false, targetPos = null, attackDamage = 1, range = 3, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('GASEOUS_DESTRUCTIVE_PROJECTING');
    this.path = path;
    this.targetPos = targetPos;
    this.attackDamage = attackDamage;
    this.range = range;
    this.owner_id = owner_id;
  }
  canAttack(entity) {
    let success = super.canAttack();
    if (success) {
      success = this.owner_id === null || (entity.owner_id !== this.owner_id);
    }
    return success;
  }
  createPath(game) {
    let path = Helper.calculatePathWithRange(game, this.targetPos, this.pos, 8, this.range);
    this.path = path;
  }
  getAction(game) {
    if (!this.path) {
      this.createPath(game);
    }
    let targetPos = this.path.length > 0 ? this.path[0] : this.pos;
    let result = new ThrowProjectileGas({
      targetPos,
      game,
      actor: this,
      energyCost: Constant.ENERGY_THRESHOLD
    });
    return result;
  }
};
