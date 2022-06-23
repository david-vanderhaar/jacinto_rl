import { Base } from './Base';
import { PlaceActor } from './PlaceActor';
import { GoToPreviousKeymap } from './GoToPreviousKeymap';
import { TYPE } from '../items';
import { DIRECTIONS, ENERGY_THRESHOLD } from '../constants';
import * as Helper from '../../helper';

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

    const pos = this.actor.getPosition();
    // tackle in 4 directions a sfar as the actor has energy
    let cursor_positions = [];
    [
      DIRECTIONS.N,
      DIRECTIONS.S,
      DIRECTIONS.E,
      DIRECTIONS.W,
    ].forEach((direction, i) => {
      for (let distance = 0; distance < projectile.range + 1; distance++) {
        let endPath = false
        if (distance > 0) {
          const currentPosition = Helper.getPositionInDirection(pos, direction.map((dir) => dir * (distance)))
          const lastPosition = Helper.getPositionInDirection(pos, direction.map((dir) => dir * (distance - 1)))

          if (!this.game.canPassPositionWhenThrown(currentPosition, projectile, true)) endPath = true
          if (distance === projectile.range) endPath = true

          cursor_positions.push(currentPosition)

          if (endPath) {
            const circlePositions = Helper.getPointsWithinRadius(currentPosition, projectile.explosivity)
            cursor_positions = cursor_positions.concat(circlePositions)
            cursor_positions.push(currentPosition)
            break;
          }
        }
      }
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
            this.actor.removeFromContainer(projectile);
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
            this.actor.removeFromContainer(projectile);
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
            this.actor.removeFromContainer(projectile);
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
            this.actor.removeFromContainer(projectile);
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
