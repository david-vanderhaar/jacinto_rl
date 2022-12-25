import {Ammo as AmmoEntity} from '../../Entities/index';
import {COLORS} from '../../Modes/Jacinto/theme';

export const ExplodingAmmo = (engine) => new AmmoEntity({
  game: engine.game,
  name: 'Ammo',
  passable: true,
  renderer: {
    character: '|b',
    sprite: '',
    background: COLORS.gray,
    color: COLORS.red,
  },
  flammability: 0,
  explosivity: 4,
});