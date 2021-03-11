import { Base } from './Base';
import { Say } from './Say';
import * as Constant from '../constants';
import * as Helper from '../../helper';

export class MultiTargetRangedAttack extends Base {
  constructor({ targetPositions, processDelay = 25, ...args }) {
    super({ ...args });
    this.targetPositions = targetPositions;
    this.processDelay = processDelay;
  }
  perform() {
    let success = false;
    let alternative = null;
    if (!this.actor.entityTypes.includes('RANGED_ATTACKING')) {
      return {
        success: true,
        alternative: new Say({
          message: `Ooh I don\'t know how to attack`,
          game: this.game,
          actor: this.actor,
        }),
      };
    }
    let particlePath = [];
    let particlePos = { x: this.actor.pos.x, y: this.actor.pos.y };
    let renderer = this.particleTemplate.renderer;
    this.targetPositions.forEach((targetPos) => {
      // const path = Helper.calculateStraightPath(particlePos, targetPos);
      // const coverAccuracyModifer = path.reduce((acc, curr) => {
      //   let tile = this.game.map[Helper.coordsToString(curr)];
      //   let entitiesProvidingCover = Helper.filterEntitiesByType(tile.entities, 'COVERING');
      //   let coverModifer = 0;
      //   if (entitiesProvidingCover.length > 0) coverModifer = entitiesProvidingCover[0].accuracyModifer;
      //   return acc + coverModifer;
      // }, 0);
      // console.log('coverAccuracyModifer ', coverAccuracyModifer);
      // let [attackSuccess, hit] = this.actor.rangedAttack(targetPos, 0, coverAccuracyModifer);
      let [attackSuccess, hit] = this.actor.rangedAttack(targetPos);
      particlePath.push(targetPos);
      if (attackSuccess) {
        success = true;
        if (!hit) {
          success = true;
          this.addParticle(
            1,
            { ...targetPos },
            { x: 0, y: 0 },
            Constant.PARTICLE_TEMPLATES.fail.renderer,
          );
        } else {
          this.addParticle(
            particlePath.length + 1,
            particlePos,
            null,
            renderer,
            Constant.PARTICLE_TYPE.path,
            particlePath
          );
        }
      }
    });
    return {
      success,
      alternative,
    };
  }
}
;
