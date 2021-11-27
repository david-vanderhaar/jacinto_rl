import { Say } from '../../../Actions/Say';
import Behavior from './Behavior';

export default class Wait extends Behavior {
  constructor({ ...args }) {
    super({ ...args });
  }

  isValid () {
    return true
  }

  constructActionClassAndParams () {
    return [
      Say,
      {message: '*breathes*'}
    ]
  }
}
