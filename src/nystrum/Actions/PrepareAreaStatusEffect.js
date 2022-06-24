import { Base } from './Base';
import { MultiTargetRangedAttack } from './MultiTargetRangedAttack';
import { AddStatusEffects } from './AddStatusEffects';
import { GoToPreviousKeymap } from './GoToPreviousKeymap';
import { DIRECTIONS, ENERGY_THRESHOLD, THEMES, EQUIPMENT_TYPES, CLONE_PATTERNS } from '../constants';
import * as Helper from '../../helper';
import { Say } from './Say';

export class PrepareAreaStatusEffect extends Base {
  constructor({ 
    passThroughEnergyCost = ENERGY_THRESHOLD, 
    passThroughRequiredResources = [],
    effectClass,
    effectDefaults = {},
    ...args 
  }) {
    super({ ...args });
    this.passThroughEnergyCost = passThroughEnergyCost;
    this.passThroughRequiredResources = passThroughRequiredResources;
    this.effectClass = effectClass;
    this.effectDefaults = effectDefaults;
    this.processDelay = 0;
    this.energyCost = 0;
  }

  getValidTargetsOnTile(tile) {
    return Helper.getDestructableEntities(tile.entities).filter((entity) => this.actor.id !== entity.id && this.actor.isAlly(entity));
  }

  createEffects() {
    let effects = [];
    const targetPositions = this.actor.getCursorPositions();

    targetPositions.forEach((pos) => {
      let tile = this.actor.game.map[Helper.coordsToString(pos)];
      if (!!tile) {
        let targets = this.getValidTargetsOnTile(tile)
        targets.forEach((target) => {
          const newEffect = new this.effectClass({
            ...this.effectDefaults,
            actor: target,
            game: this.actor.game,
          });

          effects.push(newEffect);
        });
      }
    });

    return effects;
  }

  createAddStatusEffectsAction () {
    const effects = this.createEffects();
    return new AddStatusEffects({
      label: 'Activate',
      effects,
      game: this.game,
      actor: this.actor,
      energyCost: this.passThroughEnergyCost,
      requiredResources: this.passThroughRequiredResources,
      onSuccess: () => this.actor.setNextAction(this.createGoToPreviousKeymapAction()),
      // onAfter: () => this.actor.removeAnimations(),
    });
  }

  createGoToPreviousKeymapAction () {
    return new GoToPreviousKeymap({
      actor: this.actor,
      game: this.game,
      onAfter: () => {
        this.actor.deactivateCursor()
      },
    })
  }

  perform() {
    const pos = this.actor.getPosition();
    // const range = this.actor.getAttackRange();
    let range = this.actor.getStatusEffectRange();
    const positionsInRange = Helper.getPointsWithinRadius(pos, range);
    this.actor.activateCursor(positionsInRange)
    positionsInRange.forEach((position, index) => {
      let tile = this.game.map[Helper.coordsToString(position)];
      if (tile) {
        const validTargets = this.getValidTargetsOnTile(tile);
        let newTarget = validTargets.length ? validTargets[0] : null;
        if (newTarget) {
          this.actor.updateCursorNode(
            index,
            [
              {key: 'fill', value: THEMES.JACINTO.cog1}, 
              {key: 'stroke', value: 'transparent'}, 
            ]
          );
        }
      }
    })

    let keymap = {
      Escape: () => this.createGoToPreviousKeymapAction(),
      b: () => this.createAddStatusEffectsAction(),
      q: () => new Say({
        label: 'decrease',
        game: this.game,
        actor: this.actor,
        energyCost: 0,
        onSuccess: () => {
          this.actor.decreaseStatusEffectRange(1)
          const range = this.actor.getStatusEffectRange()
          this.actor.deactivateCursor();
          const positionsInRange = Helper.getPointsWithinRadius(pos, range);
          this.actor.activateCursor(positionsInRange)
        }
      }),
      e: () => new Say({
        label: 'increase',
        game: this.game,
        actor: this.actor,
        energyCost: 0,
        onSuccess: () => {
          this.actor.increaseStatusEffectRange(1)
          const range = this.actor.getStatusEffectRange()
          this.actor.deactivateCursor();
          const positionsInRange = Helper.getPointsWithinRadius(pos, range);
          this.actor.activateCursor(positionsInRange)
        }
      }),
    };
    this.actor.setKeymap(keymap);
    return {
      success: true,
      alternative: null,
    };
  }
};
