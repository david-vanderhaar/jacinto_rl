import { FireSpread } from './index';
import * as Constant from '../constants';
import * as Helper from '../../helper'; 
import { Say } from '../Actions/Say';
import { DestroySelf } from '../Actions/DestroySelf';
import { PlaceActor } from '../Actions/PlaceActor';

export const Spreading = superclass => class extends superclass {
  constructor({ timeToSpread = 5, spreadCount = 1, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('SPREADING');
    this.timeToSpreadMax = timeToSpread;
    this.timeToSpread = timeToSpread;
    this.spreadCountMax = spreadCount;
    this.spreadCount = spreadCount;
  }
  getAction(game) {
    // if no more spreads, then destroy
    if (this.spreadCount <= 0) {
      return new DestroySelf({
        game: game,
        actor: this,
        energyCost: Constant.ENERGY_THRESHOLD,
        processDelay: 0,
        onAfter: () => {
          game.map[Helper.coordsToString(this.pos)].type = 'BURNT';
        },
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
        let notBurnt = true;
        let canBurn = false;
        if (newTile) {
          notBurnt = newTile.type !== 'BURNT';
          canBurn = ['WALL', 'FLOOR', 'DOOR'].includes(newTile.type);
        }
        if (tileExists && notBurnt && canBurn) {
          adjacentPos = newPos;
          break;
        }
        kill -= 1;
      }
      if (adjacentPos) {
        // create new fire actor and place
        let fire = new FireSpread({
          name: 'Pyro',
          pos: { x: 0, y: 0 },
          game,
          renderer: {
            character: '*',
            sprite: '',
            color: Constant.THEMES.SOLARIZED.base3,
            background: Constant.THEMES.SOLARIZED.red,
          },
          timeToSpread: this.timeToSpreadMax,
          spreadCount: this.spreadCountMax,
          durability: this.durability,
          attackDamage: this.attackDamage,
          speed: this.speed,
        });
        this.timeToSpread = this.timeToSpreadMax;
        this.spreadCount -= 1;
        return new PlaceActor({
          targetPos: adjacentPos,
          entity: fire,
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
      message: 'burning',
      game,
      actor: this,
      processDelay: 0,
    });
  }
};
