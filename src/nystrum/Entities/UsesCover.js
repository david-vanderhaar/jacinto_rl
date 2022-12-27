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

  isCovered () {
    return this.coveredBy.length;
  }

  getCoverEntities () {
    const keys = Object.keys(this.game.map);
    let coverEntities = []
    keys.forEach((key) => {
      const tile = this.game.map[key]
      const covers = tile.entities.filter((entity) => {
        const hasCovers = entity.entityTypes.includes('COVERING')
        return hasCovers;
      })
      coverEntities = [...coverEntities, ...covers];
    })
    return coverEntities;
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
              ANIMATION_TYPES.TEXT_OVERLAY,
              {
                x: position.x,
                y: position.y,
                color: this.renderer.color,
                text: '',
                isBlinking: true,
                textAttributes: {
                  fontFamily: 'scroll-o-script',
                  fontSize: this.game.display.tileWidth / 2
                }
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
          color: this.renderer.color
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
