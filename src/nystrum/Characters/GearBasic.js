// import deps
import * as Item from '../items';
import * as Constant from '../constants';
import { Player } from '../Entities/index';
import { ContainerSlot } from '../Entities/Containing';
import {ChakraResource} from '../Actions/ActionResources/ChakraResource';
import {Say} from '../Actions/Say';
import {Move} from '../Actions/Move';
import {PrepareSandWall} from '../Actions/SandWall';
import {PrepareDirectionalThrow} from '../Actions/PrepareDirectionalThrow';
import {PrepareRangedAttack} from '../Actions/PrepareRangedAttack';
import {SandPulse} from '../Actions/SandPulse';
import {AddSandSkinStatusEffect} from '../Actions/AddSandSkinStatusEffect';
import {OpenInventory} from '../Actions/OpenInventory';
import {OpenEquipment} from '../Actions/OpenEquipment';
import {OpenUpgrades} from '../Actions/OpenUpgrades';
import {Upgrade} from '../Entities/Upgradable';
import {PickupRandomItem} from '../Actions/PickupRandomItem';
import { Lancer } from '../Items/Weapons/Lancer';
import { Snub } from '../Items/Weapons/Snub';
import { Grenade } from '../Items/Weapons/Grenade';
import { Ammo } from '../Items/Pickups/Ammo';
import {COLORS} from '../Modes/Jacinto/theme';
import { Reload } from '../Actions/Reload';

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
        return new Move({
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
        return new Move({
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
        return new Move({
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
        return new Move({
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
      o: () => new OpenEquipment({
        label: 'Equipment',
        game: engine.game,
        actor,
      }),
      u: () => new OpenUpgrades({
        label: 'Upgrade',
        game: engine.game,
        actor,
      }),
      g: () => new PickupRandomItem({
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
      })
    };
  }
  // instantiate class
  let actor = new Player({
    pos: { x: 23, y: 7 },
    renderer: {
      sprite: '',
      character: 'G',
      color: COLORS.base3,
      background: COLORS.cog2,
    },
    name: 'Gear',
    actions: [],
    speed: Constant.ENERGY_THRESHOLD * 4,
    durability: 1,
    baseRangedAccuracy: 0,
    baseRangedDamage: 1,
    charge: 10,
    upgrade_points: 3,
    upgrade_tree: [
      Upgrade({
        cost: 1,
        name: '+5% Accuracy',
        activate: (actor) => (actor.baseRangedAccuracy += 0.05),
      }),
      Upgrade({
        cost: 2,
        name: '+1 Actions',
        activate: (actor) => {
          actor.speed += Constant.ENERGY_THRESHOLD;
          actor.energy += Constant.ENERGY_THRESHOLD;
        },
        removeOnActivate: true,
      }),
    ],
    equipment: Constant.EQUIPMENT_LAYOUTS.gear(),
    game: engine.game,
    presentingUI: true,
    faction: 'COG',
    initializeKeymap: keymap,
  })

  // add default items to container
  const ammo = Array(100).fill('').map(() => Ammo(engine));
  const grenades = Array(4).fill('').map(() => Grenade(engine, 6));
  const snub = Snub(engine);
  actor.container = [
    new ContainerSlot({
      itemType: snub.name,
      items: [snub],
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

  const lancer = Lancer(engine);
  actor.equip(lancer.equipmentType, lancer);

  return actor;
}