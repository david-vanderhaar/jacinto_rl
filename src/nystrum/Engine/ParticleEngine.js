import * as Helper from '../../helper';
import * as ROT from 'rot-js';

export class Particle {
  constructor({
    x = 1,
    y = 1,
    life = 10,
    directionX = 0,
    directionY = 0,
    speed = 1,
    color = '#fff',
    backgroundColor = '#000',
    character = '*',
  }) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.life = life;
    this.speed = speed;
    this.color = color;
    this.backgroundColor = backgroundColor;
    this.character = character;
  }

  getPos () {
    return { x: this.x, y: this.y};
  }
  
  getDir () {
    return { x: this.directionX, y: this.directionY};
  }

  getNextX (step) {
    return this.x + (this.directionX * this.speed) * step;
  }

  getNextY (step) {
    return this.y + (this.directionY * this.speed) * step;
  }

  initialze (attributes) {
    for (let key in attributes) {
      this[key] = attributes[key];
    }
  }

  update (step) {
    this.life -= step;
    if (this.life > 0) {
      this.x = this.getNextX(step);
      this.y = this.getNextY(step);
    }
  }
}

export class ParticleEngine {
  constructor({
    game = null,
    delay = 500,
    particles = [],
    particleLimit = 10,
    currentParticle = 0,
    isRunning = false,
    display = new ROT.Display({
      // forceSquareRatio: true,
      width: 90,
      // height: 100,
      fontSize: 24,
      bg: '#424242'
    }),
  }) {
    this.game = game;
    this.delay = delay;
    this.particles = particles;
    this.deadParticles = Array(particleLimit).fill('').map(() => new Particle({}));
    this.particleLimit = particleLimit;
    this.currentParticle = currentParticle;
    this.isRunning = isRunning;
    this.display = display;
  }

  addParticle (particleAttributes) {
    // if (this.isRunning) this.stop();
    if (!this.deadParticles.length) return false;
    let particle = this.deadParticles.pop();
    particle.initialze(particleAttributes);
    this.particles.push(particle);
    if (!this.isRunning) this.start();
    return true;
  }

  async process () {
    if (this.particles.length <= 0) return false; 
    let step = 1;
    let particle = this.particles[this.currentParticle];
    particle.update(step);
    if (particle.life <= 0) {
      let lastTile = this.getMapColorsAtPos(particle.x, particle.y);
      this.game.display.draw(particle.x, particle.y, lastTile.character, lastTile.foreground, lastTile.background);
      this.particles.splice(this.currentParticle, 1);
      this.deadParticles.push(particle);
    }
    await Helper.delay(this.delay);
    this.currentParticle = (this.currentParticle + 1) % this.particles.length;
    return true;
  }
  
  draw () {
    // this.game.particleDisplay.clear();
    // this.game.display.clear();
    this.particles.forEach((particle) => {
      if (this.currentParticle === 0) {
        let lastX = particle.getNextX(-1);
        let lastY = particle.getNextY(-1);
        let lastTile = this.getMapColorsAtPos(lastX, lastY);
        this.game.display.draw(lastX, lastY, lastTile.character, lastTile.foreground, lastTile.background);
        this.game.display.draw(particle.x, particle.y, particle.character, particle.color, particle.backgroundColor);
      }
    });
  }

  getMapColorsAtPos (x, y) {
    let key = `${x},${y}`;
    let tile = this.game.map[key];
    let { character, foreground, background } = this.game.tileKey[tile.type]

    if (tile.entities.length > 0) {
      let entity = tile.entities[tile.entities.length - 1]
      character = entity.renderer.character
      foreground = entity.renderer.color
      if (entity.renderer.background) {
        background = entity.renderer.background
      }
    }

    return { character, foreground, background }
  }

  async start() {
    console.log('starting');
    this.isRunning = true;
    while (this.isRunning) {
      this.isRunning = await this.process();
      this.draw();
      console.table({
        particles: this.particles.length,
        deadParticles: this.deadParticles.length,
      })
    }
    console.log('stopping');
    
  }

  stop() {
    this.isRunning = false;
  }

}