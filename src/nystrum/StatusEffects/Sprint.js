import {Base} from './Base';
import {MESSAGE_TYPE} from '../message';

export class Sprint extends Base {
  constructor({buffValue = 1, ...args}) {
    super({ ...args });
    this.name = 'Sprint';
    this.allowDuplicates = false
    this['actor_background'] = this.actor.renderer.background;
    this['actor_speed'] = this.actor.speed;
    this.renderer = {
      color: '#424242',
      background: '#e6e6e6',
      character: '〣'
    };
    this.onStart = () => {
      this.actor.speed += buffValue;
      this.game.addMessage(`${this.actor.name} was enveloped in hardened sand.`, MESSAGE_TYPE.INFORMATION);
      this.actor.renderer.background = '#A89078'
    }
    this.onStop = () => {
      this.actor.speed = this['actor_speed'];
      this.game.addMessage(`${this.actor.name}'s hardened sand skin fell away.`, MESSAGE_TYPE.INFORMATION);
      this.actor.renderer.background = this['actor_background'];
    }
  }
}