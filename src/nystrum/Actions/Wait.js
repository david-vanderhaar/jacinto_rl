import { Base } from './Base';
export class Wait extends Base {
  constructor({processDelay = 0, ...args }) {
    super({ ...args });
    this.processDelay = processDelay;
  }
  perform() {
    this.actor.energy -= this.energyCost;
    return {
      success: true,
      alternative: null,
    };
  }
}
;
