import * as Constant from '../../constants';
import {RangedWeapon} from '../../Entities/index';
import { JACINTO_SOUNDS } from '../../Modes/Jacinto/sounds';
import {COLORS} from '../../Modes/Jacinto/theme';

export const RetroLancer = (engine, pos) => new RangedWeapon({
  game: engine.game,
  name: 'Retro Lancer',
  passable: true,
  attackRange: 6,
  magazineSize: 3,
  baseRangedAccuracy: 0.7,
  baseRangedDamage: 2,
  attackDamage: 2,
  pos,
  // shapePattern: Constant.CLONE_PATTERNS.triple_point,
  // shapePattern: Constant.CLONE_PATTERNS.bigSquare,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    character: 'R',
    color: COLORS.base3,
    background: COLORS.cog1,
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
