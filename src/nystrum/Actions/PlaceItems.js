import { cloneDeep } from 'lodash';
import uuid from 'uuid/v1';
import { PlaceItem } from './PlaceItem';
export class PlaceItems extends PlaceItem {
  constructor({ targetPositions = [], ...args }) {
    super({ ...args });
    this.targetPositions = targetPositions;
  }
  perform() {
    let success = false;
    let alternative = null;
    this.targetPositions.forEach((targetPos) => {
      if (this.game.canOccupyPosition(targetPos, this.entity)) {
        let clone = cloneDeep(this.entity);
        clone.game = this.game;
        clone.id = uuid();
        clone.pos = targetPos;
        let placementSuccess = this.game.placeActorOnMap(clone);
        if (placementSuccess)
          success = true;
      }
    });
    return {
      success,
      alternative,
    };
  }
}
;
