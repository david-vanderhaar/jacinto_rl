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
import {PrepareSubstitution} from '../Actions/PrepareSubstitution';
import {SandPulse} from '../Actions/SandPulse';
import {AddSandSkinStatusEffect} from '../Actions/AddSandSkinStatusEffect';
import {OpenInventory} from '../Actions/OpenInventory';
import {OpenEquipment} from '../Actions/OpenEquipment';
import {OpenDropInventory} from '../Actions/OpenDropInventory';
import {CloneSelf} from '../Actions/CloneSelf';
import {PickupRandomItem} from '../Actions/PickupRandomItem';

export default function (engine) {
  // define keymap
  const keymap = (engine, actor) => {
    return {
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
      Escape: () => new Say({
        label: 'Pass',
        message: 'pass turn...',
        game: engine.game,
        actor,
        interrupt: true,
        energyCost: 0,
      }),
      l: () => new PrepareSandWall({
        label: 'Sand Wall',
        game: engine.game,
        actor,
        sandWallRequiredResources: [new ChakraResource({ getResourceCost: () => 1 })]
      }),
      r: () => new PrepareSubstitution({
        label: 'Substitution',
        game: engine.game,
        actor,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
        passThroughRequiredResources: [new ChakraResource({ getResourceCost: () => 1 })]
      }),
      k: () => new SandPulse({
        label: 'Sand Pulse',
        game: engine.game,
        actor,
      }),
      h: () => new AddSandSkinStatusEffect({
        label: 'Sand Skin',
        game: engine.game,
        actor,
        requiredResources: [
          new ChakraResource({ getResourceCost: () => 2 }),
        ],
      }),
      c: () => new CloneSelf({
        label: 'Sand Clone',
        game: engine.game,
        actor,
        cloneArgs: [
          {
            attribute: 'renderer',
            value: { ...actor.renderer, background: '#A89078' }
          },
          {
            attribute: 'ignoredKeys',
            value: ['g'],
          },
        ],
        requiredResources: [
          new ChakraResource({ getResourceCost: () => 4 }),
        ],
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
      u: () => new OpenDropInventory({
        label: 'Drop Items',
        game: engine.game,
        actor,
      }),
      g: () => new PickupRandomItem({
        label: 'Pickup',
        game: engine.game,
        actor,
      }),
      t: () => new PrepareDirectionalThrow({
        label: 'Throw',
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
      character: 'G',
      color: Constant.THEMES.SOLARIZED.base2,
      background: Constant.THEMES.NARUTO.gaara,
    },
    name: 'Gaara',
    actions: [],
    speed: 400,
    durability: 20,
    charge: 10,
    game: engine.game,
    presentingUI: true,
    initializeKeymap: keymap,
  })

  // add default items to container
  const kunais = Array(100).fill('').map(() => Item.directionalKunai(engine, { ...actor.pos }, null, 10));
  const swords = Array(2).fill('').map(() => Item.sword(engine));
  actor.container = [
    new ContainerSlot({
      itemType: kunais[0].name,
      items: kunais,
    }),
    new ContainerSlot({
      itemType: swords[0].name,
      items: swords,
    }),
  ]

  return actor;
}