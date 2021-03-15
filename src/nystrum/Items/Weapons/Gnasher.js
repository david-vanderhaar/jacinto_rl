import * as Constant from '../../constants';
import {RangedWeapon} from '../../Entities/index';
import {COLORS} from '../../Modes/Jacinto/theme';

export const Gnasher = (engine, pos) => new RangedWeapon({
  game: engine.game,
  name: 'Gnasher',
  passable: true,
  attackRange: 4,
  magazineSize: 2,
  baseRangedAccuracy: 0.9,
  baseRangedDamage: 3,
  attackDamage: 0,
  pos,
  shapePattern: Constant.CLONE_PATTERNS.square,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    character: 'G',
    color: COLORS.base03,
    background: COLORS.green,
  },
});
