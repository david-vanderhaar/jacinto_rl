import { Base } from './Base';
import { SelfDestructiveAttack } from "./SelfDestructiveAttack";
import * as Constant from '../constants';

export class ProjectileMove extends Base {
  constructor({ targetPos, damageToSelf = 1, processDelay = 25, ...args }) {
    super({ ...args });
    this.targetPos = targetPos;
    this.processDelay = processDelay;
    this.damageToSelf = damageToSelf;
  }
  perform() {
    let success = false;
    let alternative = null;
    let moveSuccess = this.actor.move(this.targetPos);
    if (moveSuccess) {
      this.actor.energy -= this.energyCost;
      success = true;
    }
    else {
      success = true;
      alternative = new SelfDestructiveAttack({
        targetPos: this.targetPos,
        game: this.game,
        actor: this.actor,
        energyCost: Constant.ENERGY_THRESHOLD,
        damageToSelf: this.damageToSelf,
      });
    }
    return {
      success,
      alternative,
    };
  }
}
;
