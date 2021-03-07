import { Shove } from "../../Actions/Shove";
import { ENERGY_THRESHOLD } from '../../constants';

export const push = (direction, engine) => {
  let actor = engine.actors[engine.currentActor];
  let newX = actor.pos.x + direction[0];
  let newY = actor.pos.y + direction[1];
  actor.setNextAction(new Shove({
    targetPos: { x: newX, y: newY },
    game: engine.game,
    actor,
    direction,
    energyCost: ENERGY_THRESHOLD,
    processDelay: 25,
  }))
}