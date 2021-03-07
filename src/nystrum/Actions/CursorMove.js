import { Base } from './Base';
import * as Helper from '../../helper';

export class CursorMove extends Base {
  constructor({ targetPos, processDelay = 0, ...args }) {
    super({ ...args });
    this.targetPos = targetPos;
    this.processDelay = processDelay;
  }
  perform() {
    let success = false;
    let alternative = null;
    const initiatedFrom = this.actor.initiatedBy.pos;
    const path = Helper.calculatePath(this.game, this.targetPos, initiatedFrom, 8);
    const isInRange = this.actor.range ? path.length <= this.actor.range : true;
    if (isInRange && this.game.cursorCanOccupyPosition(this.targetPos)) {
      let tile = this.game.map[Helper.coordsToString(this.actor.pos)];
      this.game.map[Helper.coordsToString(this.actor.pos)] = { ...tile, entities: tile.entities.filter((e) => e.id !== this.actor.id) };
      this.actor.pos = this.targetPos;
      this.game.map[Helper.coordsToString(this.targetPos)].entities.push(this.actor);
      success = true;
    }
    return {
      success,
      alternative,
    };
  }
}
;
