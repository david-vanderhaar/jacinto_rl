// import deps
import * as Constant from '../constants';
import { UpgradeResource } from '../Actions/ActionResources/UpgradeResource';
import { Player } from '../Entities/index';
import { ContainerSlot } from '../Entities/Containing';
import {Say} from '../Actions/Say';
import {Move} from '../Actions/Move';
import {MoveOrAttack} from '../Actions/MoveOrAttack';
import {PrepareDirectionalThrow} from '../Actions/PrepareDirectionalThrow';
import {PrepareRangedAttack} from '../Actions/PrepareRangedAttack';
import {OpenInventory} from '../Actions/OpenInventory';
import {OpenUpgrades} from '../Actions/OpenUpgrades';
import {OpenDropInventory} from '../Actions/OpenDropInventory';
import {Upgrade} from '../Entities/Upgradable';
import {PickupAllItems} from '../Actions/PickupAllItems';
import { Longshot } from '../Items/Weapons/Longshot';
import { Boltok } from '../Items/Weapons/Boltok';
import { Grenade } from '../Items/Weapons/Grenade';
import { Ammo } from '../Items/Pickups/Ammo';
import { SpikeTrap } from '../Items/Environment/SpikeTrap';
import {COLORS} from '../Modes/Jacinto/theme';
import { Reload } from '../Actions/Reload';
import { AddSprintStatusEffect } from '../Actions/AddSprintStatusEffect';
import { PrepareDropItemInDirection } from '../Actions/PrepareDropItemInDirection';

export default function (engine) {
  // define keymap
  const keymap = (engine, actor) => {
    return {
      Escape: () => new Say({
        label: 'Stay',
        message: 'standing still...',
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD,
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
      y: () => new PrepareDropItemInDirection({
        label: 'Place Trap',
        itemName: 'Trap',
        game: engine.game,
        actor,
      })
      // c: () => new AddSprintStatusEffect({
      //   label: 'Sprint',
      //   game: engine.game,
      //   actor,
      //   buffValue: Constant.ENERGY_THRESHOLD * 10,
      //   requiredResources: [
      //     new UpgradeResource({ getResourceCost: () => 1 }),
      //   ],
      // }),
    };
  }
  // instantiate class
  const primary = Longshot(engine);
  const secondary = Boltok(engine);
  const durability = 4;
  let actor = new Player({
    pos: { x: 23, y: 7 },
    renderer: {
      sprite: '',
      character: 'G',
      color: COLORS.base3,
      background: COLORS.cog2,
    },
    name: 'The Stranded',
    speed: Constant.ENERGY_THRESHOLD * 3,
    durability,
    baseRangedAccuracy: 0,
    baseRangedDamage: 0,
    attackDamage: 0,
    upgrade_points: 0,
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
        name: '+5% Longshot Accuracy',
        activate: (actor) => (primary.baseRangedAccuracy += 0.05),
      }),
      Upgrade({
        cost: 1,
        name: '+5% Boltok Accuracy',
        activate: (actor) => (secondary.baseRangedAccuracy += 0.05),
      }),
      Upgrade({
        cost: 1,
        name: 'Craft 2 Grenades',
        activate: (actor) => {
          Array(2).fill('').map(() => actor.addToContainer(Grenade(engine, 6)));
        },
      }),
      Upgrade({
        cost: 1,
        name: 'Craft 6 Traps',
        activate: (actor) => {
          Array(6).fill('').map(() => actor.addToContainer(SpikeTrap(engine, actor)));
        },
      }),
      Upgrade({
        cost: 1,
        name: 'Craft 10 Ammo',
        activate: (actor) => {
          Array(10).fill('').map(() => actor.addToContainer(Ammo(engine)));
        },
      }),
      Upgrade({
        cost: 3,
        name: 'Full Health',
        canUpgrade: (actor) => actor.durability < actor.durabilityMax,
        activate: (actor) => (actor.increaseDurability(actor.durabilityMax - actor.durability)),
      }),
    ],
    equipment: Constant.EQUIPMENT_LAYOUTS.gear(),
    game: engine.game,
    presentingUI: true,
    faction: 'COG',
    enemyFactions: ['LOCUST'],
    initializeKeymap: keymap,
  })

  // add default items to container
  const ammo = Array(15).fill('').map(() => Ammo(engine));
  const grenades = Array(2).fill('').map(() => Grenade(engine, 6));
  const traps = Array(4).fill('').map(() => SpikeTrap(engine, actor));
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
    new ContainerSlot({
      itemType: traps[0].name,
      items: traps,
    }),
  ]

  actor.equip(primary.equipmentType, primary);

  return actor;
}