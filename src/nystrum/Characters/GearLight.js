// import deps
import * as Constant from '../constants';
import { Player } from '../Entities/index';
import { ContainerSlot } from '../Entities/Containing';
import {Say} from '../Actions/Say';
import {MoveOrAttack} from '../Actions/MoveOrAttack';
import {PrepareDirectionalThrow} from '../Actions/PrepareDirectionalThrow';
import {PrepareRangedAttack} from '../Actions/PrepareRangedAttack';
import {OpenInventory} from '../Actions/OpenInventory';
import {OpenUpgrades} from '../Actions/OpenUpgrades';
import {Upgrade} from '../Entities/Upgradable';
import {PickupAllItems} from '../Actions/PickupAllItems';
import { Lancer } from '../Items/Weapons/Lancer';
import { Snub } from '../Items/Weapons/Snub';
import { Grenade } from '../Items/Weapons/Grenade';
import { SmokeGrenade } from '../Items/Weapons/SmokeGrenade';
import { Ammo } from '../Items/Pickups/Ammo';
import {COLORS} from '../Modes/Jacinto/theme';
import { Reload } from '../Actions/Reload';
import { AddStatusEffect } from '../Actions/AddStatusEffect';
import {MeleeDamage} from '../StatusEffects/MeleeDamage';
import { JACINTO_SOUNDS } from '../Modes/Jacinto/sounds';
import * as Helper from '../../helper'
import { TakeAim } from '../StatusEffects/TakeAim';

export default function (engine) {
  const lancer = Lancer(engine);
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
      c: () => new AddStatusEffect({
        label: 'Rev Lancer Chainsaw',
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD,
        effect: new MeleeDamage({
          buffValue: 12,
          game: engine.game,
          actor: lancer, // should be weapon
          lifespan: Constant.ENERGY_THRESHOLD * 3,
          stepInterval: Constant.ENERGY_THRESHOLD,
          onStartCallback: () => {
            Helper.getRandomInArray([
              JACINTO_SOUNDS.chainsaw_01,
              JACINTO_SOUNDS.chainsaw_02,
            ]).play()
          },
        }),
        particleTemplate: {
          renderer: {
            color: '#424242',
            background: '#e6e6e6',
            character: ''
          },
        },
      }),
      v: () => new AddStatusEffect({
        label: 'Take Aim',
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD * 2,
        effect: new TakeAim({
          buffValue: 10,
          game: engine.game,
          actor,
        }),
      }),
    };
  }
  // instantiate class
  
  const durability = 5;
  let actor = new Player({
    pos: { x: 23, y: 7 },
    renderer: {
      sprite: '',
      character: 'G',
      color: COLORS.base3,
      background: COLORS.cog2,
    },
    name: 'The Scout',
    actions: [],
    speed: Constant.ENERGY_THRESHOLD * 4,
    durability,
    attackDamage: 0,
    baseRangedAccuracy: 0,
    baseRangedDamage: 0,
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
        name: '+10% Lancer Accuracy',
        activate: (actor) => (lancer.baseRangedAccuracy += 0.1),
      }),
      Upgrade({
        cost: 3,
        name: '+1 Actions',
        activate: (actor) => {
          actor.speed += Constant.ENERGY_THRESHOLD;
          actor.energy += Constant.ENERGY_THRESHOLD;
        },
        removeOnActivate: true,
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
  const ammo = Array(10).fill('').map(() => Ammo(engine));
  const grenades = Array(2).fill('').map(() => Grenade(engine, 6));
  // const smokes = Array(4).fill('').map(() => SmokeGrenade(engine, 2));
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
    // new ContainerSlot({
    //   itemType: smokes[0].name,
    //   items: smokes,
    // }),
  ]

  actor.equip(lancer.equipmentType, lancer);

  return actor;
}