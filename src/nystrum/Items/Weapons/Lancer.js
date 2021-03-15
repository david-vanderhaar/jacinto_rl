import * as Constant from '../../constants';
import {RangedWeapon} from '../../Entities/index';
import {COLORS} from '../../Modes/Jacinto/theme';

export const Lancer = (engine, pos) => new RangedWeapon({
  game: engine.game,
  name: 'Lancer',
  passable: true,
  attackRange: 12,
  magazineSize: 4,
  baseRangedAccuracy: 1,
  baseRangedDamage: 1,
  attackDamage: 1,
  pos,
  // shapePattern: Constant.CLONE_PATTERNS.triple_point,
  // shapePattern: Constant.CLONE_PATTERNS.bigSquare,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    character: 'L',
    color: COLORS.base3,
    background: COLORS.gray,
  },
});