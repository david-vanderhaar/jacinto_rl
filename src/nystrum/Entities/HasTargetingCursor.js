import { THEMES } from '../constants';
import { ANIMATION_TYPES } from '../Display/konvaCustom';

export const HasTargetingCursor = superclass => class extends superclass {
  constructor({...args}) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('HAS_TARGETING_CURSOR');
    this.cursorIsActive = false;
    this.cursorPositions = []; 
    this.animations = [];
    this.displayChanceText = false 
  }

  setCursorIsActive (active = true) {
    this.cursorIsActive = active;
  }

  activateCursor (positions, displayChanceText = false) {
    this.setDisplayChanceText(displayChanceText)
    this.setCursorPositions(positions);
    this.setCursorIsActive(true);
    this.resetAnimations();
  }

  deactivateCursor () {
    this.setCursorIsActive(false);
    this.removeAnimations();
  }

  setDisplayChanceText(value) {return this.displayChanceText = value}

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
        const boxAnimation = this.game.display.addAnimation(
          ANIMATION_TYPES.BLINK_BOX, 
          {
            x: position.x, 
            y: position.y, 
            color: THEMES.SOLARIZED.base3 
          }
        );
        this.animations.push(boxAnimation);

        if (this.displayChanceText) {
          const chance = this.getRangedAttackChance(position);
          const textAnimation = this.game.display.addAnimation(
            ANIMATION_TYPES.TEXT_OVERLAY, 
            {
              x: position.x, 
              y: position.y, 
              color: THEMES.SOLARIZED.base3,
              text: `${Math.round(chance * 100)}%`,
            }
          );
          
          this.animations.push(textAnimation);
        }
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
    if (!!!anim) return
    args.forEach((arg) => {
      anim.node[arg.key](arg.value)
    })
  }

  updateCursorNodeByPosition (position, args) {
    const {x, y} = position
    const anim = this.animations.find((node) => node.x === x && node.y === y)
    if (!!!anim) return
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
