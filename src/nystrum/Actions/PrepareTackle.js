import { Base } from './Base';
import { Tackle } from './Tackle';
import { GoToPreviousKeymap } from './GoToPreviousKeymap';
import { DIRECTIONS, ENERGY_THRESHOLD, PARTICLE_TEMPLATES } from '../constants';
import { getPositionInDirection } from '../../helper';

export class PrepareTackle extends Base {
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
    // tackle in 4 directions a sfar as the actor has energy
    const cursor_positions = [];
    [
      DIRECTIONS.N,
      DIRECTIONS.S,
      DIRECTIONS.E,
      DIRECTIONS.W,
    ].forEach((direction, i) => {
      Array(this.actor.energy / ENERGY_THRESHOLD).fill('').forEach((none, distance) => {
        if (distance > 0) {
          cursor_positions.push(
            getPositionInDirection(pos, direction.map((dir) => dir * (distance)))
          )
        }
      })
    });
    this.actor.activateCursor(cursor_positions)

    const goToPreviousKeymap = new GoToPreviousKeymap({
      actor: this.actor,
      game: this.game,
      onAfter: () => this.actor.deactivateCursor(),
    })

    let keymap = {
      Escape: () => goToPreviousKeymap,
      
      w: () => { 
        return new Tackle({
          actor: this.actor,
          game: this.game,
          energyCost: this.passThroughEnergyCost,
          requiredResources: this.passThroughRequiredResources,
          label: 'tackle N',
          direction: DIRECTIONS.N,
          particleTemplate: PARTICLE_TEMPLATES.leaf,
          onSuccess: () => {
            this.actor.deactivateCursor();
            this.actor.setNextAction(goToPreviousKeymap);
          },
        })
      },
      d: () => { 
        return new Tackle({
          actor: this.actor,
          game: this.game,
          energyCost: this.passThroughEnergyCost,
          requiredResources: this.passThroughRequiredResources,
          label: 'tackle E',
          direction: DIRECTIONS.E,
          particleTemplate: PARTICLE_TEMPLATES.leaf,
          onSuccess: () => {
            this.actor.deactivateCursor();
            this.actor.setNextAction(goToPreviousKeymap);
          },
        })
      },
      s: () => { 
        return new Tackle({
          actor: this.actor,
          game: this.game,
          energyCost: this.passThroughEnergyCost,
          requiredResources: this.passThroughRequiredResources,
          label: 'tackle S',
          direction: DIRECTIONS.S,
          particleTemplate: PARTICLE_TEMPLATES.leaf,
          onSuccess: () => {
            this.actor.deactivateCursor();
            this.actor.setNextAction(goToPreviousKeymap);
          },
        })
      },
      a: () => { 
        return new Tackle({
          actor: this.actor,
          game: this.game,
          energyCost: this.passThroughEnergyCost,
          requiredResources: this.passThroughRequiredResources,
          label: 'tackle W',
          direction: DIRECTIONS.W,
          particleTemplate: PARTICLE_TEMPLATES.leaf,
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
