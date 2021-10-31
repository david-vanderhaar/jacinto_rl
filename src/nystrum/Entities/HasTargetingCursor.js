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
      // hack for visual separation
      let lastPos = {x: null, y: null}
      let nudge = 0;
      // const nudgeInc = 0.2
      positions.forEach((position) => {
        // if (position.x == lastPos.x && position.y == lastPos.y) nudge += nudgeInc;
        // lastPos = {...position};
        const newAnimation = this.game.display.addAnimation(
          ANIMATION_TYPES.BLINK_BOX, 
          {
            x: position.x, 
            y: position.y + nudge, 
            color: THEMES.SOLARIZED.base3 
          }
        );
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

  moveCursorToPosition (position) {
    const currentPositions = this.getCursorPositions()
    const xDelta = position.x - currentPositions[0].x;
    const yDelta = position.y - currentPositions[0].y;
    const newPositons = currentPositions.map(
      (pos) => ({
        x: pos.x + xDelta,
        y: pos.y + yDelta
      })
    );
    this.setCursorPositions(newPositons);
    this.resetAnimations();
    return newPositons;
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

  updateCursorNode (index, args) {
    const anim = this.animations[index];
    args.forEach((arg) => {
      anim.node[arg.key](arg.value)
    })
  }

  updateAllCursorNodes (args) {
    this.getCursorPositions().forEach((pos, index) => {
      const anim = this.animations[index];
      args.forEach((arg) => {
        anim.node[arg.key](arg.value)
      })
    })
  }

  destroy() {
    this.removeAnimations();
    super.destroy();
  }
};
