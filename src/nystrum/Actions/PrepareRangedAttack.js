import { Base } from './Base';
import { MoveRangedAttackCursor } from './MoveRangedAttackCursor';
import { MultiTargetRangedAttack } from './MultiTargetRangedAttack';
import { GoToPreviousKeymap } from './GoToPreviousKeymap';
import { DIRECTIONS, ENERGY_THRESHOLD, THEMES, CLONE_PATTERNS } from '../constants';
import * as Helper from '../../helper';

export class PrepareRangedAttack extends Base {
  constructor({ 
    passThroughEnergyCost = ENERGY_THRESHOLD, 
    passThroughRequiredResources = [], 
    ...args 
  }) {
    super({ ...args });
    this.passThroughEnergyCost = passThroughEnergyCost;
    this.passThroughRequiredResources = passThroughRequiredResources;
    this.processDelay = 0;
    this.energyCost = 0;
  }

  perform() {
    const pos = this.actor.getPosition();
    const positions = [{...pos}]
    // const positions = Helper.getPositionsFromStructure(CLONE_PATTERNS.smallSquare, pos)
    this.actor.activateCursor(positions)

    const pathAnimations = [];
    const deactivatePathAnimations = () => pathAnimations.forEach((anim) => {
      this.game.display.removeAnimation(anim.id);
    })

    const goToPreviousKeymap = new GoToPreviousKeymap({
      actor: this.actor,
      game: this.game,
      onAfter: () => {
        this.actor.deactivateCursor()
        deactivatePathAnimations()
      },
    })

    let keymap = {
      Escape: () => goToPreviousKeymap,
      
      w: () => { 
        return new MoveRangedAttackCursor({
          actor: this.actor,
          game: this.game,
          label: 'move N',
          direction: DIRECTIONS.N,
          range: 4,
          onSuccess: () => {
            pathAnimations.forEach((anim) => {
              this.game.display.removeAnimation(anim.id);
            })
            const initiatedFrom = pos;
            const path = Helper.calculateStraightPath(initiatedFrom, this.actor.getCursorPositions()[0]);
            path.slice(1).forEach((pathPos) => {
              const animation = this.game.display.addAnimation(1, { x: pathPos.x, y: pathPos.y, color: THEMES.SOLARIZED.base3 })
              pathAnimations.push(animation);
            })
          }
        })
      },
      a: () => { 
        return new MoveRangedAttackCursor({
          actor: this.actor,
          game: this.game,
          label: 'move W',
          direction: DIRECTIONS.W,
          range: 4,
          onSuccess: () => {
            pathAnimations.forEach((anim) => {
              this.game.display.removeAnimation(anim.id);
            })
            const initiatedFrom = pos;
            const path = Helper.calculateStraightPath(initiatedFrom, this.actor.getCursorPositions()[0]);
            path.slice(1).forEach((pathPos) => {
              const animation = this.game.display.addAnimation(1, { x: pathPos.x, y: pathPos.y, color: THEMES.SOLARIZED.base3 })
              pathAnimations.push(animation);
            })
          }
        })
      },
      s: () => { 
        return new MoveRangedAttackCursor({
          actor: this.actor,
          game: this.game,
          label: 'move S',
          direction: DIRECTIONS.S,
          range: 4,
          onSuccess: () => {
            pathAnimations.forEach((anim) => {
              this.game.display.removeAnimation(anim.id);
            })
            const initiatedFrom = pos;
            const path = Helper.calculateStraightPath(initiatedFrom, this.actor.getCursorPositions()[0]);
            path.slice(1).forEach((pathPos) => {
              const animation = this.game.display.addAnimation(1, { x: pathPos.x, y: pathPos.y, color: THEMES.SOLARIZED.base3 })
              pathAnimations.push(animation);
            })
          }
        })
      },
      d: () => { 
        return new MoveRangedAttackCursor({
          actor: this.actor,
          game: this.game,
          label: 'move E',
          direction: DIRECTIONS.E,
          range: 4,
          onSuccess: () => {
            pathAnimations.forEach((anim) => {
              this.game.display.removeAnimation(anim.id);
            })
            const initiatedFrom = pos;
            const path = Helper.calculateStraightPath(initiatedFrom, this.actor.getCursorPositions()[0]);
            path.slice(1).forEach((pathPos) => {
              const animation = this.game.display.addAnimation(1, { x: pathPos.x, y: pathPos.y, color: THEMES.SOLARIZED.base3 })
              pathAnimations.push(animation);
            })
          }
        })
      },
      r: () => { 
        return new MultiTargetRangedAttack({
          targetPositions:  [...this.actor.getCursorPositions()],
          game: this.game,
          actor: this.actor,
          energyCost: this.passThroughEnergyCost,
          requiredResources: this.passThroughRequiredResources,
          onSuccess: () => {
            this.actor.deactivateCursor();
            deactivatePathAnimations();
            this.actor.setNextAction(goToPreviousKeymap);
          }
        })
      },
    };
    this.actor.setKeymap(keymap);
    return {
      success: true,
      alternative: null,
    };
  }
};
