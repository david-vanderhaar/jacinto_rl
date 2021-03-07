import { Attack } from './Attack';
export class SelfDestructiveAttack extends Attack {
  constructor({ damageToSelf, ...args }) {
    super({ ...args });
    this.damageToSelf = damageToSelf;
    this.onSuccess = () => {
      console.log('Self destruct success');
      this.actor.decreaseDurabilityWithoutDefense(damageToSelf);
    };
    this.onFailure = () => {
      console.log('Self destruct fails');
      this.actor.destroy();
    };
  }
}
