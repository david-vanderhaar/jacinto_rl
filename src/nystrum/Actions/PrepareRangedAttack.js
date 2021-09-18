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
        const animation = this.game.display.addAnimation(this.game.display.animationTypes.BLINK_TILE, { x: pathPos.x, y: pathPos.y, color: THEMES.SOLARIZED.base3 })
        pathAnimations.push(animation);
      }
    })

    // modifying target curso color based on change to hit
    cursorPositions.forEach((pos, i) => {
      const chance = this.actor.getRangedAttackChance(pos);
      if (chance <= 0) {
        this.actor.updateCursoNode(i, [
          {key: 'fill', value: 'transparent'}, 
          {key: 'stroke', value: 'white'}, 
        ]);
      }
      if (chance > 0 && chance <= 0.5) {
        this.actor.updateCursoNode(i, [
          {key: 'fill', value: THEMES.SOLARIZED.red}, 
          {key: 'stroke', value: 'transparent'}, 
        ]);
      }
      if (chance > 0.5 && chance <= 0.7) {
        this.actor.updateCursoNode(i, [
          {key: 'fill', value: THEMES.SOLARIZED.yellow}, 
          {key: 'stroke', value: 'transparent'}, 
        ]);
      }
      if (chance >= 0.7) {
        this.actor.updateCursoNode(i, [
          {key: 'fill', value: THEMES.SOLARIZED.green}, 
          {key: 'stroke', value: 'transparent'}, 
        ]);
      }
    })
  }

  perform() {
    const pos = this.actor.getPosition();
    const range = this.actor.getAttackRange();
    const equippedWeapon = this.actor.getItemInSlot(EQUIPMENT_TYPES.HAND)

    const pathAnimations = [];
    const rangeAnims = []
    const deactivateAnimations = (anims) => anims.forEach((anim) => {
      this.game.display.removeAnimation(anim.id);
    })

    const positionsInRange = Helper.getPointsWithinRadius(pos, range);

    let targets = [];
    let targetIndex = 0;
    positionsInRange.forEach((position) => {
      // rangeAnims.push(this.game.display.addAnimation(1, {
      //   x: position.x,
      //   y: position.y,
      //   color: THEMES.SOLARIZED.blue
      // }))
      let tile = this.game.map[Helper.coordsToString(position)];
      if (tile) {
        // const validTargets = Helper.getDestructableEntities(tile.entities);
        const validTargets = tile.entities.filter((actor) => actor['faction'] === 'LOCUST');
        let newTarget = validTargets.length ? validTargets[0] : null;
        if (newTarget) {
          targets.push(newTarget);
        }
      }
    })

    let positions = [];
    if (targets.length) {
      positions.push(targets[0].getPosition());
      if (targets.length > 1) targetIndex = 1;
    } else {
      positions.push({...pos})
    }

    if (equippedWeapon) positions = equippedWeapon.getPositionsInShape(positions[0]);

    this.actor.activateCursor(positions);
    this.updateCursors(pathAnimations, pos);

    const goToPreviousKeymap = new GoToPreviousKeymap({
      actor: this.actor,
      game: this.game,
      onAfter: () => {
        this.actor.deactivateCursor()
        deactivateAnimations(pathAnimations)
        deactivateAnimations(rangeAnims)
      },
    })

    let keymap = {
      Escape: () => goToPreviousKeymap,
      
      e: () => { 
        return new MoveRangedAttackCursor({
          actor: this.actor,
          game: this.game,
          label: 'Next Target',
          targetPos: targets.length ? targets[targetIndex].getPosition() : null,
          range,
          availablePositions: positionsInRange,
          onSuccess: () => {
            targetIndex = (targetIndex + 1) % targets.length;
            this.updateCursors(pathAnimations, pos);
          },
        })
      },
      q: () => { 
        return new MoveRangedAttackCursor({
          actor: this.actor,
          game: this.game,
          label: 'Previous Target',
          targetPos: targets.length ? targets[targetIndex].getPosition() : null,
          range,
          availablePositions: positionsInRange,
          onSuccess: () => {
            if (targetIndex === 0) {
              targetIndex = targets.length - 1
            } else {
              targetIndex -= 1
            }
            this.updateCursors(pathAnimations, pos);
          }
        })
      },
      w: () => { 
        return new MoveRangedAttackCursor({
          actor: this.actor,
          game: this.game,
          label: 'move N',
          direction: DIRECTIONS.N,
          range,
          availablePositions: positionsInRange,
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
          availablePositions: positionsInRange,
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
          availablePositions: positionsInRange,
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
          availablePositions: positionsInRange,
          onSuccess: () => {
            this.updateCursors(pathAnimations, pos);
          }
        })
      },
      f: () => { 
        return new MultiTargetRangedAttack({
          label: 'Fire',
          targetPositions:  [...this.actor.getCursorPositions()],
          game: this.game,
          actor: this.actor,
          energyCost: this.passThroughEnergyCost,
          requiredResources: this.passThroughRequiredResources,
          onSuccess: () => {
            this.actor.deactivateCursor();
            deactivateAnimations(pathAnimations);
            deactivateAnimations(rangeAnims);
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
