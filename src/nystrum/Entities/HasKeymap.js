import * as _ from 'lodash';

export const HasKeymap = superclass => class extends superclass {
  constructor({ initializeKeymap, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('HAS_KEYMAP');
    this.keymapStack = [];
    this.initializeKeymap = initializeKeymap;
    const keymap = initializeKeymap(this.game.engine, this);
    this.addKeymap(keymap);
  }

  getKeymap () {
    return _.get(this.keymapStack, '0', null);
  }

  addKeymap (newKeymap) {
    this.keymapStack.unshift(newKeymap);
  }

  removeKeymap () {
    this.keymapStack.shift();
  }

  reinitializeKeymap (ignoredKeys = []) {
    this.keymapStack = [];
    const keymap = this.initializeKeymap(this.game.engine, this);
    ignoredKeys.forEach((key) => delete keymap[key])
    this.addKeymap(keymap);
  }

  setKeymap (newKeymap) {
    this.addKeymap(newKeymap);
    return this.getKeymap;
  }

  goToPreviousKeymap () {
    this.removeKeymap();
    return this.getKeymap();
  }
};
