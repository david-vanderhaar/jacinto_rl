import { Attack } from './Attack';
export class SelfDestructiveAttack extends Attack {
  constructor({ damageToSelf, ...args }) {
    super({ ...args });
    this.damageToSelf = damageToSelf;
    this.onSuccess = () => {
      this.actor.decreaseDurabilityWithoutDefense(damageToSelf);
    };
    this.onFailure = () => {
      this.actor.destroy();
    };
  }
}
