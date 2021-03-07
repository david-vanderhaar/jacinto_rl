import { Base } from './Base';
import { DestroySelf } from './DestroySelf';
import * as Constant from '../constants';

export class EngineCrank extends Base {
  constructor({ engine, ...args }) {
    super({ ...args });
    this.engine = engine;
  }
  async perform() {
    let success = true;
    let alternative = null;
    console.log(`${this.actor.name} is cranking its engine.`);
    try {
      await this.engine.start();
      this.actor.energy -= this.energyCost;
    }
    catch (error) {
      console.log('EngineCrank');
      console.log(error);
      alternative = new DestroySelf({
        game: this.game,
        actor: this.actor,
        energyCost: Constant.ENERGY_THRESHOLD,
      });
    }
    return {
      success,
      alternative,
    };
  }
}
;
