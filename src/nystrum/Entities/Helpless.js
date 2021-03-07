import SOUNDS from '../sounds';
import * as Helper from '../../helper';

export const Helpless = superclass => class extends superclass {
  constructor({ ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('HELPLESS');
    this.saved = false;
  }
  save() {
    this.saved = true;
    SOUNDS.save.play();
  }
  destroy() {
    const sound = Helper.getRandomInArray([SOUNDS.scream_0, SOUNDS.scream_1, SOUNDS.scream_2]);
    sound.play();
    super.destroy();
  }
};
