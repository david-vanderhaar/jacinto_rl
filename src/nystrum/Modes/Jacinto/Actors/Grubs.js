import * as Behaviors from '../../../Entities/AI/Behaviors';
import { COLORS } from '../theme';
import * as Helper from '../../../../helper';
import {CLONE_PATTERNS} from '../../../constants';
import {JacintoAI} from '../../../Entities/index';

export function addWretch (mode, pos) {
  addGrubToMapWithStats(mode, pos, GRUB_STATS.wretch())
}
export function addDrone (mode, pos) {
  addGrubToMapWithStats(mode, pos, GRUB_STATS.drone())
}
export function addScion (mode, pos) {
  addGrubToMapWithStats(mode, pos, GRUB_STATS.scion())
}
export function addSkorge (mode, pos) {
  addGrubToMapWithStats(mode, pos, GRUB_STATS.scion())
}
export function addRandomGrub (mode, pos) {
  addRandomBasicGrubToMap(mode, pos)
}

const GRUB_STATS = {
  wretch: () => {
    return {
      name: 'Wretch',
      renderer: {
        character: Helper.getRandomInArray(['w']),
        color: COLORS.flesh1,
        background: COLORS.flesh3,
        sprite: '',
      },
      durability: 1,
      attackDamage: 1,
      behaviors: [
        new Behaviors.MoveTowardsEnemy({actor: null, repeat: 5}),
        new Behaviors.TelegraphAttack({actor: null, repeat: 1, attackPattern: CLONE_PATTERNS.clover}),
        new Behaviors.ExecuteAttack({actor: null, repeat: 1}),
      ],
    }
  },
  drone: () => {
    return {
      name: 'Drone',
      renderer: {
        character: 'd',
        color: COLORS.flesh2,
        background: COLORS.flesh1,
        sprite: '',
      },
      durability: 3,
      attackDamage: 1,
      behaviors: [
        new Behaviors.MoveTowardsEnemy({actor: null, repeat: 5}),
        new Behaviors.TelegraphAttack({actor: null, repeat: 1, attackPattern: CLONE_PATTERNS.clover}),
        new Behaviors.ExecuteAttack({actor: null, repeat: 1}),
      ],
    }
  },
  scion: () => {
    return {
      name: 'Scion',
      renderer: {
        character: 'S',
        color: COLORS.flesh2,
        background: COLORS.flesh1,
        sprite: '',
      },
      durability: 10,
      attackDamage: 4,
      behaviors: [
        new Behaviors.MoveTowardsEnemy({actor: null, repeat: 5}),
        new Behaviors.TelegraphAttack({actor: null, repeat: 1, attackPattern: CLONE_PATTERNS.clover}),
        new Behaviors.ExecuteAttack({actor: null, repeat: 1}),
      ],
    }
  },
  skorge: () => {
    return {
      renderer: {
        sprite: '',
        character: 'S',
        color: COLORS.flesh1,
        background: COLORS.base04,
      },
      name: 'Skorge',
      durability: 40,
      attackDamage: 8,
      behaviors: [
        new Behaviors.MoveTowardsEnemy({actor: null, repeat: 5}),
        new Behaviors.TelegraphAttack({actor: null, repeat: 1, attackPattern: CLONE_PATTERNS.clover}),
        new Behaviors.ExecuteAttack({actor: null, repeat: 1}),
      ],
    }
  },
};

const createBaseGrubStats = (mode, pos) => {
  return {
    pos,
    game: mode.game,
    faction: 'LOCUST',
    enemyFactions: ['COG'],
    onDestroy: (actor) => {
      const chance = Math.random();
      if (chance <= 0.05) {
        mode.addAmmoLoot(actor.getPosition());
      } else if (chance <= 0.1) {
        mode.addGrenadeLoot(actor.getPosition());
      }
    },
  }
}

export function createRandomBasicGrub(mode, pos) {
  const stats = Helper.getRandomInArray(
    Object
    .keys(GRUB_STATS)
    .filter((key) => key !== 'skorge')
    .map((key) => GRUB_STATS[key])
  )
  return new JacintoAI({
    ...createBaseGrubStats(mode, pos),
    ...stats(),
  });
}

function createGrubWithStats(mode, pos, stats) {
  return new JacintoAI({
    ...createBaseGrubStats(mode, pos),
    ...stats,
  });
}

function addRandomBasicGrubToMap (mode, pos) {
  const entityCreator = () => createRandomBasicGrub(mode, pos)
  addEntityToMapWithStatsUsingCreator(mode, entityCreator)
}

function addGrubToMapWithStats (mode, pos, stats) {
  const entityCreator = () => createGrubWithStats(mode, pos, stats)
  addEntityToMapWithStatsUsingCreator(mode, entityCreator)
}

function addEntityToMapWithStatsUsingCreator (mode, entityCreator) {
  const entity = entityCreator();
  if (mode.game.placeActorOnMap(entity)) {
    mode.game.engine.addActor(entity);
  };
}
