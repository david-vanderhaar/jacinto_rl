import * as Constant from '../../constants';
import {RangedWeapon} from '../../Entities/index';
import {COLORS} from '../../Modes/Jacinto/theme';

export const Boltok = (engine, pos) => new RangedWeapon({
  game: engine.game,
  name: 'Boltok',
  passable: true,
  attackRange: 4,
  magazineSize: 2,
  baseRangedAccuracy: 0.8,
  baseRangedDamage: 3,
  attackDamage: 1,
  pos,
  // shapePattern: Constant.CLONE_PATTERNS.square,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    character: 'B',
    color: COLORS.base3,
    background: COLORS.locust0,
  },
});
