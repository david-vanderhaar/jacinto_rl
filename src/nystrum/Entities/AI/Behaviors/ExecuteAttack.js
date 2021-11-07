import { Say } from '../../../Actions/Say';
import { MultiTargetAttack } from '../../../Actions/MultiTargetAttack';
import Behavior from './Behavior';

export default class ExecuteAttack extends Behavior {
  constructor({ ...args }) {
    super({ ...args });
  }

  constructActionClassAndParams () {
    return [
      MultiTargetAttack,
      {
        targetPositions: this.actor.getCursorPositions(),
        onAfter: () => this.actor.removeAnimations()
      }
    ]
  }
}
