import { PlaceActor } from "../../Actions/PlaceActor";
import * as Item from '../../items';
import * as Constant from '../../constants';
import { UI_Actor } from '../../Entities/index';

import { moveCursor } from './moveCursor';
import { createEightDirectionMoveOptions } from '../helper';

// ------------ SAND TOMB ----------------------
const triggerSandTomb = (engine, actor) => {
  let cursor = engine.actors[engine.currentActor];
  // let cloud = Item.sandBurst({
  let cloud = Item.sandTomb({
    engine,
    actor,
    targetPos: { ...cursor.pos },
  });

  if (cloud) {
    actor.setNextAction(
      new PlaceActor({
        targetPos: { ...cursor.pos },
        entity: cloud,
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD * 4
        // energyCost: actor.energy
        // energyCost: Constant.ENERGY_THRESHOLD
      })
    )
  }
}

const keymapSandTomb = (engine, initiatedBy, previousKeymap) => {
  const goToPreviousKeymap = () => {
    let cursor = engine.actors[engine.currentActor];
    cursor.active = false;
    engine.game.removeActor(cursor);
  };
  return {
    Escape: {
      activate: goToPreviousKeymap,
      label: 'Close',
    },
    ...createEightDirectionMoveOptions(moveCursor, engine),
    k: {
      activate: () => {
        triggerSandTomb(engine, initiatedBy);
        goToPreviousKeymap();
      },
      label: 'activate'
    },
  };
}

export const sandTomb = (engine) => {
  let currentActor = engine.actors[engine.currentActor]
  let game = engine.game;
  let pos = currentActor.pos;

  let cursor = new UI_Actor({
    initiatedBy: currentActor,
    pos,
    renderer: {
      character: '█',
      color: 'white',
      background: '',
    },
    name: 'Cursor',
    game,
    keymap: keymapSandTomb(engine, currentActor, { ...currentActor.keymap }),
  })
  engine.addActorAsPrevious(cursor);
  game.placeActorOnMap(cursor)
  game.draw()
}