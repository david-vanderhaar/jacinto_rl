import * as Constant from '../constants';
import * as Helper from '../../helper';
import { MoveOrAttack } from '../Actions/MoveOrAttack';

export const Projecting = superclass => class extends superclass {
  constructor({ path = false, targetPos = null, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('PROJECTING');
    this.path = path;
    this.targetPos = targetPos;
  }
  createPath(game) {
    let path = Helper.calculatePath(game, this.targetPos, this.pos, 8);
    this.path = path;
  }
  getAction(game) {
    if (!this.path) {
      this.createPath(game);
    }
    let targetPos = this.path.length > 0 ? this.path[0] : this.pos;
    let result = new MoveOrAttack({
      targetPos,
      game,
      actor: this,
      energyCost: Constant.ENERGY_THRESHOLD
    });
    if (this.game.canOccupyPosition(targetPos, this)) {
      this.path.shift();
    }
    return result;
  }
};
