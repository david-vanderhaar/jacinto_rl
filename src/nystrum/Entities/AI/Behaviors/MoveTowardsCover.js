import { Say } from '../../../Actions/Say';
import Behavior from './Behavior';

export default class MoveTowardsCover extends Behavior {
  constructor({ ...args }) {
    super({ ...args });
  }

  constructActionClassAndParams () {
    return [
      Say,
      {message: 'I am moving towards cover'}
    ]
  }
}
