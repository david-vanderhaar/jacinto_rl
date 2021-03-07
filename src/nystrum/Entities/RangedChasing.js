import * as Constant from '../constants';
import * as Helper from '../../helper'; 
import { PlaceActor } from '../Actions/PlaceActor';
import { Say } from '../Actions/Say';
import { Move } from '../Actions/Move';

export const RangedChasing = superclass => class extends superclass {
  constructor({ targetEntity = null, getProjectile = () => null, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('RANGED_CHASING');
    this.targetEntity = targetEntity;
    this.getProjectile = getProjectile;
  }
  targetInPath(pathToCheck, targetPos) {
    let inPath = false;
    pathToCheck.forEach((pos) => {
      if (pos.x === targetPos.x && pos.y === targetPos.y) {
        inPath = true;
      }
    });
    return inPath;
  }
  getAction(game) {
    let throwDirection = {
      x: Math.sign(this.targetEntity.pos.x - this.pos.x),
      y: Math.sign(this.targetEntity.pos.y - this.pos.y),
    };
    // projectile.initialize()
    let projectile = this.getProjectile({
      pos: {
        x: this.pos.x,
        y: this.pos.y,
      },
      targetPos: { ...this.targetEntity.pos },
      direction: [throwDirection.x, throwDirection.y],
      range: 10,
    });
    // projectile.getPath()
    projectile.createPath(game);
    // is target in path
    const inPath = this.targetInPath(projectile.path, this.targetEntity.pos);
    if (inPath) {
      // throw
      if (game.canOccupyPosition(projectile.pos, projectile)) {
        return new PlaceActor({
          targetPos: { ...projectile.pos },
          entity: projectile,
          game,
          actor: this,
          energyCost: Constant.ENERGY_THRESHOLD
        });
      }
      return new Say({
        message: `I'll get you with this kunai!`,
        game,
        actor: this,
        energyCost: Constant.ENERGY_THRESHOLD
      });
    }
    // if not, select target tile in range of enemy and move
    let movePath = Helper.calculatePath(game, this.targetEntity.pos, this.pos);
    let targetPos = movePath.length > 0 ? movePath[0] : this.pos;
    return new Move({
      targetPos,
      game,
      actor: this,
      energyCost: Constant.ENERGY_THRESHOLD
    });
  }
};
