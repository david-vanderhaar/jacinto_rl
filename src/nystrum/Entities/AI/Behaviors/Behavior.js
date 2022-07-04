import { Say } from '../../../Actions/Say';

export default class Behavior {
  constructor({ actor = null, repeat = 1 }) {
    this.actor = actor;
    this.repeat = repeat;
    this.repeated = 0;
    this.willChainToNextBehaviour = false
  }

  isValid () {
    return true;
  }

  reset () {
    this.repeated = 0;
  }

  shouldRepeat () {
    return this.repeated < this.repeat
  }

  interrupted() {
    return !this.willChainToNextBehaviour && (this.repeated >= this.repeat)
  }

  getDefaultActionParams() {
    return {
      game: this.actor.game,
      actor: this.actor,
      interrupt: this.interrupted(),
      energyCost: 0,
    }
  }

  constructActionClassAndParams () {
    let actionClass = Say;
    let actionParams = {message: 'I am behaving'};
    return [actionClass, actionParams];
  }

  getAction() {
    const [actionClass, actionParams] = this.constructActionClassAndParams();
    if (!actionClass || !actionParams) return null;
    
    return new actionClass({
      ...this.getDefaultActionParams(),
      ...actionParams,
    });
  }
}
