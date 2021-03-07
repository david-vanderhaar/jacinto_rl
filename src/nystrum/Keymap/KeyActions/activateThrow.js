import { PlaceActor } from "../../Actions/PlaceActor";
import * as Constant from '../../constants';
import * as Item from '../../items';
import { createEightDirectionMoveOptions } from '../helper';

const throwDirectionalKunai = (direction, engine, actor) => {
  let kunai = actor.contains(Item.TYPE.DIRECTIONAL_KUNAI);
  if (kunai) {
    kunai.game = engine.game;
    kunai.pos = {
      x: actor.pos.x,
      y: actor.pos.y,
    };
    kunai.direction = direction;
    actor.removeFromContainer(kunai);
    actor.setNextAction(
      new PlaceActor({
        targetPos: { ...kunai.pos },
        entity: kunai,
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD
      })
    )

  } else {
    console.log('I have no kunais left');
  }
}

const keymapCursorToThrowItem = (engine, initiatedBy, initialKeymap) => {
  return {
    ...createEightDirectionMoveOptions(
      (direction, engine) => {
        throwDirectionalKunai(direction, engine, initiatedBy);
        initiatedBy.keymap = initialKeymap;
      },
      engine,
      'throw',
    )
  }
}

export const activateThrow = (engine) => {
  let game = engine.game;
  let currentActor = engine.actors[game.engine.currentActor]
  let initialKeymap = currentActor.keymap;
  currentActor.keymap = keymapCursorToThrowItem(engine, currentActor, initialKeymap);
}