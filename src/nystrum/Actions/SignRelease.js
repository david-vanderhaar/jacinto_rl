import { MESSAGE_TYPE } from '../message';
import { Base } from './Base';
export class SignRelease extends Base {
  constructor({ requiredSequence = [], ...args }) {
    super({ ...args });
    this.requiredSequence = requiredSequence;
  }
  requiredSequenceIsFulfilled() {
    let signHistory = this.actor.signHistory.concat();
    let relevantHistory = signHistory.slice(Math.max(signHistory.length - this.requiredSequence.length, 0));
    let result = JSON.stringify(relevantHistory) === JSON.stringify(this.requiredSequence);
    return result;
  }
  perform() {
    let success = false;
    if (this.requiredSequenceIsFulfilled()) {
      this.game.addMessage(`${this.actor.name} is releasing the power of ${this.requiredSequence.map((sign) => sign.type).join(' and ')}!`, MESSAGE_TYPE.ACTION);
      this.actor.energy -= this.energyCost;
      success = true;
      this.actor.clearSigns();
    }
    return {
      success,
      alternative: null,
    };
  }
}
;
