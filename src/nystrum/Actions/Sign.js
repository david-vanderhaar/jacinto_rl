import { MESSAGE_TYPE } from '../message';
import { Base } from './Base';
export class Sign extends Base {
  constructor({ sign, ...args }) {
    super({ ...args });
    this.sign = sign;
  }
  perform() {
    this.game.addMessage(`${this.actor.name} threw a ${this.sign.name} sign.`, MESSAGE_TYPE.ACTION);
    this.actor.addSign(this.sign);
    this.actor.energy -= this.energyCost;
    return {
      success: true,
      alternative: null,
    };
  }
}
;
