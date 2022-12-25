import * as Constant from '../../constants';
import {RangedWeapon} from '../../Entities/index';
import {COLORS} from '../../Modes/Jacinto/theme';
import {JACINTO_SOUNDS} from '../../Modes/Jacinto/sounds'

export const Lancer = (engine, pos) => new RangedWeapon({
  game: engine.game,
  name: 'Lancer',
  passable: true,
  attackRange: 8,
  magazineSize: 4,
  baseRangedAccuracy: 0.70,
  baseRangedDamage: 2,
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
  rangedHitSounds: [
    JACINTO_SOUNDS.cog_rifle_fire_01,
    JACINTO_SOUNDS.cog_rifle_fire_02,
    JACINTO_SOUNDS.cog_rifle_fire_03,
    JACINTO_SOUNDS.cog_rifle_fire_04,
  ],
  rangedMissSounds: [
    JACINTO_SOUNDS.bullet_miss_01,
    JACINTO_SOUNDS.bullet_miss_02,
    JACINTO_SOUNDS.bullet_miss_03,
  ]
});
