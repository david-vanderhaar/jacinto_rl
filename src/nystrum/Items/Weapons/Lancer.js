import * as Constant from '../../constants';
import {RangedWeapon} from '../../Entities/index';

export const Lancer = (engine, pos) => new RangedWeapon({
  game: engine.game,
  name: 'Lancer',
  passable: true,
  attackRange: 6,
  baseRangedAccuracy: 1,
  baseRangedDamage: 1,
  pos,
  shapePattern: Constant.CLONE_PATTERNS.square,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    character: 'L',
    color: 'white',
    background: 'lightsteelblue',
  },
});
