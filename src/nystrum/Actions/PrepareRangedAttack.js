import { Base } from './Base';
import { MoveRangedAttackCursor } from './MoveRangedAttackCursor';
import { MultiTargetRangedAttack } from './MultiTargetRangedAttack';
import { GoToPreviousKeymap } from './GoToPreviousKeymap';
import { DIRECTIONS, ENERGY_THRESHOLD, THEMES, CLONE_PATTERNS } from '../constants';
import * as Helper from '../../helper';

export class PrepareRangedAttack extends Base {
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
    const positions = [{...pos}]
    // const positions = Helper.getPositionsFromStructure(CLONE_PATTERNS.smallSquare, pos)
    this.actor.activateCursor(positions)

    const goToPreviousKeymap = new GoToPreviousKeymap({
      actor: this.actor,
      game: this.game,
      onAfter: () => this.actor.deactivateCursor(),
    })

    let keymap = {
      Escape: () => goToPreviousKeymap,
      
      w: () => { 
        return new MoveRangedAttackCursor({
          actor: this.actor,
          game: this.game,
          label: 'move N',
          direction: DIRECTIONS.N,
          range: 4,
        })
      },
      a: () => { 
        return new MoveRangedAttackCursor({
          actor: this.actor,
          game: this.game,
          label: 'move W',
          direction: DIRECTIONS.W,
          range: 4,
        })
      },
      s: () => { 
        return new MoveRangedAttackCursor({
          actor: this.actor,
          game: this.game,
          label: 'move S',
          direction: DIRECTIONS.S,
          range: 4,
        })
      },
      d: () => { 
        return new MoveRangedAttackCursor({
          actor: this.actor,
          game: this.game,
          label: 'move E',
          direction: DIRECTIONS.E,
          range: 4,
        })
      },
      r: () => { 
        return new MultiTargetRangedAttack({
          targetPositions:  [...this.actor.getCursorPositions()],
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
