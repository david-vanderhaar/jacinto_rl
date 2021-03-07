import { SignRelease } from "../../Actions/SignRelease";
import { Sign } from "../../Actions/Sign";
import { ENERGY_THRESHOLD, HAND_SIGNS } from '../../constants';

/******************** PLAYER ********************/
export const sign = (sign, engine) => {
  let actor = engine.actors[engine.currentActor];
  actor.setNextAction(new Sign({
    sign,
    game: engine.game,
    actor,
    energyCost: ENERGY_THRESHOLD
  }));
};

export const signRelease = (engine) => {
  let actor = engine.actors[engine.currentActor];
  actor.setNextAction(new SignRelease({
    requiredSequence: [
      HAND_SIGNS.Power,
      HAND_SIGNS.Healing,
    ],
    game: engine.game,
    actor,
    energyCost: ENERGY_THRESHOLD
  }));
};