import { MESSAGE_TYPE } from '../message';
import { Base } from './Base';
export class Charge extends Base {
  constructor({ chargeAmount, ...args }) {
    super({ ...args });
    this.chargeAmount = chargeAmount;
  }
  perform() {
    this.game.addMessage(`${this.actor.name} is charging up!`, MESSAGE_TYPE.ACTION);
    this.actor.energy -= this.energyCost;
    this.actor.increaseCharge(this.chargeAmount);
    return {
      success: true,
      alternative: null,
    };
  }
}
;
