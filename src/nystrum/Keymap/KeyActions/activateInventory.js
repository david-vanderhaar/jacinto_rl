import { UI_Actor } from '../../Entities/index';
import { EquipItemFromContainer } from "../../Actions/EquipItemFromContainer";
import { addAlphabeticallyToKeymap, deactivateUIKeymap } from '../helper';

const keymapEquipFromInventory = (engine, initiatedBy) => {
  let keymap = {
    Escape: {
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
      console.log(`setting action for ${initiatedBy.name} to equip ${item.name}`);
      initiatedBy.setNextAction(new EquipItemFromContainer({
        item,
        game: engine.game,
        actor: initiatedBy,
      }))
      deactivateUIKeymap(engine, 'visibleInventory');
    }
    obj['label'] = `Equip ${item.name}`;
    addAlphabeticallyToKeymap(keymap, obj);
    return true;
  })

  return keymap;
}

export const activateInventory = (engine) => {
  let currentActor = engine.actors[engine.currentActor]
  engine.game.visibleInventory = currentActor.container;

  let ui = new UI_Actor({
    initiatedBy: currentActor,
    pos: { ...currentActor.pos },
    renderer: {
      character: 'I',
      color: 'white',
      background: '',
    },
    name: 'Inventory',
    game: engine.game,
    // keymap: keymapEquipFromInventory(engine, currentActor),
  })
  engine.addActorAsPrevious(ui);
  engine.game.placeActorOnMap(ui)
  engine.game.draw()
  ui.keymap = keymapEquipFromInventory(engine, currentActor);
}