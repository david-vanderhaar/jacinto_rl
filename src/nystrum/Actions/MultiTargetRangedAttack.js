import { Base } from './Base';
import { Say } from './Say';
import { Reload } from './Reload';
import * as Constant from '../constants';
import { JACINTO_SOUNDS } from '../Modes/Jacinto/sounds';

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
    const weapons = this.actor.getEquipedWeapons();
    if (weapons.length > 0) {
      if (weapons[0].magazine <= 0) {
        JACINTO_SOUNDS.needs_reload.play()
        return {
          success: false,
          alternative: null
        };
        // return {
        //   success: true,
        //   alternative: new Reload({
        //     game: this.game,
        //     actor: this.actor,
        //     energyCost: Constant.ENERGY_THRESHOLD,
        //   }),
        // };
      }
    }
    let particlePath = [];
    let particlePos = { x: this.actor.pos.x, y: this.actor.pos.y };
    let renderer = this.particleTemplate.renderer;
    this.targetPositions.forEach((targetPos) => {
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
