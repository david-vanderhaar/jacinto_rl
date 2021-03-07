import { CursorMove } from './CursorMove';
export class ParticleMove extends CursorMove {
  constructor({ ...args }) {
    super({ ...args });
  }
  perform() {
    this.actor.energy -= this.energyCost;
    if (this.actor.energy <= 0) {
      this.actor.destroy();
      return { success: false };
    }
    return super.perform();
  }
}
