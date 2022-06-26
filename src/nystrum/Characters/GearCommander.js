// import deps
import * as Constant from '../constants';
import { Player } from '../Entities/index';
import { ContainerSlot } from '../Entities/Containing';
import {Say} from '../Actions/Say';
import {MoveOrAttack} from '../Actions/MoveOrAttack';
import {PrepareDirectionalThrow} from '../Actions/PrepareDirectionalThrow';
import {PrepareRangedAttack} from '../Actions/PrepareRangedAttack';
import {PrepareCallReinforcements} from '../Actions/PrepareCallReinforcements';
import {PrepareAreaStatusEffect} from '../Actions/PrepareAreaStatusEffect';
import {OpenAvailableStatusEffects} from '../Actions/OpenAvailableStatusEffects';
import {OpenInventory} from '../Actions/OpenInventory';
import {OpenUpgrades} from '../Actions/OpenUpgrades';
import {Upgrade} from '../Entities/Upgradable';
import {PickupAllItems} from '../Actions/PickupAllItems';
import { Boltok } from '../Items/Weapons/Boltok';
import { Snub } from '../Items/Weapons/Snub';
import { Grenade } from '../Items/Weapons/Grenade';
import { Ammo } from '../Items/Pickups/Ammo';
import {COLORS} from '../Modes/Jacinto/theme';
import { Reload } from '../Actions/Reload';
import {UpgradeResource} from '../Actions/ActionResources/UpgradeResource';
import { SandSkin } from '../StatusEffects/SandSkin';
import { MeleeDamage } from '../StatusEffects/MeleeDamage';


export default function (engine) {
  // define keymap
  const keymap = (engine, actor) => {
    return {
      Escape: () => new Say({
        label: 'Pass',
        message: 'pass turn...',
        game: engine.game,
        actor,
        interrupt: true,
        energyCost: 0,
      }),
      w: () => {
        const direction = Constant.DIRECTIONS.N;
        let newX = actor.pos.x + direction[0];
        let newY = actor.pos.y + direction[1];
        return new MoveOrAttack({
          hidden: true,
          targetPos: { x: newX, y: newY },
          game: engine.game,
          actor,
          energyCost: Constant.ENERGY_THRESHOLD
        });
      },
      s: () => {
        const direction = Constant.DIRECTIONS.S;
        let newX = actor.pos.x + direction[0];
        let newY = actor.pos.y + direction[1];
        return new MoveOrAttack({
          hidden: true,
          targetPos: { x: newX, y: newY },
          game: engine.game,
          actor,
          energyCost: Constant.ENERGY_THRESHOLD
        });
      },
      a: () => {
        const direction = Constant.DIRECTIONS.W;
        let newX = actor.pos.x + direction[0];
        let newY = actor.pos.y + direction[1];
        return new MoveOrAttack({
          hidden: true,
          targetPos: { x: newX, y: newY },
          game: engine.game,
          actor,
          energyCost: Constant.ENERGY_THRESHOLD
        });
      },
      d: () => {
        const direction = Constant.DIRECTIONS.E;
        let newX = actor.pos.x + direction[0];
        let newY = actor.pos.y + direction[1];
        return new MoveOrAttack({
          hidden: true,
          targetPos: { x: newX, y: newY },
          game: engine.game,
          actor,
          energyCost: Constant.ENERGY_THRESHOLD
        });
      },
      p: () => new Say({
        label: 'Stay',
        message: 'standing still...',
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD,
      }),
      f: () => new PrepareRangedAttack({
        label: 'Fire Weapon',
        game: engine.game,
        actor,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
        passThroughRequiredResources: [],
      }),
      r: () => new Reload({
        label: 'Reload',
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD,
      }),
      i: () => new OpenInventory({
        label: 'Inventory',
        game: engine.game,
        actor,
      }),
      // o: () => new OpenEquipment({
      //   label: 'Equipment',
      //   game: engine.game,
      //   actor,
      // }),
      u: () => new OpenUpgrades({
        label: 'Upgrade',
        game: engine.game,
        actor,
      }),
      g: () => new PickupAllItems({
        label: 'Pickup',
        game: engine.game,
        actor,
      }),
      t: () => new PrepareDirectionalThrow({
        label: 'Grenade',
        projectileType: 'Grenade',
        game: engine.game,
        actor,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
      }),
      c: () => new PrepareCallReinforcements({
          label: 'Call Reinforcments',
          game: engine.game,
          actor,
          passThroughEnergyCost: Constant.ENERGY_THRESHOLD * 3,
          passThroughRequiredResources: [
            new UpgradeResource({ getResourceCost: () => 1 }),
          ],
        }),
      b: () => new OpenAvailableStatusEffects({
          label: 'Buff',
          game: engine.game,
          actor,
        }),
    };
  }
  // instantiate class
  const primary = Snub(engine);
  const durability = 5;
  let actor = new Player({
    pos: { x: 23, y: 7 },
    renderer: {
      sprite: '',
      character: 'G',
      color: COLORS.base3,
      background: COLORS.cog2,
    },
    name: 'The Commander',
    speed: Constant.ENERGY_THRESHOLD * 3,
    durability,
    baseRangedAccuracy: 0,
    baseRangedDamage: 0,
    attackDamage: 0,
    upgrade_points: 10,
    upgrade_tree: [
      Upgrade({
        cost: 1,
        name: '+1 Health',
        activate: (actor) => {
          actor.durabilityMax += 1
          actor.increaseDurability(1)
        },
      }),
      Upgrade({
        cost: 1,
        name: '+1 Encourage Range',
        activate: (actor) => (actor.increaseStatusEffectRange(1)),
      }),
      Upgrade({
        cost: 3,
        name: 'Full Health',
        canUpgrade: (actor) => actor.durability < actor.durabilityMax,
        activate: (actor) => (actor.increaseDurability(actor.durabilityMax - actor.durability)),
      }),
    ],
    availableStatusEffects: [SandSkin],
    equipment: Constant.EQUIPMENT_LAYOUTS.gear(),
    game: engine.game,
    presentingUI: true,
    faction: 'COG',
    enemyFactions: ['LOCUST'],
    initializeKeymap: keymap,
  })

  // add default items to container
  const ammo = Array(10).fill('').map(() => Ammo(engine));
  const grenades = Array(2).fill('').map(() => Grenade(engine, 6));
  const secondary = Boltok(engine);
  actor.container = [
    new ContainerSlot({
      itemType: secondary.name,
      items: [secondary],
    }),
    new ContainerSlot({
      itemType: ammo[0].name,
      items: ammo,
    }),
    new ContainerSlot({
      itemType: grenades[0].name,
      items: grenades,
    }),
  ]

  actor.equip(primary.equipmentType, primary);

  return actor;
}