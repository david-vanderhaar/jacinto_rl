import { MESSAGE_TYPE } from '../message';
import { Base } from './Base';
export class Reload extends Base {
  constructor({ message, messageType = MESSAGE_TYPE.INFORMATION, ...args }) {
    super({ ...args });
    this.processDelay = 0;
  }
  perform() {
    const success = this.actor.reload();
    this.game.addMessage(`${this.actor.name} says "RELOADING"`, MESSAGE_TYPE.INFORMATION);
    return {
      success,
      alternative: null,
    };
  }
}
;
