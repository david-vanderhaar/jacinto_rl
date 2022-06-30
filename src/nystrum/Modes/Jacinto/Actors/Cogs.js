import * as Behaviors from '../../../Entities/AI/Behaviors';
import { COLORS } from '../theme';
import * as Constant from '../../../constants';
import {JacintoAI, EmergenceHole} from '../../../Entities/index';
import { ContainerSlot } from '../../../Entities/Containing';
import { Lancer } from '../../../Items/Weapons/Lancer';
import { Ammo } from '../../../Items/Pickups/Ammo';

export const addBasicCog = (mode, pos) => {
  addToMapWithStats(mode, pos, STATS.basic_cog())
}

const createBasicCog = (mode, pos) => createWithStats(mode, pos, STATS.basic_cog())

const STATS = {
  basic_cog: () => ({
      name: 'Cog',
      renderer: {
        character: 'c',
        color: COLORS.cog2,
        background: COLORS.cog1,
        sprite: '',
      },
      durability: 3,
      attackDamage: 1,
      behaviors: [
        new Behaviors.MoveTowardsCover({repeat: 5}),
        new Behaviors.TelegraphRangedAttackThroughCover({repeat: 1}),
        new Behaviors.ExecuteRangedAttack({repeat: 1}),
        new Behaviors.MoveTowardsPlayer({repeat: 5}),
      ],
      loadout: {
        equipmentCreators: [Lancer],
        inventoryCreators: [{amount: 100, creator: Ammo}]
      },
    }),
};

export const addCogPod = (mode, pos) => {
  let entity = createCogPod(mode)

  if (mode.game.placeActorOnMap(entity)) {
    mode.game.engine.addActor(entity);
    mode.game.draw();
  };
}

export const createCogPod = (mode, reinforcementCount = 1) => (
  new EmergenceHole({
    name: 'Pod',
    game: mode.game,
    passable: true,
    renderer: {
      character: '+',
      sprite: '',
      color: COLORS.cog1,
      background: COLORS.base04,
    },
    timeToSpread: 1,
    spreadCount: reinforcementCount,
    durability: 1,
    faction: 'COG',
    enemyFactions: ['LOCUST'],
    speed: Constant.ENERGY_THRESHOLD,
    getSpawnedEntity: (spawnPosition) => createBasicCog(mode, spawnPosition),
  })
)

const createBaseStats = (mode, pos) => {
  return {
    pos,
    game: mode.game,
    faction: 'COG',
    enemyFactions: ['LOCUST'],
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

function createWithStats(mode, pos, stats) {
  return createNewJacintoAIEntity({
    ...createBaseStats(mode, pos),
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

function addToMapWithStats (mode, pos, stats) {
  const entityCreator = () => createWithStats(mode, pos, stats)
  addEntityToMapWithStatsUsingCreator(mode, entityCreator)
}

function addEntityToMapWithStatsUsingCreator (mode, entityCreator) {
  const entity = entityCreator();
  if (mode.game.placeActorOnMap(entity)) {
    mode.game.engine.addActor(entity);
  };
}
