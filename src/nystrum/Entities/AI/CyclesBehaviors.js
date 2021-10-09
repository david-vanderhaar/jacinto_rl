import Behavior from './Behaviors/Behavior';


export const CyclesBehaviors = superclass => class extends superclass {
  constructor({ behaviorClasses = [Behavior], ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('CYCLES_BEHAVIORS');
    this.behaviors = behaviorClasses.map((behaviorClass) => new behaviorClass({actor: this}));
    this.activeBehaviorIndex = 0;
  }

  getActiveBehavior() {
    return this.behaviors[this.activeBehaviorIndex]
  }

  selectNextBehavior() {
    this.activeBehaviorIndex = (this.activeBehaviorIndex + 1) % this.behaviors.length;
  }

  getAction() {
    const behavior = this.getActiveBehavior();
    this.selectNextBehavior();
    return behavior.getAction();
  }
};
