import { UnequipItemToTile } from "../../Actions/UnequipItemToTile";
import { UnequipItem } from "../../Actions/UnequipItem";
import { UI_Actor } from '../../Entities/index';
import { addAlphabeticallyToKeymap, deactivateUIKeymap } from '../helper';

const keymapEquipment = (engine, initiatedBy) => {
  let keymap = {
    Escape: {
      activate: () => deactivateUIKeymap(engine, 'visibleEquipment'),
      label: 'Close',
    }
  };

  initiatedBy.equipment.filter((slot) => slot.item).map((slot) => {
    let obj = {
      activate: null,
      label: ''
    }
    obj['activate'] = () => {
      initiatedBy.setNextAction(new UnequipItemToTile({
        item: slot.item,
        game: engine.game,
        actor: initiatedBy,
      }))
      deactivateUIKeymap(engine, 'visibleEquipment');
    }
    obj['label'] = `Unequip ${slot.item.name}`;
    addAlphabeticallyToKeymap(keymap, obj);
    return true;
  })

  return keymap;
}

export const activateEquipment = (engine) => {
  let currentActor = engine.actors[engine.currentActor]
  engine.game.visibleEquipment = currentActor.equipment;

  let ui = new UI_Actor({
    initiatedBy: currentActor,
    pos: { ...currentActor.pos },
    renderer: {
      character: 'E',
      color: 'white',
      background: '',
    },
    name: 'Equipment',
    game: engine.game,
  })
  engine.addActorAsPrevious(ui);
  engine.game.placeActorOnMap(ui)
  engine.game.draw()
  ui.keymap = keymapEquipment(engine, currentActor);
}