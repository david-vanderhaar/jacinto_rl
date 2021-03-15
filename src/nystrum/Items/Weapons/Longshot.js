import * as Constant from '../../constants';
import {RangedWeapon} from '../../Entities/index';
import {COLORS} from '../../Modes/Jacinto/theme';

export const Longshot = (engine, pos) => new RangedWeapon({
  game: engine.game,
  name: 'Longshot',
  passable: true,
  attackRange: 20,
  magazineSize: 1,
  baseRangedAccuracy: 1,
  baseRangedDamage: 10,
  attackDamage: 0,
  pos,
  // shapePattern: Constant.CLONE_PATTERNS.triple_point,
  // shapePattern: Constant.CLONE_PATTERNS.bigSquare,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    character: 'L',
    color: COLORS.base1,
    background: COLORS.base04,
  },
});
