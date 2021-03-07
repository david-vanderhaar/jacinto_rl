import { Say } from "../../Actions/Say";
import { sandWallPulse } from '../../items';
import { DIRECTIONS, ENERGY_THRESHOLD } from '../../constants';

const triggerSandPulse = (direction, actor, engine) => {
  let cloud = sandWallPulse({
    engine,
    actor,
    throwDirection: {
      x: direction[0],
      y: direction[1],
    },
    targetPos: {
      x: actor.pos.x + (direction[0] * 10),
      y: actor.pos.y + (direction[1] * 10),
    },
  });

  if (cloud) {
    engine.addActorAsPrevious(cloud);
    actor.setNextAction(
      new Say({
        game: engine.game,
        actor,
        message: 'Away from me!',
        energyCost: ENERGY_THRESHOLD
      })
      // new PlaceActor({
      //   targetPos: {
      //     x: actor.pos.x + direction[0],
      //     y: actor.pos.y + direction[1],
      //   },
      //   entity: cloud,
      //   game: engine.game,
      //   actor,
      //   energyCost: ENERGY_THRESHOLD
      // })
    )
  }
}

const keymapSandPulse = (engine, initiatedBy, previousKeymap) => {
  const goToPreviousKeymap = () => initiatedBy.keymap = previousKeymap;
  return {
    Escape: {
      activate: goToPreviousKeymap,
      label: 'Close',
    },
    w: {
      activate: () => {
        triggerSandPulse(DIRECTIONS.N, initiatedBy, engine);
        goToPreviousKeymap();
      },
      label: 'activate N',
    },
    d: {
      activate: () => {
        triggerSandPulse(DIRECTIONS.E, initiatedBy, engine);
        goToPreviousKeymap();
      },
      label: 'activate E',
    },
    s: {
      activate: () => {
        triggerSandPulse(DIRECTIONS.S, initiatedBy, engine);
        goToPreviousKeymap();
      },
      label: 'activate S',
    },
    a: {
      activate: () => {
        triggerSandPulse(DIRECTIONS.W, initiatedBy, engine);
        goToPreviousKeymap();
      },
      label: 'activate W',
    },
  };
}

export const sandPulse = (engine) => {
  let currentActor = engine.actors[engine.currentActor]
  currentActor.keymap = keymapSandPulse(engine, currentActor, { ...currentActor.keymap });
}