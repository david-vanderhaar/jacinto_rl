import * as StatusEffect from '../../statusEffects';
import { AddStatusEffect } from "../../Actions/AddStatusEffect";

export const removeWeights = (engine, speedBoost = 600, damageDebuff = 1) => {
  let currentActor = engine.actors[engine.currentActor];

  let effect = new StatusEffect.Base({
    game: engine.game,
    actor: currentActor,
    name: 'Removed wraps (weights)',
    lifespan: 1000,
    stepInterval: 100,
    allowDuplicates: false,
    renderer: {
      color: '#424242',
      background: '#e6e6e6',
      character: '〣'
    },
    onStart: () => {
      currentActor.speed += speedBoost;
      currentActor.attackDamage = Math.max(0, currentActor.attackDamage - damageDebuff);
      currentActor.energy += speedBoost;
      currentActor.renderer.character = '〣'
      console.log(`${currentActor.name} removed weighted wraps.`);
    },
    onStop: () => {
      currentActor.speed -= speedBoost;
      currentActor.attackDamage += damageDebuff;
      currentActor.renderer.character = 'R'
      console.log(`${currentActor.name} rewrapped weights.`);
    },
  });
  currentActor.setNextAction(new AddStatusEffect({
    effect,
    actor: currentActor,
    game: engine.game,
    particleTemplate: {
      renderer: {
        color: '#424242',
        background: '#e6e6e6',
        character: '〣'
      }
    }
  }));
}