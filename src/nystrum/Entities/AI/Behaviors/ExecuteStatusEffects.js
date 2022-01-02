import { AddStatusEffect } from '../../../Actions/AddStatusEffect';
import Behavior from './Behavior';
import { AddStatusEffects } from '../../../Actions/AddStatusEffects';
import * as Helper from '../../../../helper';

export default class ExecuteStatusEffects extends Behavior {
  constructor({ effectClass, effectDefaults = {}, ...args }) {
    super({ ...args });
    this.effectClass = effectClass;
    this.effectDefaults = effectDefaults;
  }

  isValid () {
    return this.actor.getCursorPositions().length
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

  constructActionClassAndParams () {
    const effects = this.createEffects();

    return [
      AddStatusEffects,
      {
        effects,
        onAfter: () => this.actor.removeAnimations()
      }
    ]
  }
}
