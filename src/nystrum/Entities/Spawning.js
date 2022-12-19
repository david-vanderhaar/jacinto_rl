import { FireSpread } from './index';
import * as Constant from '../constants';
import * as Helper from '../../helper'; 
import * as Item from '../items'; 
import { Say } from '../Actions/Say';
import { DestroySelf } from '../Actions/DestroySelf';
import { PlaceActor } from '../Actions/PlaceActor';

export const Spawning = superclass => class extends superclass {
  constructor({
    getSpawnedEntity,
    timeToSpread = 5,
    spreadCount = 1,
    onSpawn = () => null,
    ...args
  }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('SPAWNING');
    this.timeToSpreadMax = timeToSpread;
    this.timeToSpread = timeToSpread;
    this.spreadCountMax = spreadCount;
    this.spreadCount = spreadCount;
    this.getSpawnedEntity = getSpawnedEntity
    this.onSpawn = onSpawn
  }
  getAction(game) {
    // if no more spreads, then destroy
    if (this.spreadCount <= 0) {
      return new DestroySelf({
        game: game,
        actor: this,
        energyCost: Constant.ENERGY_THRESHOLD,
        processDelay: 0,
      });
    }
    // if its time to expand again, create a new fire spread and placeActor
    if (this.timeToSpread <= 0) {
      // find adjacent spot to spread to
      let adjacentPositions = [
        {
          x: this.pos.x + 1,
          y: this.pos.y + 0,
        },
        {
          x: this.pos.x + -1,
          y: this.pos.y + 0,
        },
        {
          x: this.pos.x + 0,
          y: this.pos.y + 1,
        },
        {
          x: this.pos.x + 0,
          y: this.pos.y + -1,
        },
      ];
      let adjacentPos = null;
      let kill = 100;
      while (kill > 0) {
        let newPos = Helper.getRandomInArray(adjacentPositions);
        let newTile = this.game.map[Helper.coordsToString(newPos)];
        let tileExists = Boolean(newTile);
        if (tileExists && game.canOccupyPosition(newPos)) {
          adjacentPos = newPos;
          break;
        }
        kill -= 1;
      }
      if (adjacentPos) {
        this.timeToSpread = this.timeToSpreadMax;
        this.spreadCount -= 1;
        this.onSpawn()
        return new PlaceActor({
          targetPos: adjacentPos,
          entity: this.getSpawnedEntity(adjacentPos),
          game,
          actor: this,
          interrupt: false,
          energyCost: Constant.ENERGY_THRESHOLD,
          processDelay: 0,
          forcePlacement: true,
        });
      }
      this.timeToSpread = this.timeToSpreadMax;
      this.spreadCount -= 1;
    }
    this.timeToSpread -= 1;
    return new Say({
      message: 'boom boom',
      game,
      actor: this,
      processDelay: 0,
    });
  }
};
