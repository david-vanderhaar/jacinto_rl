import { Base } from './Base';
import { PlaceActor } from './PlaceActor';
import { GoToPreviousKeymap } from './GoToPreviousKeymap';
import * as Cogs from '../Modes/Jacinto/Actors/Cogs';
import { DIRECTIONS, ENERGY_THRESHOLD } from '../constants';
import { getPositionInDirection } from '../../helper';

export class PrepareCallReinforcements extends Base {
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
  getReinforcementCount () { return this.actor['reinforcementCount'] || 1 }
  perform() {
    const pos = this.actor.getPosition();
    // tackle in 4 directions a sfar as the actor has energy
    const cursor_positions = [
      DIRECTIONS.N,
      DIRECTIONS.S,
      DIRECTIONS.E,
      DIRECTIONS.W,
    ].map((direction) => getPositionInDirection(pos, direction));
    this.actor.activateCursor(cursor_positions)

    const goToPreviousKeymap = new GoToPreviousKeymap({
      actor: this.actor,
      game: this.game,
      onAfter: () => this.actor.deactivateCursor(),
    })

    const podEntity = Cogs.createCogPod(this.game.mode, this.getReinforcementCount())

    let keymap = {
      Escape: () => goToPreviousKeymap,
      
      w: () => { 
        return new PlaceActor({
          actor: this.actor,
          game: this.game,
          interrupt: false,
          energyCost: this.passThroughEnergyCost,
          requiredResources: this.passThroughRequiredResources,
          label: 'target N',
          entity: podEntity,
          targetPos: getPositionInDirection(pos, DIRECTIONS.N),
          onSuccess: () => {
            this.actor.deactivateCursor();
            this.actor.setNextAction(goToPreviousKeymap);
          },
        })
      },
      d: () => { 
        return new PlaceActor({
          actor: this.actor,
          game: this.game,
          interrupt: false,
          energyCost: this.passThroughEnergyCost,
          requiredResources: this.passThroughRequiredResources,
          label: 'target E',
          entity: podEntity,
          targetPos: getPositionInDirection(pos, DIRECTIONS.E),
          onSuccess: () => {
            this.actor.deactivateCursor();
            this.actor.setNextAction(goToPreviousKeymap);
          },
        })
      },
      s: () => { 
        return new PlaceActor({
          actor: this.actor,
          game: this.game,
          interrupt: false,
          energyCost: this.passThroughEnergyCost,
          requiredResources: this.passThroughRequiredResources,
          label: 'target S',
          entity: podEntity,
          targetPos: getPositionInDirection(pos, DIRECTIONS.S),
          onSuccess: () => {
            this.actor.deactivateCursor();
            this.actor.setNextAction(goToPreviousKeymap);
          },
        })
      },
      a: () => { 
        return new PlaceActor({
          actor: this.actor,
          game: this.game,
          interrupt: false,
          energyCost: this.passThroughEnergyCost,
          requiredResources: this.passThroughRequiredResources,
          label: 'target W',
          entity: podEntity,
          targetPos: getPositionInDirection(pos, DIRECTIONS.W),
          onSuccess: () => {
            this.actor.deactivateCursor();
            this.actor.setNextAction(goToPreviousKeymap);
          },
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
