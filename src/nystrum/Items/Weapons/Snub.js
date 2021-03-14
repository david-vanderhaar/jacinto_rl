import * as Constant from '../../constants';
import {RangedWeapon} from '../../Entities/index';
import {COLORS} from '../../Modes/Jacinto/theme';

export const Snub = (engine, pos) => new RangedWeapon({
  game: engine.game,
  name: 'Snub',
  passable: true,
  attackRange: 6,
  magazineSize: 10,
  baseRangedAccuracy: 0.7,
  baseRangedDamage: 1,
  pos,
  // shapePattern: Constant.CLONE_PATTERNS.square,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    character: 'S',
    color: COLORS.base3,
    background: COLORS.base01,
  },
});
