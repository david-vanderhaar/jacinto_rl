import { ANIMATION_TYPES } from '../Display/konvaCustom';
import * as Helper from '../../helper';
export const UsesCover = superclass => class extends superclass {
  constructor({ ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('USES_COVER');
    this.coverAnimations = [];
  }

  setCoverAnimations () {
    // check neigbors
    const tiles = Helper.getNeighboringTiles(this.game.map, this.getPosition());
    tiles.forEach((tile) => {
      if (tile.entities.length) {
        const entity = tile.entities[0];
        if (entity.entityTypes.includes('COVERING')) {
          if (entity.isProvidingCover()) {
            const position = entity.getPosition();
            const newAnimation = this.game.display.addAnimation(
              ANIMATION_TYPES.BLINK_BOX,
              {
                x: position.x,
                y: position.y,
                color: '#3e7dc9'
              }
            );
            this.coverAnimations.push(newAnimation);
          }
        }
      }
    });
  }

  removeCoverAnimations () {
    if (this.coverAnimations.length) {
      this.coverAnimations.forEach((animation) => {
        this.game.display.removeAnimation(animation.id);
      })
      this.coverAnimations = [];
    }
  }

  resetCoverAnimations() {
    this.removeCoverAnimations();
    this.setCoverAnimations();
  }

};
