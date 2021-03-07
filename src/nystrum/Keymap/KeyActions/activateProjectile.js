import { SprayWater } from "../../Actions/SprayWater";
import * as Constant from '../../constants';
import { UI_Actor } from '../../Entities/index';
import { moveCursor } from './moveCursor';
import { createFourDirectionMoveOptions } from '../helper';

const trigger = (engine, actor, radius = 1) => {
  let cursor = engine.actors[engine.currentActor];

  actor.setNextAction(
    // new Action.Say({
    //   game: engine.game,
    //   actor,
    //   message: 'I\'ll crush you!',
    //   energyCost: Constant.ENERGY_THRESHOLD
    // })
    new SprayWater({
      targetPos: { ...cursor.pos },
      radius,
      game: engine.game,
      actor,
      energyCost: Constant.ENERGY_THRESHOLD
    })
  )
}

const keymap = (engine, initiatedBy, previousKeymap, radius) => {
  const goToPreviousKeymap = () => {
    let cursor = engine.actors[engine.currentActor];
    cursor.active = false;
    engine.game.removeActor(cursor);
    // make sure actor is burnable once targeting is complete or canceled
    initiatedBy['willResetCanBurn'] = true;
    
  };
  return {
    Escape: {
      activate: goToPreviousKeymap,
      label: 'Close',
    },
    ...createFourDirectionMoveOptions(moveCursor, engine),
    t: {
      activate: () => {
        // make sure actor is burnable once targeting is complete or canceled
        initiatedBy['canBurn'] = true;
        trigger(engine, initiatedBy, radius);
        goToPreviousKeymap();
      },
      label: 'activate'
    },
  };
}

export const activateProjectile = (engine, radius, range = 2) => {
  let currentActor = engine.actors[engine.currentActor]
  let game = engine.game;
  let pos = currentActor.pos;
  // prevent player from being burned while on fire.
  currentActor['canBurn'] = false;

  let cursor = new UI_Actor({
    initiatedBy: currentActor,
    range,
    pos,
    renderer: {
      character: '█',
      color: 'white',
      background: '',
    },
    name: 'Cursor',
    game,
    keymap: keymap(engine, currentActor, { ...currentActor.keymap }, radius),
  })
  engine.addActorAsPrevious(cursor);
  game.placeActorOnMap(cursor)
  game.draw()
}