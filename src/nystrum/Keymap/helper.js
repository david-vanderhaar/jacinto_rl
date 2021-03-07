import { ALPHABET, DIRECTIONS } from '../constants';

export const createKeyAction = ({
  label = 'KeyAction',
  activate = () => null,
  action = null,
}) => {
  return {
    label,
    activate,
    action,
  }
}

export const addAlphabeticallyToKeymap = (keymap, obj) => {
  let alphabetAllowed = ALPHABET.filter((letter) => {
    return !Object.keys(keymap).includes(letter);
  });
  keymap[alphabetAllowed[0]] = obj;
}

export const deactivateUIKeymap = (engine, visibleUIKey) => {
  let currentUiActor = engine.actors[engine.currentActor];
  engine.game.removeActor(currentUiActor);
  engine.game[visibleUIKey] = null;
}

export const createFourDirectionMoveOptions = (moveFunction, engine, label = 'move', hidden = false) => {
  return {
    w: {
      activate: () => moveFunction(DIRECTIONS.N, engine),
      label: `${label} N`,
      hidden,
    },
    d: {
      activate: () => moveFunction(DIRECTIONS.E, engine),
      label: `${label} E`,
      hidden,
    },
    s: {
      activate: () => moveFunction(DIRECTIONS.S, engine),
      label: `${label} S`,
      hidden,
    },
    a: {
      activate: () => moveFunction(DIRECTIONS.W, engine),
      label: `${label} W`,
      hidden,
    },
  }
}

export const createEightDirectionMoveOptions = (moveFunction, engine, label = 'move', hidden = false) => {
  return {
    w: {
      activate: () => moveFunction(DIRECTIONS.N, engine),
      label: `${label} N`,
      hidden,
    },
    e: {
      activate: () => moveFunction(DIRECTIONS.NE, engine),
      label: `${label} NE`,
      hidden,
    },
    d: {
      activate: () => moveFunction(DIRECTIONS.E, engine),
      label: `${label} E`,
      hidden,
    },
    c: {
      activate: () => moveFunction(DIRECTIONS.SE, engine),
      label: `${label} SE`,
      hidden,
    },
    x: {
      activate: () => moveFunction(DIRECTIONS.S, engine),
      label: `${label} S`,
      hidden,
    },
    z: {
      activate: () => moveFunction(DIRECTIONS.SW, engine),
      label: `${label} SW`,
      hidden,
    },
    a: {
      activate: () => moveFunction(DIRECTIONS.W, engine),
      label: `${label} W`,
      hidden,
    },
    q: {
      activate: () => moveFunction(DIRECTIONS.NW, engine),
      label: `${label} NW`,
      hidden,
    },
  }
}