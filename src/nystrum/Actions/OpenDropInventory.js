import { Base } from './Base';
import { DropItem } from './DropItem';
import { GoToPreviousKeymap } from './GoToPreviousKeymap';


export class OpenDropInventory extends Base {
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
      keymap[index] = () => new DropItem({
        item,
        game: this.game,
        actor: this.actor,
        label: `Drop ${item.name}`,
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
