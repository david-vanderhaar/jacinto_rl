import { Base } from './Base';
import { Say } from './Say';
import { Upgrade } from './Upgrade';
import { GoToPreviousKeymap } from './GoToPreviousKeymap';
import { UpgradeResource } from './ActionResources/UpgradeResource';

export class OpenUpgrades extends Base {
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

    this.actor.upgrade_tree.forEach((upgrade, index) => {
      keymap[index] = () => new Upgrade({
        // message: upgrade.name,
        upgrade,
        game: this.game,
        actor: this.actor,
        label: `${upgrade.name}`,
        energyCost: 0,
        requiredResources: [new UpgradeResource({getResourceCost: () => upgrade.cost })],
        onSuccess: () => {
          this.actor.setNextAction(goToPreviousKeymap);
        },
      });
    })

    this.actor.setKeymap(keymap);
    return {
      success: true,
      alternative: null,
    };
  }
};
