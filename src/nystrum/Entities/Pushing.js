import * as Constant from '../constants';
import * as Helper from '../../helper'; 
import { DestroySelf } from '../Actions/DestroySelf';
import { Shove } from '../Actions/Shove';

export const Pushing = superclass => class extends superclass {
  constructor({ path = false, targetPos = null, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('PUSHING');
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
    let direction = [
      targetPos.x - this.pos.x,
      targetPos.y - this.pos.y,
    ];
    if (direction[0] === 0 && direction[1] === 0) {
      return new DestroySelf({
        game: game,
        actor: this,
        energyCost: Constant.ENERGY_THRESHOLD,
        processDelay: 0,
      });
    }
    let result = new Shove({
      targetPos,
      direction,
      game,
      actor: this,
      energyCost: Constant.ENERGY_THRESHOLD
    });
    this.path.shift();
    return result;
  }
};
