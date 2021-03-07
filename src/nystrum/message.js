import { COLORS, THEMES } from './constants';
import uuid from 'uuid/v1';

export const MESSAGE_TYPE = {
  INFORMATION: {
    color: COLORS.gray_4,
    backgroundColor: COLORS.black_1,
  },
  ACTION: {
    color: COLORS.gray_2,
    backgroundColor: COLORS.gray_5,
  },
  DANGER: {
    color: COLORS.red_5,
    backgroundColor: COLORS.black_1,
  },
  STATUS_EFFECT: {
    color: THEMES.SOLARIZED.base3,
    backgroundColor: THEMES.SOLARIZED.violet,
  },
  ERROR: {
    color: THEMES.SOLARIZED.base3,
    backgroundColor: THEMES.SOLARIZED.yellow,
  },
}

export class Message {
  constructor({ text = '', type = MESSAGE_TYPE.INFORMATION }) {
    let id = uuid();
    this.id = id;
    this.text = text;
    this.type = type;
  }
}