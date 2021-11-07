import * as Constant from '../constants';
import * as Helper from '../../helper';
import { MoveOrAttack } from '../Actions/MoveOrAttack';
import { Say } from '../Actions/Say';

export const Chasing = superclass => class extends superclass {
  constructor({ targetEntity = null, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('CHASING');
    this.targetEntity = targetEntity;
  }
  getAction(game) {
    if (this.targetEntity) {
      let path = Helper.calculatePath(game, this.targetEntity.pos, this.pos);
      let targetPos = path.length > 0 ? path[0] : this.pos;
      return new MoveOrAttack({
        targetPos,
        game,
        actor: this,
        energyCost: Constant.ENERGY_THRESHOLD
      });
    } else {
      return new Say({
        message: 'Where are they?',
        game,
        actor: this,
        energyCost: Constant.ENERGY_THRESHOLD
      });
    }
  }
};
