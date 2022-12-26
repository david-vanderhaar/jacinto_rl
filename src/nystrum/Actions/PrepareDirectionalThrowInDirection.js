import { Base } from './Base';
import { PlaceActor } from './PlaceActor';
import { GoToPreviousKeymap } from './GoToPreviousKeymap';
import { TYPE } from '../items';
import { DIRECTIONS, ENERGY_THRESHOLD, THEMES } from '../constants';
import * as Helper from '../../helper';

export class PrepareDirectionalThrowInDirection extends Base {
  constructor({ 
    passThroughEnergyCost = ENERGY_THRESHOLD, 
    passThroughRequiredResources = [],
    projectileType = TYPE.DIRECTIONAL_KUNAI,
    directionToPrepareThrow = 'N',
    activateKey = 't',
    ...args 
  }) {
    super({ ...args });
    this.passThroughEnergyCost = passThroughEnergyCost;
    this.passThroughRequiredResources = passThroughRequiredResources;
    this.projectileType = projectileType;
    this.directionToPrepareThrow = directionToPrepareThrow;
    this.activateKey = activateKey;
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
    let cursorPositions = [];
    let hitPositions = [];
    const direction = DIRECTIONS[this.directionToPrepareThrow]

    for (let distance = 0; distance < projectile.range + 1; distance++) {
      let endPathAtObstacle = false
      let endPathAtDistance = false
      let endPosition = null
      if (distance > 0) {
        const currentPosition = Helper.getPositionInDirection(pos, direction.map((dir) => dir * (distance)))
        const lastPosition = Helper.getPositionInDirection(pos, direction.map((dir) => dir * (distance - 1)))

        if (!this.game.canPassPositionWhenThrown(currentPosition, projectile, true)) {
          endPosition = lastPosition
          endPathAtObstacle = true
        } else if (distance === projectile.range) {
          endPosition = currentPosition;
          endPathAtDistance = true
        }

        if (endPathAtObstacle || endPathAtDistance) {
          const circlePositions = Helper.getPointsWithinRadius(endPosition, projectile.explosivity)
          hitPositions = hitPositions.concat(circlePositions)
          cursorPositions = cursorPositions.concat(circlePositions)
          cursorPositions.push(endPosition)
          break;
        }

        cursorPositions.push(currentPosition)
      }
    }

    this.actor.activateCursor(cursorPositions)
    hitPositions.forEach((hitPosition) => {
      this.actor.updateCursorNodeByPosition(
        hitPosition,
        [
          {key: 'fill', value: THEMES.JACINTO.red}, 
          {key: 'stroke', value: 'transparent'}, 
        ]
      );
    })


    const goToPreviousKeymap = new GoToPreviousKeymap({
      actor: this.actor,
      game: this.game,
      onAfter: () => {
        this.actor.goToPreviousKeymap()
        this.actor.deactivateCursor()
      }
    })

    let keymap = {
      Escape: () => goToPreviousKeymap,
      
      [this.activateKey]: () => { 
        return new PlaceActor({
          targetPos: {...projectile.pos},
          actor: this.actor,
          game: this.game,
          entity: projectile,
          energyCost: this.passThroughEnergyCost,
          requiredResources: this.passThroughRequiredResources,
          label: `throw ${this.directionToPrepareThrow}`,
          onBefore: () => {
            projectile.direction = DIRECTIONS[this.directionToPrepareThrow];
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
