import {Base} from './Base';
import * as Helper from '../../helper';
import {THEMES} from '../constants';

export class MeleeDamageDebuff extends Base {
  constructor({buffValue = 1, ...args}) {
    super({ ...args });
    this.name = 'Melee Damage Debuff';
    this.allowDuplicates = false
    this['actor_background'] = this.actor.renderer.background;
    this['actor_color'] = this.actor.renderer.color;
    this['attackDamage'] = this.actor.attackDamage;
    this.onStart = () => {
      this.actor.attackDamage = Math.min(0, this.actor.attackDamage - 1);
      this.actor.renderer.background = this['actor_color']
      this.actor.renderer.color = this['actor_background']
    }
    this.onStop = () => {
      this.actor.attackDamage = this['attackDamage'];
      this.actor.renderer.color = this['actor_color']
      this.actor.renderer.background = this['actor_background']
    }
  }

  static displayName = 'Melee Damage Debuff'
  static getValidTargetsOnTile(tile, actor) {
    return Helper.getDestructableEntities(tile.entities).filter((entity) => actor.id !== entity.id && actor.isEnemy(entity));
  }
}