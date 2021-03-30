import {Base} from './Base';

export class MeleeDamage extends Base {
  constructor({buffValue = 1, ...args}) {
    super({ ...args });
    this.name = 'Melee Damage';
    this.allowDuplicates = false
    this['actor_background'] = this.actor.renderer.background;
    this['attackDamage'] = this.actor.attackDamage;
    this.renderer = {
      color: '#424242',
      background: '#e6e6e6',
      character: ''
    };
    this.onStart = () => {
      this.actor.attackDamage += buffValue;
    }
    this.onStop = () => {
      this.actor.attackDamage = this['attackDamage'];
    }
  }
}