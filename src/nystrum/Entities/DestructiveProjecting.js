import * as Constant from '../constants';
import * as Helper from '../../helper';
import { ThrowProjectile } from '../Actions/ThrowProjectile';

export const DestructiveProjecting = superclass => class extends superclass {
  constructor({ path = false, targetPos = null, attackDamage = 1, range = 3, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('DESTRUCTIVE_PROJECTING');
    this.path = path;
    this.targetPos = targetPos;
    this.attackDamage = attackDamage;
    this.range = range;
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
    let result = new ThrowProjectile({
      targetPos,
      game,
      actor: this,
      energyCost: Constant.ENERGY_THRESHOLD
    });
    return result;
  }
};
