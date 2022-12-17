import uuid from 'uuid/v1';
import {GAME} from '../game';

export class Entity {
  constructor({ game = null, passable = false, name = 'nameless' }) {
    let id = uuid();
    this.entityTypes = ['Entity'];
    this.id = id;
    this.name = name;
    this.game = game || GAME;
    this.passable = passable;
    this.active = true;
  }
}
