import Behavior from './Behaviors/Behavior';
import { Say } from '../../Actions/Say';
import * as Constant from '../../constants';


export const CyclesBehaviors = superclass => class extends superclass {
  constructor({ 
    behaviors = [new Behavior()],
    ...args 
  }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('CYCLES_BEHAVIORS');
    this.behaviors = behaviors.map((behavior) => {
      behavior['actor'] = this;
      return behavior;
    });
    this.activeBehaviorIndex = 0;
  }

  getActiveBehavior() {
    return this.selectedBehavior();
  }

  selectedBehavior (){
    return this.behaviors[this.activeBehaviorIndex]
  }

  shouldCycleToNextBehavior(behavior) {
    return behavior.repeated >= behavior.repeat
  }

  getDefaultAction() {
    return new Say({
      message: '*whistles*',
      game: this.game,
      actor: this,
      interrupt: true,
      energyCost: 0
    });
  }

  setBehaviorIndex(nexIndex) {
    this.activeBehaviorIndex = nexIndex;
  }

  setNextBehaviorIndex() {
    const nextBehaviorIndex = (this.activeBehaviorIndex + 1) % this.behaviors.length;
    this.setBehaviorIndex(nextBehaviorIndex);
  }

  selectNextBehavior() {
    this.setNextBehaviorIndex();
    return this.selectedBehavior();
  }

  getAction() {
    let action = null;
    let behavior = this.selectedBehavior();
    while (this.shouldCycleToNextBehavior(behavior)) {
      behavior.repeated = 0;
      behavior = this.selectNextBehavior();
    }

    let killLoopAt = this.behaviors.length;
    while (action === null && killLoopAt >= 0) {
      if (behavior.isValid()) {
        behavior.repeated += 1;
        action = behavior.getAction();
        killLoopAt -= 1;
      };
    }

    if (!action) action = this.getDefaultAction();
    return action;
  }
};
