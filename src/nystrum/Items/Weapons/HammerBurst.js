import * as Constant from '../../constants';
import {RangedWeapon} from '../../Entities/index';
import { JACINTO_SOUNDS } from '../../Modes/Jacinto/sounds';
import {COLORS} from '../../Modes/Jacinto/theme';

export const HammerBurst = (engine, pos) => new RangedWeapon({
  game: engine.game,
  name: 'Hammer Burst',
  passable: true,
  attackRange: 6,
  magazineSize: 4,
  baseRangedAccuracy: 0.65,
  baseRangedDamage: 2,
  attackDamage: 1,
  pos,
  shapePattern: Constant.CLONE_PATTERNS.filledClover,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    character: 'Hb',
    color: COLORS.base3,
    background: COLORS.gray,
  },
  rangedHitSounds: [
    JACINTO_SOUNDS.hammerburst_fire_01,
    JACINTO_SOUNDS.hammerburst_fire_02,
  ],
  rangedMissSounds: [
    JACINTO_SOUNDS.bullet_miss_01,
    JACINTO_SOUNDS.bullet_miss_02,
    JACINTO_SOUNDS.bullet_miss_03,
  ]
});
