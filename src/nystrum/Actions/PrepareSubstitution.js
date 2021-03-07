import { Base } from './Base';
import { MoveTargetingCursor } from './MoveTargetingCursor';
import { MoveSubstitution } from './MoveSubstitution';
import { GoToPreviousKeymap } from './GoToPreviousKeymap';
import { TYPE } from '../items';
import { Wall } from '../Entities/index';
import { DIRECTIONS, ENERGY_THRESHOLD, THEMES } from '../constants';

const createSandWall = (engine, pos) => new Wall({
  game: engine.game,
  passable: false,
  pos: { x: pos.x, y: pos.y },
  renderer: {
    // character: '>',
    character: '✦️',
    color: '#A89078',
    background: '#D8C0A8',
  },
  name: TYPE.BARRIER,
  durability: 3,
})

export class PrepareSubstitution extends Base {
  constructor({ 
    passThroughEnergyCost = ENERGY_THRESHOLD, 
    passThroughRequiredResources = [], 
    ...args 
  }) {
    super({ ...args });
    this.passThroughEnergyCost = passThroughEnergyCost;
    this.passThroughRequiredResources = passThroughRequiredResources;
    this.processDelay = 0;
    this.energyCost = 0;
  }

  perform() {

    const pos = this.actor.getPosition();
    this.actor.activateCursor([{...pos}])

    const goToPreviousKeymap = new GoToPreviousKeymap({
      actor: this.actor,
      game: this.game,
      onAfter: () => this.actor.deactivateCursor(),
    })

    let keymap = {
      Escape: () => goToPreviousKeymap,
      
      w: () => { 
        return new MoveTargetingCursor({
          actor: this.actor,
          game: this.game,
          label: 'move N',
          direction: DIRECTIONS.N,
          range: 4,
        })
      },
      a: () => { 
        return new MoveTargetingCursor({
          actor: this.actor,
          game: this.game,
          label: 'move W',
          direction: DIRECTIONS.W,
          range: 4,
        })
      },
      s: () => { 
        return new MoveTargetingCursor({
          actor: this.actor,
          game: this.game,
          label: 'move S',
          direction: DIRECTIONS.S,
          range: 4,
        })
      },
      d: () => { 
        return new MoveTargetingCursor({
          actor: this.actor,
          game: this.game,
          label: 'move E',
          direction: DIRECTIONS.E,
          range: 4,
        })
      },
      r: () => { 
        return new MoveSubstitution({
          targetPos: { ...this.actor.getCursorPositions()[0] },
          spawnedEntity: createSandWall(this.game.engine, { ...this.actor.getPosition() }),
          game: this.game,
          actor: this.actor,
          energyCost: this.passThroughEnergyCost,
          requiredResources: this.passThroughRequiredResources,
          onSuccess: () => {
            this.actor.deactivateCursor();
            this.actor.setNextAction(goToPreviousKeymap);
          }
        })
      },
    };
    this.actor.setKeymap(keymap);
    return {
      success: true,
      alternative: null,
    };
  }
};
