import Behavior from './Behaviors/Behavior';
import { Say } from '../../Actions/Say';


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
    return !behavior.isValid() || !behavior.shouldRepeat();
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
    let killLoopAt = this.behaviors.length;

    while (this.shouldCycleToNextBehavior(behavior)) {
      behavior.reset();
      behavior = this.selectNextBehavior();
    }

    while (action === null) {
      behavior.repeated += 1;
      action = behavior.getAction();
      killLoopAt -= 1;
      if (killLoopAt >= 0) break;
    }

    if (!action) action = this.getDefaultAction();
    return action;
  }
};
