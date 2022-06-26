import {Base} from './Base';

export class MeleeDamage extends Base {
  constructor({buffValue = 1, ...args}) {
    super({ ...args });
    this.name = 'Melee Damage';
    this.allowDuplicates = false
    this['actor_background'] = this.actor.renderer.background;
    this['actor_color'] = this.actor.renderer.color;
    this['attackDamage'] = this.actor.attackDamage;
    this.renderer = {
      color: '#424242',
      background: '#A89078',
      character: ''
    };
    this.onStart = () => {
      this.actor.attackDamage += buffValue;
      this.actor.renderer.background = this['actor_color']
      this.actor.renderer.color = this['actor_background']
    }
    this.onStop = () => {
      this.actor.attackDamage = this['attackDamage'];
      this.actor.renderer.color = this['actor_color']
      this.actor.renderer.background = this['actor_background']
    }
  }

  static displayName = 'Melee Damage'
}