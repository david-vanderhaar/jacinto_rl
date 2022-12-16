import { Say } from '../../../Actions/Say';
import * as Helper from '../../../../helper';
import {CLONE_PATTERNS} from '../../../constants';
import {COLORS} from '../../../Modes/Jacinto/theme';
import Behavior from './Behavior';

export default class Telegraph extends Behavior {
  constructor({ attackPattern = CLONE_PATTERNS.point, color = COLORS.red, ...args }) {
    super({ ...args });
    this.attackPattern = attackPattern;
    this.color = color;
    this.chainOnSuccess = true;
  }

  isValid () {
    let valid = false
    // check if actor is next to enemy
    const positions = Helper.getPositionsFromStructure(this.attackPattern, this.getTargetPosition());
    positions.forEach((pos) => {
      let tile = this.actor.game.map[Helper.coordsToString(pos)];
      if (tile) {
        let targets = Helper.getDestructableEntities(tile.entities);
        targets.forEach((target) => {
          if (this.actor.isEnemy(target)) {
            valid = true
          }
        })
      }
      })
    return valid
  }

  getTargetPosition () {
    return this.actor.getPosition();
  }

  constructActionClassAndParams () {
    // pick one or more tiles to target with attack or action via attackPattern class (random, fixed)
    const positions = Helper.getPositionsFromStructure(this.attackPattern, this.getTargetPosition());
    // add blink animations or particle animation to targeted tiles
    this.actor.activateCursor(positions);
    this.actor.updateAllCursorNodes([
      {key: 'fill', value: this.color}, 
      {key: 'stroke', value: 'transparent'}, 
    ]);
    // (or add telegraph entities to map?)
    // or produce and insert Execute behavior based on attack pattern?
    // return None action
    return [
      Say,
      {
        message: 'I am telegraphing my next attack',
        processDelay: 500,
      }
    ]
  }
}
