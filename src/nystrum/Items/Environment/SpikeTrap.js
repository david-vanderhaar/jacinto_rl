import * as Constant from '../../constants';
import {Trap} from '../../Entities/index';
import {COLORS} from '../../Modes/Jacinto/theme';
import {DamageOnContact} from '../../StatusEffects/DamageOnContact';

export const SpikeTrap = (engine, actor, attackDamage = 1, useCount = 2) => {
  const trap = new Trap({
    game: engine.game,
    name: 'Trap',
    passable: true,
    renderer: {
      character: '*',
      sprite: '',
      color: COLORS.base3,
      background: COLORS.flesh2,
    },
    enemyFactions: actor.enemyFactions,
  });

  const effect = new DamageOnContact({
    actor: trap,
    game: engine.game,
    damage: attackDamage,
    useCount,
  })
  engine.addStatusEffect(effect);
  return trap
}