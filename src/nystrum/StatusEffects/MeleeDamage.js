import {Base} from './Base';
import * as Helper from '../../helper';

export class MeleeDamage extends Base {
  constructor({buffValue = 1, onStartCallback = () => null, ...args}) {
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
      onStartCallback()
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
  static getValidTargetsOnTile(tile, actor) {
    return Helper.getDestructableEntities(tile.entities).filter((entity) => actor.id !== entity.id && actor.isAlly(entity));
  }
}