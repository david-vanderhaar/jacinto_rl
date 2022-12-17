export const HasPickupEffects = superclass => class extends superclass {
  constructor({
    pickupEffects = [],
    dropEffects= [],
    ...args
  }) {
    super({ ...args });
    this.pickupEffects = pickupEffects;
    this.dropEffects = dropEffects;
    this.entityTypes = this.entityTypes.concat('HAS_PICKUP_EFFECTS');
  }

  processPickupEffects(actor) {
    this.pickupEffects.forEach((effect) => effect(actor, this))
  }
};
