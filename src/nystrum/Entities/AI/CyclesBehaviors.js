import Behavior from './Behaviors/Behavior';
import { Say } from '../../Actions/Say';
import * as Constant from '../../constants';


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

  getDefaultAction() {
    return new Say({
      message: '*whistles*',
      game: this.game,
      actor: this,
      energyCost: Constant.ENERGY_THRESHOLD
    });
  }

  selectNextBehavior() {
    this.activeBehaviorIndex = (this.activeBehaviorIndex + 1) % this.behaviors.length;
  }

  getAction() {
    let action = null;
    let kill = this.behaviors.length;

    while (action === null && kill > 0) {
      const behavior = this.getActiveBehavior();
      this.selectNextBehavior();
      const isValid = behavior.isValid();
      if (isValid) action = behavior.getAction();
      kill -= 1;
    }
    
    if (action) return action;
    return this.getDefaultAction();
  }
};
