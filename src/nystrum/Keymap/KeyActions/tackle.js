import { MoveMultiple } from "../../Actions/MoveMultiple";
import { ENERGY_THRESHOLD } from '../../constants';

export const tackle = (direction, stepCount, engine) => {
  let actor = engine.actors[engine.currentActor];
  actor.setNextAction(new MoveMultiple({
    direction,
    stepCount,
    game: engine.game,
    actor,
    energyCost: ENERGY_THRESHOLD
  }));
};