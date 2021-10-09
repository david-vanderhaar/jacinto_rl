import * as Constant from '../../../constants';
import { Say } from '../../../Actions/Say';

export default class MoveTowardsCover {
  constructor({ actor = null }) {
    this.actor = actor;
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
