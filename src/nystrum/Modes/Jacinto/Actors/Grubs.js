import * as Behaviors from '../../../Entities/AI/Behaviors';
import { COLORS } from '../theme';
import {CLONE_PATTERNS} from '../../../constants';
import {JacintoAI} from '../../../Entities/index';

export function addWretch (modeData, pos) {
  let players = modeData.getPlayers()
  let targetEntity = players[0]
  let entity = new JacintoAI({
    targetEntity,
    pos,
    renderer: {
      character: 'w',
      color: COLORS.flesh1,
      background: COLORS.flesh3,
      sprite: '',
    },
    name: 'Wretch',
    game: modeData.game,
    actions: [],
    durability: 1,
    attackDamage: 1,
    speed: 500,
    behaviors: [
      new Behaviors.MoveTowardsEnemy({actor: null, repeat: 5}),
      new Behaviors.TelegraphAttack({actor: null, repeat: 1, attackPattern: CLONE_PATTERNS.clover}),
    ],
    faction: 'LOCUST',
    enemyFactions: ['COG'],
    onDestroy: (actor) => {
      const chance = Math.random();
      if (chance <= 0.05) {
        modeData.addAmmoLoot(actor.getPosition());
      } else if (chance <= 0.1) {
        modeData.addGrenadeLoot(actor.getPosition());
      }
    },
  })
  if (modeData.game.placeActorOnMap(entity)) {
    modeData.game.engine.addActor(entity);
  };
}