import { Base } from './Base';
import { PlaceActor } from './PlaceActor';
import { GoToPreviousKeymap } from './GoToPreviousKeymap';
import { TYPE } from '../items';
import { DIRECTIONS, ENERGY_THRESHOLD, THEMES } from '../constants';
import * as Helper from '../../helper';
import { PrepareDirectionalThrowInDirection } from './PrepareDirectionalThrowInDirection';

export class PrepareDirectionalThrow extends Base {
  constructor({ 
    passThroughEnergyCost = ENERGY_THRESHOLD, 
    passThroughRequiredResources = [],
    projectileType = TYPE.DIRECTIONAL_KUNAI,
    ...args 
  }) {
    super({ ...args });
    this.passThroughEnergyCost = passThroughEnergyCost;
    this.passThroughRequiredResources = passThroughRequiredResources;
    this.projectileType = projectileType;
    this.processDelay = 0;
    this.energyCost = 0;
  }
  perform() {
    const goToPreviousKeymap = new GoToPreviousKeymap({
      actor: this.actor,
      game: this.game,
      onAfter: () => this.actor.deactivateCursor(),
    })

    let keymap = {
      Escape: () => goToPreviousKeymap,
      w: () => new PrepareDirectionalThrowInDirection({
        label: `throw N?`,
        projectileType: this.projectileType,
        directionToPrepareThrow: 'N',
        activateKey: 'w',
        game: this.game,
        actor: this.actor,
        passThroughEnergyCost: this.passThroughEnergyCost,
        passThroughRequiredResources: this.passThroughRequiredResources,
      }),
      d: () => new PrepareDirectionalThrowInDirection({
        label: `throw E?`,
        projectileType: this.projectileType,
        directionToPrepareThrow: 'E',
        activateKey: 'd',
        game: this.game,
        actor: this.actor,
        passThroughEnergyCost: this.passThroughEnergyCost,
        passThroughRequiredResources: this.passThroughRequiredResources,
      }),
      s: () => new PrepareDirectionalThrowInDirection({
        label: `throw S?`,
        projectileType: this.projectileType,
        directionToPrepareThrow: 'S',
        activateKey: 's',
        game: this.game,
        actor: this.actor,
        passThroughEnergyCost: this.passThroughEnergyCost,
        passThroughRequiredResources: this.passThroughRequiredResources,
      }),
      a: () => new PrepareDirectionalThrowInDirection({
        label: `throw W?`,
        projectileType: this.projectileType,
        directionToPrepareThrow: 'W',
        activateKey: 'a',
        game: this.game,
        actor: this.actor,
        passThroughEnergyCost: this.passThroughEnergyCost,
        passThroughRequiredResources: this.passThroughRequiredResources,
      }),
    };
    this.actor.setKeymap(keymap);
    return {
      success: true,
      alternative: null,
    };
  }
};
