import * as Constant from '../../constants';
import {RangedWeapon} from '../../Entities/index';
import {COLORS} from '../../Modes/Jacinto/theme';

export const RetroLancer = (engine, pos) => new RangedWeapon({
  game: engine.game,
  name: 'Retro Lancer',
  passable: true,
  attackRange: 10,
  magazineSize: 3,
  baseRangedAccuracy: 0.7,
  baseRangedDamage: 2,
  attackDamage: 6,
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
