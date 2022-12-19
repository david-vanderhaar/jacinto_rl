import * as Constant from '../../constants';
import {RangedWeapon} from '../../Entities/index';
import { JACINTO_SOUNDS } from '../../Modes/Jacinto/sounds';
import {COLORS} from '../../Modes/Jacinto/theme';

export const Longshot = (engine, pos) => new RangedWeapon({
  game: engine.game,
  name: 'Longshot',
  passable: true,
  attackRange: 14,
  magazineSize: 1,
  baseRangedAccuracy: 1,
  baseRangedDamage: 10,
  attackDamage: 1,
  pos,
  // shapePattern: Constant.CLONE_PATTERNS.triple_point,
  // shapePattern: Constant.CLONE_PATTERNS.bigSquare,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    character: 'L',
    color: COLORS.base1,
    background: COLORS.base04,
  },
  rangedHitSounds: [
    JACINTO_SOUNDS.longshot_fire_01,
    JACINTO_SOUNDS.longshot_fire_02,
    JACINTO_SOUNDS.longshot_fire_03,
  ],
  rangedMissSounds: [
    JACINTO_SOUNDS.bullet_miss_01,
    JACINTO_SOUNDS.bullet_miss_02,
    JACINTO_SOUNDS.bullet_miss_03,
  ]
});
