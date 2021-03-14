import { Base } from './Base';
import { MoveRangedAttackCursor } from './MoveRangedAttackCursor';
import { MultiTargetRangedAttack } from './MultiTargetRangedAttack';
import { GoToPreviousKeymap } from './GoToPreviousKeymap';
import { DIRECTIONS, ENERGY_THRESHOLD, THEMES, EQUIPMENT_TYPES } from '../constants';
import * as Helper from '../../helper';
import {find} from 'lodash';

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

  updateCursors(pathAnimations, initiatedFrom) {
    const cursorPositions = this.actor.getCursorPositions();
    const path = Helper.calculateStraightPath(initiatedFrom, this.actor.getCursorPositions()[0]);
    // removing visible path from last action
    pathAnimations.forEach((anim) => {
      this.game.display.removeAnimation(anim.id);
    })
    
    // adding visible path to new cursor position
    path.slice(1).forEach((pathPos) => {
      if (!find(cursorPositions, {x: pathPos.x, y: pathPos.y})) {
        const animation = this.game.display.addAnimation(1, { x: pathPos.x, y: pathPos.y, color: THEMES.SOLARIZED.base3 })
        pathAnimations.push(animation);
      }
    })

    // modifying target curso color based on change to hit
    cursorPositions.forEach((pos, i) => {
      const chance = this.actor.getRangedAttackChance(pos);
      if (chance <= 0) {
        this.actor.changeCursorColor(i, 'transparent');
      }
      if (chance > 0 && chance <= 0.5) {
        this.actor.changeCursorColor(i, THEMES.SOLARIZED.red);
      }
      if (chance > 0.5 && chance <= 0.7) {
        this.actor.changeCursorColor(i, THEMES.SOLARIZED.yellow);
      }
      if (chance >= 0.7) {
        this.actor.changeCursorColor(i, THEMES.SOLARIZED.green);
      }
    })
  }

  perform() {
    const pos = this.actor.getPosition();
    const range = this.actor.getAttackRange();
    const equippedWeapon = this.actor.getItemInSlot(EQUIPMENT_TYPES.HAND)
    let positions = [{ ...pos }];
    if (equippedWeapon) positions = equippedWeapon.getPositionsInShape(pos);

    const pathAnimations = [];
    const deactivatePathAnimations = () => pathAnimations.forEach((anim) => {
      this.game.display.removeAnimation(anim.id);
    })

    this.actor.activateCursor(positions);
    this.updateCursors(pathAnimations, pos);

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
          range,
          onSuccess: () => {
            this.updateCursors(pathAnimations, pos);
          }
        })
      },
      a: () => { 
        return new MoveRangedAttackCursor({
          actor: this.actor,
          game: this.game,
          label: 'move W',
          direction: DIRECTIONS.W,
          range,
          onSuccess: () => {
            this.updateCursors(pathAnimations, pos);
          }
        })
      },
      s: () => { 
        return new MoveRangedAttackCursor({
          actor: this.actor,
          game: this.game,
          label: 'move S',
          direction: DIRECTIONS.S,
          range,
          onSuccess: () => {
            this.updateCursors(pathAnimations, pos);
          }
        })
      },
      d: () => { 
        return new MoveRangedAttackCursor({
          actor: this.actor,
          game: this.game,
          label: 'move E',
          direction: DIRECTIONS.E,
          range,
          onSuccess: () => {
            this.updateCursors(pathAnimations, pos);
          }
        })
      },
      t: () => { 
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
