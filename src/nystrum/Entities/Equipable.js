import * as Constant from '../constants';

export const Equipable = superclass => class extends superclass {
  constructor({ name = 'nameless', equipmentType = Constant.EQUIPMENT_TYPES.HAND, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('EQUIPABLE');
    this.name = name;
    this.equipmentType = equipmentType;
  }
};
