export const HasFaction = superclass => class extends superclass {
  constructor({ faction = null, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('HAS_FACTION');
    this.faction = faction;
  }
};
