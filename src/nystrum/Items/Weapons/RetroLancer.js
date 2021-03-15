import * as Constant from '../../constants';
import {RangedWeapon} from '../../Entities/index';
import {COLORS} from '../../Modes/Jacinto/theme';

export const RetroLancer = (engine, pos) => new RangedWeapon({
  game: engine.game,
  name: 'Retro Lancer',
  passable: true,
  attackRange: 10,
  magazineSize: 4,
  baseRangedAccuracy: 0.6,
  baseRangedDamage: 1,
  attackDamage: 3,
  pos,
  // shapePattern: Constant.CLONE_PATTERNS.triple_point,
  // shapePattern: Constant.CLONE_PATTERNS.bigSquare,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    character: 'R',
    color: COLORS.base3,
    background: COLORS.cog1,
  },
});
