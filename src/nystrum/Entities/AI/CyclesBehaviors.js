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
    this.energy = Infinity
  }

  getActiveBehavior() {
    return this.selectedBehavior();
  }

  selectedBehavior (){
    return this.behaviors[this.activeBehaviorIndex]
  }

  shouldCycleToNextBehavior(behavior) {
    return !behavior.isValid() || !behavior.shouldRepeat();
    // return this.lastActionFailed() || !behavior.isValid() || !behavior.shouldRepeat();
  }

  getDefaultAction() {
    return new Say({
      message: '*whistles*',
      game: this.game,
      actor: this,
      interrupt: true,
      energyCost: 100
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

    let killGetBehaviourLoop = this.behaviors.length;
    while (this.shouldCycleToNextBehavior(behavior)) {
      behavior.reset();
      behavior = this.selectNextBehavior();
      this.resetLastActionResult()
      killGetBehaviourLoop -= 1
      if (killGetBehaviourLoop < 0) break;
    }

    let killGetActionLoop = this.behaviors.length;
    while (action === null) {
      behavior.repeated += 1;
      action = behavior.getAction();
      killGetActionLoop -= 1;
      if (killGetActionLoop < 0) break;
    }

    if (!action) action = this.getDefaultAction();
    return action;
  }
};
