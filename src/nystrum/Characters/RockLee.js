// import deps
import * as Item from '../items';
import * as Constant from '../constants';
import { Player } from '../Entities/index';
import { ContainerSlot } from '../Entities/Containing';
import { ChakraResource } from '../Actions/ActionResources/ChakraResource';
import { Say } from '../Actions/Say';
import { Move } from '../Actions/Move';
import { OpenInventory } from '../Actions/OpenInventory';
import { OpenEquipment } from '../Actions/OpenEquipment';
import { OpenDropInventory } from '../Actions/OpenDropInventory';
import { PickupRandomItem } from '../Actions/PickupRandomItem';
import { PrepareDirectionalThrow } from '../Actions/PrepareDirectionalThrow';
import { PrepareTackle } from '../Actions/PrepareTackle';



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
      }),
      l: () => new PrepareTackle({
        label: 'Flying Lotus',
        game: engine.game,
        actor,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
      }),
      // k: {
      //   activate: () => Keymap.removeWeights(engine, 200),
      //   label: 'Remove wraps',
      // },
      // j: {
      //   activate: () => Keymap.drunkenFist(engine),
      //   label: 'Sip Sake',
      // },
      // h: {
      //   activate: () => Keymap.leafWhirlwind(engine),
      //   label: 'Leaf Whirlwind',
      // },
      // g: {
      //   activate: () => Keymap.openInnerGate(engine),
      //   label: 'Gate of Opening',
      // },
    };
  }
  // instantiate class
  let actor = new Player({
    pos: { x: 23, y: 7 },
    renderer: {
      character: 'R',
      color: Constant.THEMES.SOLARIZED.base3,
      background: Constant.THEMES.NARUTO.rock_lee,
    },
    name: 'Rock Lee',
    actions: [],
    speed: 600,
    durability: 20,
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