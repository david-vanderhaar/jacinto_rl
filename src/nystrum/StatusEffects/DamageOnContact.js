import {Base} from './Base';
import * as Helper from '../../helper';
import { COLORS } from '../Modes/Jacinto/theme';
import SOUNDS from '../sounds';

export class DamageOnContact extends Base {
  constructor({damage = 1, useCount = 3, ...args}) {
    super({ ...args });
    this.name = 'Trap Damage';
    this.allowDuplicates = false
    this.timeToLive = Infinity;
    this.renderer = {
      color: COLORS.base3,
      background: COLORS.flesh2,
      character: '^'
    };
    this.damage = damage
    this.uses = useCount
    this.onStep = this.handleStep
  }

  handleStep () {
    const pos = this.actor.getPosition()
    if (hasNotBeenPlaced(pos)) return;
    const enemies = this.getEnemiesAtCurrentPosition();
    if (enemies.length == 0) return;
    enemies[0].decreaseDurability(this.damage)
    this.uses -=1
    this.playDamageSound()
    if (this.uses <= 0) {
      this.actor.destroy()
      this.playDestroyedSound()
    }
  }

  playDamageSound() {
    const sound = Helper.getRandomInArray([SOUNDS.chop_0, SOUNDS.chop_1]);
    sound.play();
  }

  playDestroyedSound() {
    SOUNDS.grab_0.play();
  }

  getEnemiesAtCurrentPosition() {
    const tile = Helper.getTileAtPosition(this.game, this.actor.getPosition())
    if (!tile) return [];
    return Helper.getDestructableEntities(tile.entities).filter((entity) => this.actor.id !== entity.id && this.actor.isEnemy(entity));
  }

  static displayName = 'Trap Damage'
}

const hasNotBeenPlaced = (pos) => Helper.coordsAreEqual({x: 0, y: 0}, pos)