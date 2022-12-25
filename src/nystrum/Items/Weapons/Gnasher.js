import * as Constant from '../../constants';
import {RangedWeapon} from '../../Entities/index';
import { JACINTO_SOUNDS } from '../../Modes/Jacinto/sounds';
import {COLORS} from '../../Modes/Jacinto/theme';

export const Gnasher = (engine, pos) => new RangedWeapon({
  game: engine.game,
  name: 'Gnasher',
  passable: true,
  attackRange: 4,
  magazineSize: 2,
  baseRangedAccuracy: 0.9,
  baseRangedDamage: 2,
  attackDamage: 1,
  pos,
  shapePattern: Constant.CLONE_PATTERNS.square,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    character: 'G',
    color: COLORS.base03,
    background: COLORS.green,
  },
  rangedHitSounds: [
    JACINTO_SOUNDS.boltok_fire_01,
    JACINTO_SOUNDS.boltok_fire_02,
  ],
  rangedMissSounds: [
    JACINTO_SOUNDS.bullet_miss_01,
    JACINTO_SOUNDS.bullet_miss_02,
    JACINTO_SOUNDS.bullet_miss_03,
  ]
});
