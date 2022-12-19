import * as Constant from '../../constants';
import {CoverWall, ThrowableSpawner, SmokeParticle} from '../../Entities/index';
import {COLORS} from '../../Modes/Jacinto/theme';
import * as Helper from '../../../helper';
import { JACINTO_SOUNDS } from '../../Modes/Jacinto/sounds';

export const SmokeGrenade = (engine, range) => new ThrowableSpawner({
  game: engine.game,
  name: 'Smoke Grenade',
  passable: true,
  renderer: {
    character: 'o',
    sprite: '',
    color: COLORS.red,
    background: COLORS.base02,
  },
  attackDamage: 0,
  speed: Constant.ENERGY_THRESHOLD * range,
  energy: 0,
  spawnStructure: Constant.CLONE_PATTERNS.square,
  spawnedEntityClass: SmokeParticle,
  spawnedEntityOptions: {
    passable: true,
    renderer: {
      character: '▓',
      sprite: '▓',
      color: COLORS.base1,
      background: null,
      animation: [
        { background: null, color: COLORS.base1, character: '▒', sprite: '▒', passable: true, },
        { background: null, color: COLORS.base1, character: '░', sprite: '░', passable: true, },
        { background: null, color: COLORS.base1, character: '▓', sprite: '▓', passable: true, },
      ]
    },
    name: 'Smoke',
    game: engine.game,
    durability: 3,
    accuracyModifer: -0.3,
    damageModifer: 0,
  },
  range,
  onDestroy: (actor) => {
    JACINTO_SOUNDS.smoke_grenade_fire.play()
    actor.spawnEntities()
  },
})
