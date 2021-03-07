import { Tackle } from "../../Actions/Tackle";
import { ENERGY_THRESHOLD, PARTICLE_TEMPLATES } from '../../constants';
import { createFourDirectionMoveOptions } from '../helper';

const flyingLotus = (direction, stepCount, energyCost, additionalAttackDamage, engine) => {
  let actor = engine.actors[engine.currentActor];
  actor.setNextAction(new Tackle({
    direction,
    stepCount,
    game: engine.game,
    actor,
    additionalAttackDamage,
    energyCost,
    particleTemplate: PARTICLE_TEMPLATES.leaf
  }))
}

const keymapFlyingLotus = (engine, initiatedBy, previousKeymap) => {
  const energyCost = ENERGY_THRESHOLD;
  const stepCount = Math.floor(initiatedBy.energy / energyCost) - 1;
  const additionalAttackDamage = stepCount;
  const goToPreviousKeymap = () => initiatedBy.keymap = previousKeymap;
  return {
    Escape: {
      activate: goToPreviousKeymap,
      label: 'Close',
    },
    ...createFourDirectionMoveOptions(
      (direction, engine) => {
        flyingLotus(direction, stepCount, energyCost, additionalAttackDamage, engine);
        goToPreviousKeymap();
      },
      engine,
      'activate',
    ),
  };
}

export const activateFlyingLotus = (engine) => {
  let currentActor = engine.actors[engine.currentActor]
  currentActor.keymap = keymapFlyingLotus(engine, currentActor, { ...currentActor.keymap });
}