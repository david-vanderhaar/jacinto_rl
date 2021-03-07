import { Release } from "../../Actions/Release";
import { Charge } from "../../Actions/Charge";
import { ENERGY_THRESHOLD } from '../../constants';

export const charge = (engine, chargeAmount) => {
  let actor = engine.actors[engine.currentActor];
  actor.setNextAction(new Charge({
    chargeAmount,
    game: engine.game,
    actor,
    energyCost: ENERGY_THRESHOLD
  }));
};

export const release = (engine, chargeCost) => {
  let actor = engine.actors[engine.currentActor];
  actor.setNextAction(new Release({
    chargeCost,
    game: engine.game,
    actor,
    energyCost: ENERGY_THRESHOLD
  }));
};