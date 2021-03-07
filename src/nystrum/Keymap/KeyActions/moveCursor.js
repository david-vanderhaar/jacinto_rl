import { CursorMove } from "../../Actions/CursorMove";

export const moveCursor = (direction, engine) => {
  let actor = engine.actors[engine.currentActor];
  let newX = actor.pos.x + direction[0];
  let newY = actor.pos.y + direction[1];
  actor.setNextAction(new CursorMove({
    targetPos: { x: newX, y: newY },
    game: engine.game,
    actor,
    energyCost: 0,
  }))
}