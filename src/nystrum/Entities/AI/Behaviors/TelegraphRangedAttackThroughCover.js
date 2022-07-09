import TelegraphRangedAttack from './TelegraphRangedAttack';

export default class TelegraphRangedAttackThroughCover extends TelegraphRangedAttack {
  constructor({ ...args }) {
    super({ ...args });
    this.accuracyToAttackThreshold = -1;
    this.chainOnSuccess = true;
  }
}
