import { Base } from './Base';
import { PrepareAreaStatusEffect } from './PrepareAreaStatusEffect';
import { GoToPreviousKeymap } from './GoToPreviousKeymap';
import * as Constant from '../constants';

export class OpenAvailableStatusEffects extends Base {
  constructor({ 
    ...args 
  }) {
    super({ ...args });
    this.processDelay = 0;
    this.energyCost = 0;
  }
  perform() {
    const goToPreviousKeymap = new GoToPreviousKeymap({
      actor: this.actor,
      game: this.game,
    })

    let keymap = {
      Escape: () => goToPreviousKeymap,
    };

    this.actor.getAvailableStatusEffects().forEach((effectClass, index) => {
      keymap[index] = () => new PrepareAreaStatusEffect({
        label: effectClass.displayName,
        game: this.game,
        actor: this.actor,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD * 1,
        effectClass,
        effectDefaults: {
          buffValue: 1,
          lifespan: Constant.ENERGY_THRESHOLD * 10,
          stepInterval: Constant.ENERGY_THRESHOLD,
          processDelay: 200
        },
      })
    })

    this.actor.setKeymap(keymap);
    return {
      success: true,
      alternative: null,
    };
  }
};
