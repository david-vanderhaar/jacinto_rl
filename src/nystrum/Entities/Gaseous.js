import uuid from 'uuid/v1';
import { cloneDeep, cloneDeepWith } from 'lodash';
import * as Constant from '../constants';

export const Gaseous = superclass => class extends superclass {
  constructor({ isClone = false, cloneCount = 0, clonePattern = Constant.CLONE_PATTERNS.square, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('GASEOUS');
    this.isClone = isClone;
    this.cloneCount = cloneCount;
    this.clonePattern = cloneDeep(clonePattern);
  }
  getAction(game) {
    let offset = this.clonePattern.positions.find((pos) => !pos.taken);
    if (!this.isClone && offset) {
      offset.taken = true;
      let clone = cloneDeepWith(this, (value, key) => {
        switch (key) {
          case 'id':
          case 'game':
          case 'engine':
          case 'clones':
            return null;
          default:
            return undefined;
        }
      });
      clone.game = game;
      clone.id = uuid();
      if (this.hasOwnProperty('pos')) {
        let referencePos = this.pos;
        clone.pos = {
          x: referencePos.x + offset.x,
          y: referencePos.y + offset.y
        };
      }
      if (clone.hasOwnProperty('path')) {
        clone.path = clone.path.map((pos) => {
          return {
            x: pos.x + offset.x,
            y: pos.y + offset.y
          };
        });
      }
      clone.isClone = true;
      this.cloneCount += 1;
      game.placeActorOnMap(clone);
      game.engine.addActor(clone);
      game.draw();
    }
    let result = super.getAction(game);
    return result;
  }
};
