import { MESSAGE_TYPE } from '../message';
import { TYPE as ITEM_TYPES } from '../items';
import SOUNDS from '../sounds';
import { Base } from './Base';
import * as Helper from '../../helper';
import * as Constant from '../constants';

export class SprayWater extends Base {
  constructor({ targetPos, radius = 1, ...args }) {
    super({ ...args });
    this.targetPos = targetPos;
    this.radius = radius;
    this.particleTemplate = Constant.PARTICLE_TEMPLATES.water;
  }
  perform() {
    if (!this.actor.hasItemNameEquipped(ITEM_TYPES.WATER_GUN)) {
      this.game.addMessage(`${this.actor.name} doesn't have a ${ITEM_TYPES.WATER_GUN}.`, MESSAGE_TYPE.ERROR);
      return {
        success: false,
        alternative: null,
      };
    }
    let structure = {
      x_offset: 0,
      y_offset: 0,
      positions: Array(this.radius).fill('').reduce((acc, curr, i) => {
        return acc.concat(...Helper.getPointsOnCircumference(0, 0, i + 1));
      }, [])
    };
    const positions = structure.positions.map((slot) => {
      return {
        x: this.targetPos.x + slot.x + structure.x_offset,
        y: this.targetPos.y + slot.y + structure.y_offset
      };
    }).concat({ ...this.targetPos });
    positions.forEach((position) => {
      const tile = this.game.map[Helper.coordsToString(position)];
      if (tile) {
        if (tile.type === 'BURNT')
          tile.type = 'GROUND';
        if (tile.type === 'FLOOR')
          tile.type = 'WET';
      }
    });
    // adding particles
    positions.forEach((pos) => {
      this.addParticle(3, { ...pos }, {
        x: Math.sign(pos.x - this.targetPos.x),
        y: Math.sign(pos.y - this.targetPos.y)
      });
    });
    // sounds
    const sound = Helper.getRandomInArray([SOUNDS.water_0, SOUNDS.water_1]);
    sound.play();
    this.actor.energy -= this.energyCost;
    return {
      success: true,
      alternative: null,
    };
  }
}
;
