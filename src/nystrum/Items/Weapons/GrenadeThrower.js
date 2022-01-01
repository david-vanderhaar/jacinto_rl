import * as Constant from '../../constants';
import {RangedWeapon} from '../../Entities/index';
import {COLORS} from '../../Modes/Jacinto/theme';

export const GrenadeThrower = (engine, pos) => new RangedWeapon({
  game: engine.game,
  name: 'Grenade Thrower',
  passable: true,
  attackRange: 12,
  magazineSize: 2,
  baseRangedAccuracy: 0.9,
  baseRangedDamage: 0,
  attackDamage: 0,
  pos,
  shapePattern: Constant.CLONE_PATTERNS.bigSquare,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    character: 'Gb',
    color: COLORS.base03,
    background: COLORS.green,
  },
});
