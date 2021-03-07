import * as Constant from '../constants'; 

export const IsParticle = superclass => class extends superclass {
  constructor({ pos = { x: 1, y: 1 }, direction = { x: 0, y: 0 }, life = 1, speed = 1, type = Constant.PARTICLE_TYPE.directional, path = null, ...args }) {
    super({ ...args });
    this.pos = pos;
    this.direction = direction;
    this.life = life;
    this.speed = speed;
    this.type = type;
    this.path = path;
    this.entityTypes = this.entityTypes.concat('PARTICLE');
  }
  getNextPos(step) {
    switch (this.type) {
      case Constant.PARTICLE_TYPE.directional:
        return {
          x: this.pos.x + (this.direction.x * this.speed) * step,
          y: this.pos.y + (this.direction.y * this.speed) * step,
        };
      case Constant.PARTICLE_TYPE.path:
        const nextPos = this.path.shift();
        return nextPos ? { ...nextPos } : { ...this.pos };
      default:
        break;
    }
  }
  update(step) {
    this.life -= step;
    if (this.life > 0) {
      this.pos = this.getNextPos(step);
    }
  }
};
