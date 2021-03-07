import { Attack } from "../../Actions/Attack";
import { getDirectionKey, DIRECTIONS, ENERGY_THRESHOLD, THEMES } from '../../constants';


const keyMapChop = (engine, initiatedBy, previousKeymap, animations) => {
  let actor = engine.actors[engine.currentActor];
  const goToPreviousKeymap = () => {
    initiatedBy.keymap = previousKeymap;
    // animation code
    if (animations.length) {
      animations.forEach((animation) => engine.game.display.removeAnimation(animation.id))
    }
    // end
  }
  return {
    Escape: {
      activate: goToPreviousKeymap,
      label: 'Cancel Chop',
    },
    w: {
      activate: () => {
        let targetPos = {
            x: actor.pos.x + DIRECTIONS.N[0], //[0, -1]
            y: actor.pos.y + DIRECTIONS.N[1]
        }
        actor.setNextAction( new Attack({
            targetPos: targetPos,
            game: engine.game,
            actor: actor,
        }))
        goToPreviousKeymap();
      },
      label: 'activate N',
    },
    d: {
      activate: () => {
        let targetPos = {
            x: actor.pos.x + DIRECTIONS.E[0],
            y: actor.pos.y + DIRECTIONS.E[1]
        }
        actor.setNextAction( new Attack({
            targetPos: targetPos,
            game: engine.game,
            actor: actor,
        }))
        goToPreviousKeymap();
      },
      label: 'activate E',
    },
    s: {
      activate: () => {
        let targetPos = {
            x: actor.pos.x + DIRECTIONS.S[0],
            y: actor.pos.y + DIRECTIONS.S[1]
        }
        actor.setNextAction( new Attack({
            targetPos: targetPos,
            game: engine.game,
            actor: actor,
        }))
        goToPreviousKeymap();
      },
      label: 'activate S',
    },
    a: {
      activate: () => {
        let targetPos = {
            x: actor.pos.x + DIRECTIONS.W[0],
            y: actor.pos.y + DIRECTIONS.W[1]
        }
        actor.setNextAction( new Attack({
            targetPos: targetPos,
            game: engine.game,
            actor: actor,
        }))
        goToPreviousKeymap();
      },
      label: 'activate W',
    },
  };
}

export const chop = (engine) => {
  let currentActor = engine.actors[engine.currentActor]

  // animation code: could be abstrated for easier use
  const directions = [
    DIRECTIONS.N,
    DIRECTIONS.E,
    DIRECTIONS.S,
    DIRECTIONS.W,
  ];

  let animations = [];

  directions.forEach((direction) => {
    let pos = {
      x: currentActor.pos.x + direction[0],
      y: currentActor.pos.y + direction[1],
    }
    const animation = engine.game.display.addAnimation(1, { x: pos.x, y: pos.y, color: THEMES.SOLARIZED.base3 })
    animations.push(animation);
  })
  // end

  currentActor.keymap = keyMapChop(engine, currentActor, { ...currentActor.keymap }, animations);
}