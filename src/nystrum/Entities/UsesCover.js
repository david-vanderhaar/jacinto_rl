import { ANIMATION_TYPES } from '../Display/konvaCustom';
import * as Helper from '../../helper';
export const UsesCover = superclass => class extends superclass {
  constructor({ ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('USES_COVER');
    this.coverAnimations = [];
    this.showCoverAnimations = true;
    this.coveredBy = [];
  }

  getCoveredByIds () {
    return this.coveredBy.map((entity) => entity.id);
  }

  setCoverAnimations () {
    // check neigbors
    if (!this.showCoverAnimations) return;
    const tiles = Helper.getNeighboringTiles(this.game.map, this.getPosition());
    let coverAnimated = false;
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
            coverAnimated = true;
            this.coveredBy.push(entity);
          }
        }
      }
    });
    if (coverAnimated) {
      //animate covered actor
      const position = this.getPosition();
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

  removeCoverAnimations () {
    if (this.coverAnimations.length) {
      this.coverAnimations.forEach((animation) => {
        this.game.display.removeAnimation(animation.id);
      })
      this.coverAnimations = [];
    }
  }

  removeCoveredBy () {
    this.coveredBy = [];
  }

  resetCoverAnimations() {
    this.removeCoverAnimations();
    this.removeCoveredBy();
    this.setCoverAnimations();
  }

  destroy() {
    this.showCoverAnimations = false;
    this.removeCoverAnimations();
    this.removeCoveredBy();
    super.destroy();
  }

};
