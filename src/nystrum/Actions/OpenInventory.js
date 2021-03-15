import { Base } from './Base';
import { EquipItemFromContainer } from './EquipItemFromContainer';
import { GoToPreviousKeymap } from './GoToPreviousKeymap';


export class OpenInventory extends Base {
  constructor({ 
    ...args 
  }) {
    super({ ...args });
    this.processDelay = 0;
    this.energyCost = 0;
  }
  perform() {
    this.game.visibleInventory = this.actor.container;

    const goToPreviousKeymap = new GoToPreviousKeymap({
      actor: this.actor,
      game: this.game,
    })

    let keymap = {
      Escape: () => goToPreviousKeymap,
    };

    this.actor.container.forEach((slot, index) => {
      const item = slot.items[0];
      keymap[index] = () => new EquipItemFromContainer({
        item,
        game: this.game,
        actor: this.actor,
        label: `Equip ${item.name}`,
        energyCost: 0,
        onSuccess: () => {
          this.game.visibleInventory = null
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
