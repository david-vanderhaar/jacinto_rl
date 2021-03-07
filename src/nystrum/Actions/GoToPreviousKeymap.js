import { Base } from './Base';
export class GoToPreviousKeymap extends Base {
  constructor({ ...args }) {
    super({ ...args });
    this.label = 'Close';
    this.processDelay = 0;
    this.energyCost = 0;
  }
  perform() {
    this.actor.goToPreviousKeymap();
    return {
      success: true,
      alternative: null,
    };
  }
}
;
