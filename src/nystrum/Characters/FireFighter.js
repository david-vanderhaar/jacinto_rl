// import deps
import { Player } from '../Entities/index'
import * as Constant from '../constants';
import * as Keymap from '../Keymap';
import { createFourDirectionMoveOptions } from '../Keymap/helper';

export default function (engine) {
  // define keymap
  const keymap = (engine) => {
    return {
      ...createFourDirectionMoveOptions(Keymap.push, engine, 'push', true),
      t: {
        activate: () => Keymap.activateProjectile(engine, 1, 5),
        label: 'shoot water',
      },
      c: {
        activate: () => Keymap.chop(engine),
        label: 'chop',
      },
      e: {
        activate: () => Keymap.activateEquipment(engine),
        label: 'equipment',
      },
      p: {
        activate: () => Keymap.equipRandomFromTile(engine),
        label: 'pick up',
      },
      g: {
        activate: () => Keymap.activateGrab(engine),
        label: 'grab',
      },
      r: {
        activate: () => Keymap.releaseGrab(engine),
        label: 'release',
      },
    };
  }
  // instantiate class
  let actor = new Player({
    pos: { x: 19, y: 22 },
    renderer: {
      character: 'F',
      sprite: '',
      color: Constant.THEMES.SOLARIZED.base3,
      background: Constant.THEMES.SOLARIZED.yellow,
    },
    name: Constant.PLAYER_NAME,
    equipment: Constant.EQUIPMENT_LAYOUTS.limited(),
    actions: [],
    speed: 100,
    durability: 4000,
    keymap: keymap(engine),
  })

  // default items to container
  // const axe = Array(2).fill('').map(() => Item.axe(engine));
  // actor.container = [
  //   new Entity.ContainerSlot({
  //     itemType: axe[0].name,
  //     items: axe,
  //   }),
  // ]
  return actor;
}