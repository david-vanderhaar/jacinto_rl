import { MESSAGE_TYPE } from '../message';
import { Base } from './Base';
export class SayManyThings extends Base {
  constructor({ messages, processDelay = 50, ...args }) {
    super({ ...args });
    this.messages = messages;
    this.processDelay = processDelay;
  }
  perform() {
    let message = this.messages.shift();
    if (message) {
      this.game.addMessage(`${this.actor.name} says ${message}`, MESSAGE_TYPE.INFORMATION);
      this.actor.energy -= this.energyCost;
    }
    if (this.messages.length) {
      this.actor.setNextAction(this);
    }
    return {
      success: true,
      alternative: null,
    };
  }
}
;
