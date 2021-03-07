import { Base } from './Base';
import { PlaceItems } from './PlaceItems';
import { GoToPreviousKeymap } from './GoToPreviousKeymap';
import { Wall } from '../Entities/index';
import { TYPE } from '../items';
import { getDirectionKey, DIRECTIONS, ENERGY_THRESHOLD } from '../constants';


const createSandWall = (engine, pos) => new Wall({
  game: engine.game,
  passable: false,
  pos: { x: pos.x, y: pos.y },
  renderer: {
    character: '✦️',
    color: '#A89078',
    background: '#D8C0A8',
  },
  name: TYPE.BARRIER,
  durability: 3,
});

export class SandWall extends PlaceItems {
  constructor({ ...args }) {
    super({ ...args });
    this.entity = createSandWall(this.game.engine, { ...this.actor.pos });
  }

  perform () {
    this.actor.setNextAction(new GoToPreviousKeymap({
      actor: this.actor,
      game: this.game,
    }))
    return super.perform();
  }
};

const getTargetPositions = (direction, actor) => {
  let targetPositions = [];
  let directionKey = getDirectionKey(direction);
  switch (directionKey) {
    case 'N':
      targetPositions = targetPositions.concat([
        {
          x: actor.pos.x - 1,
          y: actor.pos.y - 1,
        },
        {
          x: actor.pos.x,
          y: actor.pos.y - 1,
        },
        {
          x: actor.pos.x + 1,
          y: actor.pos.y - 1,
        },
      ]);
      break;
    case 'S':
      targetPositions = targetPositions.concat([
        {
          x: actor.pos.x - 1,
          y: actor.pos.y + 1,
        },
        {
          x: actor.pos.x,
          y: actor.pos.y + 1,
        },
        {
          x: actor.pos.x + 1,
          y: actor.pos.y + 1,
        },
      ]);
      break;
    case 'E':
      targetPositions = targetPositions.concat([
        {
          x: actor.pos.x + 1,
          y: actor.pos.y - 1,
        },
        {
          x: actor.pos.x + 1,
          y: actor.pos.y,
        },
        {
          x: actor.pos.x + 1,
          y: actor.pos.y + 1,
        },
      ]);
      break;
    case 'W':
      targetPositions = targetPositions.concat([
        {
          x: actor.pos.x - 1,
          y: actor.pos.y - 1,
        },
        {
          x: actor.pos.x - 1,
          y: actor.pos.y,
        },
        {
          x: actor.pos.x - 1,
          y: actor.pos.y + 1,
        },
      ]);
      break;
    default:
      break;
  }
  return targetPositions;
}

export class PrepareSandWall extends Base {
  constructor({ 
    sandWallEnergyCost = ENERGY_THRESHOLD, 
    sandWallRequiredResources = [], 
    ...args 
  }) {
    super({ ...args });
    this.sandWallEnergyCost = sandWallEnergyCost;
    this.sandWallRequiredResources = sandWallRequiredResources;
    this.processDelay = 0;
    this.energyCost = 0;
  }
  perform() {
    const goToPreviousKeymap = new GoToPreviousKeymap({
      actor: this.actor,
      game: this.game,
    })
    let keymap = {
      Escape: () => goToPreviousKeymap,
      w: () => new SandWall({
        targetPositions: getTargetPositions(DIRECTIONS.N, this.actor),
        actor: this.actor,
        game: this.game,
        energyCost: this.sandWallEnergyCost,
        requiredResources: this.sandWallRequiredResources,
        label: 'activate N',
      }),
      d: () => new SandWall({
        targetPositions: getTargetPositions(DIRECTIONS.E, this.actor),
        actor: this.actor,
        game: this.game,
        energyCost: this.sandWallEnergyCost,
        requiredResources: this.sandWallRequiredResources,
        label: 'activate E',
      }),
      s: () => new SandWall({
        targetPositions: getTargetPositions(DIRECTIONS.S, this.actor),
        actor: this.actor,
        game: this.game,
        energyCost: this.sandWallEnergyCost,
        requiredResources: this.sandWallRequiredResources,
        label: 'activate S',
      }),
      a: () => new SandWall({
        targetPositions: getTargetPositions(DIRECTIONS.W, this.actor),
        actor: this.actor,
        game: this.game,
        energyCost: this.sandWallEnergyCost,
        requiredResources: this.sandWallRequiredResources,
        label: 'activate W',
      }),
    };
    this.actor.setKeymap(keymap);
    return {
      success: true,
      alternative: null,
    };
  }
};
