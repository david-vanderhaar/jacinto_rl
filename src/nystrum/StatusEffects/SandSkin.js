import {Base} from './Base';
import {MESSAGE_TYPE} from '../message';
import * as Helper from '../../helper';

export class SandSkin extends Base {
  constructor({buffValue = 1, ...args}) {
    super({ ...args });
    this.name = 'Sand Skin';
    this.allowDuplicates = false
    this['actor_background'] = this.actor.renderer.background;
    this.renderer = {
      character: '✦️',
      color: '#A89078',
      background: '#D8C0A8',
    }
    this.onStart = () => {
      this.actor.defense += buffValue;
      this.game.addMessage(`${this.actor.name} was enveloped in hardened sand.`, MESSAGE_TYPE.INFORMATION);
      this.actor.renderer.background = '#A89078'
    }
    this.onStop = () => {
      this.actor.defense = Math.max(0, this.actor.defense - buffValue);
      this.game.addMessage(`${this.actor.name}'s hardened sand skin fell away.`, MESSAGE_TYPE.INFORMATION);
      this.actor.renderer.background = this['actor_background'];
    }
  }
  
  static displayName = 'Sand Skin'
  static getValidTargetsOnTile(tile, actor) {
    return Helper.getDestructableEntities(tile.entities).filter((entity) => actor.id !== entity.id && actor.isAlly(entity));
  }
}