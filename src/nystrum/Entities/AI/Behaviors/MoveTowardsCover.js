import * as Constant from '../../../constants';
import { Say } from '../../../Actions/Say';
import Behavior from './Behavior';

export default class MoveTowardsCover extends Behavior {
  constructor({ ...args }) {
    super({ ...args });
  }

  getAction() {
    return new Say({
      message: 'I am moving towards cover',
      game: this.actor.game,
      actor: this.actor,
      energyCost: Constant.ENERGY_THRESHOLD
    });
  }
}
