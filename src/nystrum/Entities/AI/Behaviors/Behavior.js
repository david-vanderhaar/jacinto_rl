import { Say } from '../../../Actions/Say';

export default class Behavior {
  constructor({ actor = null, repeat = 1, chainOnSuccess = false, chainOnFail = false, extraActionParams = {} }) {
    this.actor = actor;
    this.repeat = repeat;
    this.repeated = 0;
    this.chainOnSuccess = chainOnSuccess
    this.chainOnFail = chainOnFail
    this.extraActionParams = extraActionParams
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

  shouldChainToNextBehavior () {
    if (this.chainOnSuccess && this.actor.lastActionSucceded()) return true
    if (this.chainOnFail && this.actor.lastActionFailed()) return true
    return false
  }

  interrupted() {
    return !this.shouldChainToNextBehavior() && !this.shouldRepeat()
  }

  getDefaultActionParams() {
    return {
      game: this.actor.game,
      actor: this.actor,
      interrupt: this.interrupted(),
      energyCost: 100,
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
      ...this.extraActionParams,
    });
  }
}
