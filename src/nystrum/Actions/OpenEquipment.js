import { Base } from './Base';
import { UnequipItemToTile } from './UnequipItemToTile';
import { GoToPreviousKeymap } from './GoToPreviousKeymap';


export class OpenEquipment extends Base {
  constructor({ 
    ...args 
  }) {
    super({ ...args });
    this.processDelay = 0;
    this.energyCost = 0;
  }
  perform() {
    this.game.visibleEquipment = this.actor.equipment;

    const goToPreviousKeymap = new GoToPreviousKeymap({
      actor: this.actor,
      game: this.game,
    })

    let keymap = {
      Escape: () => goToPreviousKeymap,
    };

    this.actor.equipment.filter((slot) => slot.item).forEach((slot, index) => {
      keymap[index] = () => new UnequipItemToTile({
        item: slot.item,
        game: this.game,
        actor: this.actor,
        label: `Unequip ${slot.item.name}`,
        onSuccess: () => {
          this.game.visibleEquipment = null
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
