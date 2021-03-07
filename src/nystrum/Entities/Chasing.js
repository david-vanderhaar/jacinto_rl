import * as Constant from '../constants';
import * as Helper from '../../helper';
import { Move } from '../Actions/Move';

export const Chasing = superclass => class extends superclass {
  constructor({ targetEntity = null, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('CHASING');
    this.targetEntity = targetEntity;
  }
  getAction(game) {
    let path = Helper.calculatePath(game, this.targetEntity.pos, this.pos);
    let targetPos = path.length > 0 ? path[0] : this.pos;
    let result = new Move({
      targetPos,
      game,
      actor: this,
      energyCost: Constant.ENERGY_THRESHOLD
    });
    return result;
  }
};
