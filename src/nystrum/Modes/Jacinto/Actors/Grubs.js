import * as Behaviors from '../../../Entities/AI/Behaviors';
import { COLORS } from '../theme';
import * as Helper from '../../../../helper';
import * as Constant from '../../../constants';
import {JacintoAI} from '../../../Entities/index';
import { ContainerSlot } from '../../../Entities/Containing';
import { Gnasher } from '../../../Items/Weapons/Gnasher';
import { HammerBurst } from '../../../Items/Weapons/HammerBurst';
import { Ammo } from '../../../Items/Pickups/Ammo';

export function addWretch (mode, pos) {
  addGrubToMapWithStats(mode, pos, GRUB_STATS.wretch())
}
export function addDrone (mode, pos) {
  addGrubToMapWithStats(mode, pos, GRUB_STATS.drone())
}
export function addHunter (mode, pos) {
  addGrubToMapWithStats(mode, pos, GRUB_STATS.hunter())
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
        new Behaviors.MoveTowardsEnemy({repeat: 5}),
        new Behaviors.TelegraphAttack({repeat: 1, attackPattern: Constant.CLONE_PATTERNS.clover}),
        new Behaviors.ExecuteAttack({repeat: 1}),
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
        new Behaviors.MoveTowardsEnemy({repeat: 5}),
        new Behaviors.TelegraphRangedAttack({repeat: 1}),
        new Behaviors.ExecuteAttack({repeat: 1}),
      ],
      loadout: {
        equipmentCreators: [Gnasher],
        inventoryCreators: [{amount: 100, creator: Ammo}]
      },
    }
  },
  hunter: () => {
    return {
      name: 'Hunter',
      renderer: {
        character: 'h',
        color: COLORS.flesh2,
        background: COLORS.flesh1,
        sprite: '',
      },
      durability: 3,
      attackDamage: 1,
      behaviors: [
        new Behaviors.MoveTowardsCover({repeat: 5}),
        new Behaviors.Wait({repeat: 1}),
        new Behaviors.TelegraphRangedAttack({repeat: 1}),
        new Behaviors.ExecuteAttack({repeat: 1}),
        new Behaviors.TelegraphRangedAttack({repeat: 1}),
        new Behaviors.ExecuteAttack({repeat: 1}),
      ],
      loadout: {
        equipmentCreators: [HammerBurst],
        inventoryCreators: [{amount: 100, creator: Ammo}]
      },
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
        new Behaviors.MoveTowardsEnemy({repeat: 5}),
        new Behaviors.TelegraphAttack({repeat: 1, attackPattern: Constant.CLONE_PATTERNS.clover}),
        new Behaviors.ExecuteAttack({repeat: 1}),
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
        new Behaviors.MoveTowardsEnemy({repeat: 5}),
        new Behaviors.TelegraphAttack({repeat: 1, attackPattern: Constant.CLONE_PATTERNS.clover}),
        new Behaviors.ExecuteAttack({repeat: 1}),
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
    equipment: Constant.EQUIPMENT_LAYOUTS.gear(),
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
  const createStats = Helper.getRandomInArray(
    Object
    .keys(GRUB_STATS)
    .filter((key) => key !== 'skorge')
    .map((key) => GRUB_STATS[key])
  )
  return createNewJacintoAIEntity({
    ...createBaseGrubStats(mode, pos),
    ...createStats(),
  });
}

function createGrubWithStats(mode, pos, stats) {
  return createNewJacintoAIEntity({
    ...createBaseGrubStats(mode, pos),
    ...stats,
  });
}

function createNewJacintoAIEntity(params) {
  const {loadout, ...entityParams} = params;
  const entity = new JacintoAI({...entityParams})

  if (loadout) equipAndFillInventory(entity, loadout)
  return entity;
}

function equipAndFillInventory(entity, loadout) {
  const {equipmentCreators, inventoryCreators} = loadout;
  const engine = entity.game.engine;
  const container = inventoryCreators.map(({amount, creator}) => createInventorySlot(engine, amount, creator));
  entity.container = container;

  equipmentCreators.forEach((creator) => {
    const equipmentPiece = creator(engine);
    entity.equip(equipmentPiece.equipmentType, equipmentPiece);
  })
}

function createInventorySlot (engine, amount, creator) {
  const item = Array(amount).fill('').map(() => creator(engine));
  return new ContainerSlot({
    itemType: item[0].name,
    items: item,
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
