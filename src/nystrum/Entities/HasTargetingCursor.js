import * as Helper from '../../helper';
import { THEMES } from '../constants';
import { ANIMATION_TYPES } from '../Display/konvaCustom';

export const HasTargetingCursor = superclass => class extends superclass {
  constructor({...args}) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('HAS_TARGETING_CURSOR');
    this.cursorIsActive = false;
    this.cursorPositions = []; 
    this.animations = []; 
  }

  setCursorIsActive (active = true) {
    this.cursorIsActive = active;
  }

  activateCursor (positions) {
    this.setCursorPositions(positions);
    this.setCursorIsActive(true);
    this.resetAnimations();
  }

  deactivateCursor () {
    this.setCursorIsActive(false);
    this.removeAnimations();
  }

  getCursorPositions () {
    return this.cursorPositions;
  }

  setCursorPositions (positions) {
    this.cursorPositions = positions;
    return this.getCursorPositions();
  }

  addAnimations () {
    const positions = this.getCursorPositions();
    if (positions.length) {
      positions.forEach((position) => {
      const newAnimation = this.game.display.addAnimation(
        ANIMATION_TYPES.BLINK_TILE, 
        {
          x: position.x, 
          y: position.y, 
          color: THEMES.SOLARIZED.base3 
        })
        this.animations.push(newAnimation);
      })
    }
  }

  removeAnimations () {
    if (this.animations.length) {
      this.animations.forEach((animation) => this.game.display.removeAnimation(animation.id))
    }
    this.animations = [];
  }

  resetAnimations () {
    this.removeAnimations();
    this.addAnimations();
  }

  moveCursorInDirection (direction, distance = 1) {
    const newPositons = this.getCursorPositions().map(
      (pos) => ({
        x: pos.x + (direction[0] * distance),
        y: pos.y + (direction[1] * distance)
      })
    );
    this.setCursorPositions(newPositons);
    this.resetAnimations();
    return newPositons;
  }
};
