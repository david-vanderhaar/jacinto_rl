import * as Constant from '../../../constants';
import { Say } from '../../../Actions/Say';
import Behavior from './Behavior';

export default class TelegraphAttack extends Behavior {
  constructor({ ...args }) {
    super({ ...args });
  }

  getAction() {
    return new Say({
      message: 'I am telegraphing my next attack',
      game: this.actor.game,
      actor: this.actor,
      energyCost: Constant.ENERGY_THRESHOLD
    });
  }
}
