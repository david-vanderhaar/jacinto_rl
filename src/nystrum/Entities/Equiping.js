import SOUNDS from '../sounds';
import * as Constant from '../constants';

export const Equiping = superclass => class extends superclass {
  constructor({ equipment = Constant.EQUIPMENT_LAYOUTS.human(), ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('EQUIPING');
    this.equipment = equipment;
  }
  hasItemNameEquipped(itemName) {
    const equipment = this.equipment.filter((slot) => {
      if (slot.item) {
        if (slot.item.name === itemName) {
          return true;
        }
      }
      return false;
    });
    return equipment.length > 0;
  }
  getItemInSlot(slotName) {
    let openSlots = this.equipment.filter((slot) => {
      return (slot.item === null && slot.type === slotName);
    });
    if (openSlots.length > 0) {
      return false;
    }
    let slot = this.equipment.find((slot) => slot.type === slotName);
    if (!slot) {
      return false;
    }
    if (!slot.item) {
      return false;
    }
    return slot.item;
  }
  equip(slotName, item) {
    let foundSlot = false;
    this.equipment = this.equipment.map((slot) => {
      if (!foundSlot && slot.type === slotName && slot.item === null) {
        slot.item = item;
        foundSlot = true;
        SOUNDS.equip_1.play();
      }
      return slot;
    });
    return foundSlot;
  }
  unequip(item) {
    this.equipment = this.equipment.map((slot) => {
      if (slot.item) {
        if (slot.item.id === item.id) {
          slot.item = null;
          SOUNDS.equip_0.play();
        }
      }
      return slot;
    });
  }
};
