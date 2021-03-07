import { Base } from './Base';
export class DestroySelf extends Base {
  constructor({ processDelay = 0, ...args }) {
    super({ ...args });
    this.processDelay = processDelay;
  }
  perform() {
    // console.log(`${this.actor.name} is self-destructing`);
    this.actor.energy -= this.energyCost;
    this.actor.destroy();
    return {
      success: true,
      alternative: null,
    };
  }
}
;
