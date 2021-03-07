import * as Constant from '../constants';
import { Shove } from '../Actions/Shove';
import { DestroySelf } from '../Actions/DestroySelf';

export const DirectionalPushing = superclass => class extends superclass {
  constructor({ path = false, direction = { x: 0, y: 0 }, range = 3, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('DIRECTIONAL_PUSHING');
    this.path = path;
    this.direction = direction;
    this.range = range;
  }
  getAction(game) {
    let result = null;
    let newX = this.pos.x + this.direction[0];
    let newY = this.pos.y + this.direction[1];
    let targetPos = { x: newX, y: newY };
    this.passable = false;
    if (this.range > 0) {
      result = new Shove({
        targetPos: targetPos,
        direction: this.direction,
        game: game,
        actor: this,
        energyCost: Constant.ENERGY_THRESHOLD,
        onSuccess: () => this.range -= 1,
      });
    }
    else {
      result = new DestroySelf({
        game: game,
        actor: this,
        energyCost: 0
      });
    }
    return result;
  }
};
