import { MultiTargetRangedAttack } from '../../../Actions/MultiTargetRangedAttack';
import Behavior from './Behavior';

export default class ExecuteRangedAttack extends Behavior {
  constructor({ ...args }) {
    super({ ...args });
  }

  isValid () {
    return this.actor.getCursorPositions().length
  }

  constructActionClassAndParams () {
    return [
      MultiTargetRangedAttack,
      {
        targetPositions: this.actor.getCursorPositions(),
        onAfter: () => {
          this.actor.removeAnimations()
          this.actor.reload()
        }
      }
    ]
  }
}
