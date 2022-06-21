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

  getTargetsOnTile(tile) {
    return Helper.getDestructableEntities(tile.entities);
  }

  createEffects() {
    let effects = [];
    const targetPositions = this.actor.getCursorPositions();

    targetPositions.forEach((pos) => {
      let tile = this.actor.game.map[Helper.coordsToString(pos)];
      if (!!tile) {
        let targets = this.getTargetsOnTile(tile)
        // TODO: create alternat version that targets only allies/only enemies
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
    let range = 1;

    const animations = [];
    const deactivateAnimations = (anims) => anims.forEach((anim) => {
      this.game.display.removeAnimation(anim.id);
    })

    // const positionsInRange = Helper.getPositionsFromStructure(CLONE_PATTERNS.donut, pos)
    const positionsInRange = Helper.getPointsWithinRadius(pos, range);
    this.actor.activateCursor(positionsInRange)
    this.actor.updateAllCursorNodes([
      {key: 'fill', value: THEMES.JACINTO.cog1}, 
      {key: 'stroke', value: 'transparent'}, 
    ]);
    let targets = [];
    // positionsInRange.forEach((position) => {
    //   let tile = this.game.map[Helper.coordsToString(position)];
    //   if (tile) {
    //     // const validTargets = Helper.getDestructableEntities(tile.entities);
    //     const validTargets = tile.entities.filter((actor) => actor['faction'] === 'LOCUST');
    //     let newTarget = validTargets.length ? validTargets[0] : null;
    //     let animation = null;
    //     if (newTarget) {
    //       targets.push(newTarget);
    //       animation = this.game.display.addAnimation(
    //         this.game.display.animationTypes.BLINK_TILE,
    //         {
    //           x: position.x,
    //           y: position.y,
    //           color: THEMES.JACINTO.cog1
    //         }
    //       )
    //     } else {
    //       animation = this.game.display.addAnimation(
    //         this.game.display.animationTypes.BLINK_TILE,
    //         {
    //           x: position.x,
    //           y: position.y,
    //           color: THEMES.JACINTO.base1
    //         }
    //       )
    //     }
    //     animations.push(animation)
    //   }
    // })

    // let positions = [];

    // this.actor.activateCursor(positionsInRange);

    let keymap = {
      Escape: () => this.createGoToPreviousKeymapAction(),
      q: () => new Say({
        label: 'decrease',
        game: this.game,
        actor: this.actor,
        energyCost: 0,
        onSuccess: () => {
          range -= 1;
          this.actor.deactivateCursor();
          const positionsInRange = Helper.getPointsWithinRadius(pos, range);
          this.actor.activateCursor(positionsInRange)
          this.actor.updateAllCursorNodes([
            {key: 'fill', value: THEMES.JACINTO.cog1}, 
            {key: 'stroke', value: 'transparent'}, 
          ]);
        }
      }),
      e: () => new Say({
        label: 'increase',
        game: this.game,
        actor: this.actor,
        energyCost: 0,
        onSuccess: () => {
          range += 1;
          this.actor.deactivateCursor();
          const positionsInRange = Helper.getPointsWithinRadius(pos, range);
          this.actor.activateCursor(positionsInRange)
          this.actor.updateAllCursorNodes([
            {key: 'fill', value: THEMES.JACINTO.cog1}, 
            {key: 'stroke', value: 'transparent'}, 
          ]);
        }
      }),
      f: () => this.createAddStatusEffectsAction(),
    };
    this.actor.setKeymap(keymap);
    return {
      success: true,
      alternative: null,
    };
  }
};
