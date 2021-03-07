import { Base } from './Base';
import { MovingWall } from '../Entities/index';
import { TYPE } from '../items';
import { DIRECTIONS } from '../constants';
import * as Helper from '../../helper';



export class SandPulse extends Base {
  constructor({ ...args }) {
    super({ ...args });
    this.interrupt = true
  }

  perform () {
    const parameters = {
      game: this.game,
      passable: false,
      pos: this.actor.pos,
      renderer: {
        character: ']',
        color: '#A89078',
        background: '#D8C0A8',
      },
      name: TYPE.KUNAI,
      durability: 3,
      range: 10,
      speed: 300,
    }
    const pulseParticles = [
      new MovingWall({direction: DIRECTIONS.N, ...parameters}),
      new MovingWall({direction: DIRECTIONS.E, ...parameters}),
      new MovingWall({direction: DIRECTIONS.S, ...parameters}),
      new MovingWall({direction: DIRECTIONS.W, ...parameters}),
    ]

    pulseParticles.forEach((entity) => {
      const pos = {x: entity.pos.x + entity.direction[0], y: entity.pos.y + entity.direction[1]}
      entity.pos = pos;
      const tile = this.game.map[Helper.coordsToString(pos)];
      tile.entities.push(entity);
      this.game.engine.addActorAsPrevious(entity);
    });

    return {
      success: true,
      alternative: null,
    }
  }
};

