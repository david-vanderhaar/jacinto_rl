import { DIRECTIONS, ENERGY_THRESHOLD } from '../../constants';
import * as StatusEffect from '../../statusEffects';
import { MoveOrAttack } from "../../Actions/MoveOrAttack";
import { AddStatusEffect } from "../../Actions/AddStatusEffect";
import { walk } from './walk';
import { getRandomInArray } from '../../../helper';

const drunkWalk = (direction, engine) => {
  let actor = engine.actors[engine.currentActor];
  let originalDirection = [...direction];
  let chance = Math.random();
  if (chance < 0.5) {
    console.log('drunk misstep');
    let count = 100
    while ((direction[0] === originalDirection[0] && direction[1] === originalDirection[1]) || count < 0) {
      count -= 1;
      direction = DIRECTIONS[getRandomInArray(Object.keys(DIRECTIONS))];
    }
    console.log(count);
  }

  let newX = actor.pos.x + direction[0];
  let newY = actor.pos.y + direction[1];
  actor.setNextAction(new MoveOrAttack({
    targetPos: { x: newX, y: newY },
    game: engine.game,
    actor,
    energyCost: ENERGY_THRESHOLD
  }))
}

export const drunkenFist = (engine, damageBuff = 1) => {
  let currentActor = engine.actors[engine.currentActor];

  let effect = new StatusEffect.Base({
    game: engine.game,
    actor: currentActor,
    name: 'Drunk',
    lifespan: 1000,
    stepInterval: 100,
    allowDuplicates: false,
    renderer: {
      color: '#c45ffd',
      background: '#424242',
      character: '?'
    },
    onStart: () => {
      currentActor.attackDamage += damageBuff;
      currentActor.renderer.character = '?';
      console.log(`${currentActor.name} took a sip of sake.`);
      currentActor.keymap.w = {
        activate: () => drunkWalk(DIRECTIONS.N, engine),
        label: 'drunken walk'
      }
      currentActor.keymap.a = {
        activate: () => drunkWalk(DIRECTIONS.W, engine),
        label: 'drunken walk'
      }
      currentActor.keymap.s = {
        activate: () => drunkWalk(DIRECTIONS.S, engine),
        label: 'drunken walk'
      }
      currentActor.keymap.d = {
        activate: () => drunkWalk(DIRECTIONS.E, engine),
        label: 'drunken walk'
      }
    },
    onStop: () => {
      currentActor.attackDamage -= damageBuff;
      currentActor.renderer.character = 'R';
      console.log(`${currentActor.name} recovered from drunkeness.`);
      currentActor.keymap.w = {
        activate: () => walk(DIRECTIONS.N, engine),
        label: 'walk'
      }
      currentActor.keymap.a = {
        activate: () => walk(DIRECTIONS.W, engine),
        label: 'walk'
      }
      currentActor.keymap.s = {
        activate: () => walk(DIRECTIONS.S, engine),
        label: 'walk'
      }
      currentActor.keymap.d = {
        activate: () => walk(DIRECTIONS.E, engine),
        label: 'walk'
      }
    },
  });
  currentActor.setNextAction(new AddStatusEffect({
    effect,
    actor: currentActor,
    game: engine.game,
    processDelay: 100,
    particleTemplate: {
      renderer: {
        color: '#c45ffd',
        background: '#424242',
        character: '?'
      }
    },
  }));
}