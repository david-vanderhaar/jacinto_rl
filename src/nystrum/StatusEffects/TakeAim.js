import {Base} from './Base';
import { COLORS } from '../Modes/Jacinto/theme';
import * as Helper from '../../helper'

export class TakeAim extends Base {
  constructor({buffValue = 1, ...args}) {
  super({ ...args });
    this.name = 'Take Aim';
    this.allowDuplicates = false
    this.lifespan = -1
    this.particleTemplate = {
      renderer: {
        character: '+',
        sprite: '+',
        background: COLORS.gray,
        color: COLORS.base3,
      },
    }
    this['setWeapon'] = () => {
      const weapons = this.actor.getEquipedWeapons()
      if (weapons.length === 0) return null
      this['weapon'] = weapons[0]
      return weapons[0]
    }
    this['actor_position'] = {...this.actor.getPosition()}
    this.onStart = () => {
      const weapon = this.setWeapon()
      if (weapon) {
        weapon.baseRangedAccuracy += buffValue
        this['actor_background'] = weapon.renderer.background;
        this['actor_color'] = weapon.renderer.color;
        weapon.renderer.background = this['actor_color']
        weapon.renderer.color = this['actor_background']
      }
    }
    this.onStep = () => {
      const weapon = this['weapon']
      if (!weapon) {
        this.lifespan = 0
        return
      }

      if (Helper.coordsAreEqual(this.actor.getPosition(), this['actor_position'])) return
      this.lifespan = 0
    }
    this.onStop = () => {
      const weapon = this['weapon']
      if (weapon) {
        weapon.baseRangedAccuracy -= buffValue
        weapon.renderer.color = this['actor_color']
        weapon.renderer.background = this['actor_background']
      }
    }
  }

  static displayName = 'Take Aim'
}