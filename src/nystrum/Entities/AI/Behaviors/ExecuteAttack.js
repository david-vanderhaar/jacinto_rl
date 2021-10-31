import { Say } from '../../../Actions/Say';
import Behavior from './Behavior';

export default class ExecuteAttack extends Behavior {
  constructor({ ...args }) {
    super({ ...args });
  }

  constructActionClassAndParams () {
    return [
      Say,
      {message: 'I am executing an attack'}
    ]
  }
}
