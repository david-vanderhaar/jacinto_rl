import { Base } from './Base';
import { PlaceActor } from './PlaceActor';
import { GoToPreviousKeymap } from './GoToPreviousKeymap';
import { TYPE } from '../items';
import { DIRECTIONS, ENERGY_THRESHOLD } from '../constants';
import { getPositionInDirection } from '../../helper';

export class PrepareDirectionalThrow extends Base {
  constructor({ 
    passThroughEnergyCost = ENERGY_THRESHOLD, 
    passThroughRequiredResources = [],
    projectileType = TYPE.DIRECTIONAL_KUNAI,
    ...args 
  }) {
    super({ ...args });
    this.passThroughEnergyCost = passThroughEnergyCost;
    this.passThroughRequiredResources = passThroughRequiredResources;
    this.projectileType = projectileType;
    this.processDelay = 0;
    this.energyCost = 0;
  }
  perform() {

    let projectile = this.actor.contains(this.projectileType);
    if (!projectile) return {
      success: false,
      alternative: null,
    };

    projectile.game = this.game;
    projectile.pos = {
      x: this.actor.pos.x,
      y: this.actor.pos.y,
    };

    this.actor.removeFromContainer(projectile);

    const pos = this.actor.getPosition();
    // tackle in 4 directions a sfar as the actor has energy
    const cursor_positions = [];
    [
      DIRECTIONS.N,
      DIRECTIONS.S,
      DIRECTIONS.E,
      DIRECTIONS.W,
    ].forEach((direction, i) => {
      Array(projectile.range).fill('').forEach((none, distance) => {
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
        return new PlaceActor({
          targetPos: {...projectile.pos},
          actor: this.actor,
          game: this.game,
          entity: projectile,
          energyCost: this.passThroughEnergyCost,
          requiredResources: this.passThroughRequiredResources,
          label: 'throw N',
          onBefore: () => {
            projectile.direction = DIRECTIONS.N;
          },
          onSuccess: () => {
            this.actor.deactivateCursor()
            this.actor.setNextAction(goToPreviousKeymap);
          },
        })
      },
      d: () => { 
        return new PlaceActor({
          targetPos: {...projectile.pos},
          actor: this.actor,
          game: this.game,
          entity: projectile,
          energyCost: this.passThroughEnergyCost,
          requiredResources: this.passThroughRequiredResources,
          label: 'throw E',
          onBefore: () => {
            projectile.direction = DIRECTIONS.E;
          },
          onSuccess: () => {
            this.actor.deactivateCursor()
            this.actor.setNextAction(goToPreviousKeymap);
          },
        })
      },
      s: () => { 
        return new PlaceActor({
          targetPos: {...projectile.pos},
          actor: this.actor,
          game: this.game,
          entity: projectile,
          energyCost: this.passThroughEnergyCost,
          requiredResources: this.passThroughRequiredResources,
          label: 'throw S',
          onBefore: () => {
            projectile.direction = DIRECTIONS.S;
          },
          onSuccess: () => {
            this.actor.deactivateCursor()
            this.actor.setNextAction(goToPreviousKeymap);
          },
        })
      },
      a: () => { 
        return new PlaceActor({
          targetPos: {...projectile.pos},
          actor: this.actor,
          game: this.game,
          entity: projectile,
          energyCost: this.passThroughEnergyCost,
          requiredResources: this.passThroughRequiredResources,
          label: 'throw W',
          onBefore: () => {
            projectile.direction = DIRECTIONS.W;
          },
          onSuccess: () => {
            this.actor.deactivateCursor()
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
