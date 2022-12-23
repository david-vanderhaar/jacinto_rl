import {Base} from './Base';
import { COLORS } from '../Modes/Jacinto/theme';

export class ExtraRoundReload extends Base {
  constructor({buffValue = 1, ...args}) {
  super({ ...args });
    this.name = 'Extra Round Reload';
    this.allowDuplicates = false
    this.lifespan = -1
    this.particleTemplate = {
      renderer: {
        character: '||',
        sprite: '',
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
    this.onStart = () => {
      const weapon = this.setWeapon()
      if (weapon) {
        weapon.baseRangedDamage += buffValue
        weapon.reload()
        weapon.magazine += buffValue
        this['actor_background'] = weapon.renderer.background;
        this['actor_color'] = weapon.renderer.color;
        weapon.renderer.background = this['actor_color']
        weapon.renderer.color = this['actor_background']
      }
    }
    this.onStep = () => {
      const weapon = this['weapon']
      if (weapon) {
        if (weapon.magazine <= weapon.magazineSize) {
          this.lifespan = 0
        }
      }
    }
    this.onStop = () => {
      const weapon = this['weapon']
      if (weapon) {
        weapon.baseRangedDamage -= buffValue
        weapon.renderer.color = this['actor_color']
        weapon.renderer.background = this['actor_background']
      }
    }
  }

  static displayName = 'Extra Round Reload'
}