import { MoveOrAttack } from './MoveOrAttack';
import { DestroySelf } from './DestroySelf';
import * as Constant from '../constants';

export class ThrowProjectile extends MoveOrAttack {
  constructor({ ...args }) {
    super({ ...args });
  }
  perform() {
    let success = false;
    let alternative = null;
    this.actor.passable = false;
    let move_result = super.perform();
    if (move_result.success) {
      this.actor.path.shift();
      success = true;
    }
    if (this.actor.path.length === 0) {
      success = true;
      alternative = new DestroySelf({
        game: this.game,
        actor: this.actor,
        energyCost: Constant.ENERGY_THRESHOLD,
        processDelay: 0,
      });
    }
    if (move_result.alternative) {
      let attackSuccess = this.actor.attack(this.targetPos);
      if (attackSuccess) {
        alternative = new DestroySelf({
          game: this.game,
          actor: this.actor,
          energyCost: Constant.ENERGY_THRESHOLD,
          processDelay: 0,
        });
      }
    }
    return {
      success,
      alternative,
    };
  }
}
