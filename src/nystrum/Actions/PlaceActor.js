import { Base } from './Base';
import * as Helper from '../../helper';

export class PlaceActor extends Base {
  constructor({ targetPos, entity, interrupt = true, forcePlacement = false, ...args }) {
    super({ ...args });
    this.targetPos = targetPos;
    this.entity = entity;
    this.interrupt = interrupt;
    this.forcePlacement = forcePlacement;
  }
  perform() {
    let success = false;
    let alternative = null;
    // let canPlace = true;
    // if (!this.game.canOccupyPosition(this.targetPos, this.entity)) canPlace = false;
    // if (this.entity.entityTypes.includes('PARENT')) {
    //   this.entity.children.forEach((child) => {
    //     console.log(child.pos);
    //     if (!this.game.canOccupyPosition(child.pos, child)) canPlace = false;
    //   })
    // }
    // if (canPlace) {
    //   this.entity.pos = this.targetPos;
    //   this.game.engine.addActorAsPrevious(this.entity);
    //   this.game.engine.start(); // should this be used outside of engine?
    //   success = true;      
    // }
    let canOccupyPosition = this.forcePlacement ? true : this.game.canOccupyPosition(this.targetPos, this.entity);
    const tile = this.game.map[Helper.coordsToString(this.targetPos)];
    if (canOccupyPosition && tile) {
      this.entity.pos = this.targetPos;
      tile.entities.push(this.entity);
      // this.game.engine.addActorAsPrevious(this.entity);
      // this.game.engine.addActor(this.entity);
      this.game.engine.addActorAsNext(this.entity);
      // this.interrupt = true;
      // this.game.engine.start(); // BUGGED - should this be used outside of engine?
      success = true;
    }
    return {
      success,
      alternative,
    };
  }
}
;
