import { Base } from './Base';
export class PlaceItem extends Base {
  constructor({ targetPos, entity, processDelay = 25, ...args }) {
    super({ ...args });
    this.targetPos = targetPos;
    this.processDelay = processDelay;
    this.entity = entity;
  }
  perform() {
    let success = false;
    let alternative = null;
    if (this.game.canOccupyPosition(this.targetPos, this.entity)) {
      this.entity.pos = this.targetPos;
      success = this.game.placeActorOnMap(this.entity);
    }
    return {
      success,
      alternative,
    };
  }
}
;
