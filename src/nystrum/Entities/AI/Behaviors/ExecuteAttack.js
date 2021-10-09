import * as Constant from '../../../constants';
import { Say } from '../../../Actions/Say';
import Behavior from './Behavior';

export default class ExecuteAttack extends Behavior {
  constructor({ ...args }) {
    super({ ...args });
  }

  getAction() {
    return new Say({
      message: 'I am executing attack',
      game: this.actor.game,
      actor: this.actor,
      energyCost: Constant.ENERGY_THRESHOLD
    });
  }
}
