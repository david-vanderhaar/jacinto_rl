import { MESSAGE_TYPE } from '../message';
import { Base } from './Base';
export class Release extends Base {
  constructor({ chargeCost, ...args }) {
    super({ ...args });
    this.chargeCost = chargeCost;
  }
  perform() {
    let success = false;
    if (this.actor.charge >= this.chargeCost) {
      this.game.addMessage(`${this.actor.name} is releasing ${this.chargeCost} volts!`, MESSAGE_TYPE.ACTION);
      this.actor.energy -= this.energyCost;
      this.actor.decreaseCharge(this.chargeCost);
      success = true;
    }
    return {
      success,
      alternative: null,
    };
  }
}
;
