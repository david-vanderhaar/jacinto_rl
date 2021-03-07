import { MoveSubstitution } from "../../Actions/MoveSubstitution";
import * as Constant from '../../constants';
import { UI_Actor, Wall } from '../../Entities/index';
import { moveCursor } from './moveCursor';
import { createFourDirectionMoveOptions } from '../helper';
import { TYPE } from '../../items';

const createSandWall = (engine, pos) => new Wall({
  game: engine.game,
  passable: false,
  pos: { x: pos.x, y: pos.y },
  renderer: {
    // character: '>',
    character: '✦️',
    color: '#A89078',
    background: '#D8C0A8',
  },
  name: TYPE.BARRIER,
  durability: 3,
})

const trigger = (engine, actor) => {
  let cursor = engine.actors[engine.currentActor];

  actor.setNextAction(
    new MoveSubstitution({
      targetPos: { ...cursor.pos },
      spawnedEntity: createSandWall(engine, { ...actor.pos }),
      game: engine.game,
      actor,
      energyCost: Constant.ENERGY_THRESHOLD,
    })
  )
}

const keymap = (engine, initiatedBy, previousKeymap) => {
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
    ...createFourDirectionMoveOptions(moveCursor, engine),
    r: {
      activate: () => {
        // make sure actor is burnable once targeting is complete or canceled
        trigger(engine, initiatedBy);
        goToPreviousKeymap();
      },
      label: 'activate'
    },
  };
}

export const teleport = (engine, range = 2) => {
  let currentActor = engine.actors[engine.currentActor]
  let game = engine.game;
  let pos = currentActor.pos;
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
    keymap: keymap(engine, currentActor, { ...currentActor.keymap }),
  })
  engine.addActorAsPrevious(cursor);
  game.placeActorOnMap(cursor)
  game.draw()
}