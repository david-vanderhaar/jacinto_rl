import * as Constant from '../../constants';
import { UI_Actor } from '../../Entities/index';
import { DropItem } from "../../Actions/DropItem";
import { addAlphabeticallyToKeymap, deactivateUIKeymap } from '../helper';

const keymapDropFromInventory = (engine, initiatedBy) => {
  let keymap = {
    Escape: {
      // g: {
      activate: () => deactivateUIKeymap(engine, 'visibleInventory'),
      label: 'Close',
    }
  };

  initiatedBy.container.map((slot, index) => {
    const item = slot.items[0];
    let obj = {
      activate: null,
      label: ''
    }
    obj['activate'] = () => {
      console.log(`setting action for ${initiatedBy.name} to drop ${item.name}`);
      initiatedBy.setNextAction(new DropItem({
        item,
        game: engine.game,
        actor: initiatedBy,
        energyCost: Constant.ENERGY_THRESHOLD
      }));
      deactivateUIKeymap(engine, 'visibleInventory');
    }
    obj['label'] = `Drop ${item.name}`;
    addAlphabeticallyToKeymap(keymap, obj);
    return true;
  })

  return keymap;
}

export const activateDropItem = (engine) => {
  let currentActor = engine.actors[engine.currentActor]
  engine.game.visibleInventory = currentActor.container;

  let ui = new UI_Actor({
    initiatedBy: currentActor,
    pos: { ...currentActor.pos },
    renderer: {
      character: 'D',
      color: 'white',
      background: '',
    },
    name: 'Drop',
    game: engine.game,
  })
  engine.addActorAsPrevious(ui);
  engine.game.placeActorOnMap(ui)
  engine.game.draw()
  ui.keymap = keymapDropFromInventory(engine, currentActor);
}