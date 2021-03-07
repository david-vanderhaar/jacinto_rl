import * as Constant from '../constants';
import * as Helper from '../../helper';
import { CrankEngine } from '../Engine/engine';
import { EngineCrank } from '../Actions/EngineCrank';

export const Parent = superclass => class extends superclass {
  constructor({ children = [], engine = new CrankEngine({}), ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('PARENT');
    this.children = children;
    this.engine = engine;
    this.isInitialized = false;
  }
  destroyChild(child) {
    child.energy = 0;
    let tile = this.game.map[Helper.coordsToString(child.pos)];
    this.game.map[Helper.coordsToString(child.pos)].entities = tile.entities.filter((e) => e.id !== child.id);
    this.engine.actors = this.engine.actors.filter((e) => e.id !== child.id);
    this.game.draw();
  }
  canAttack(entity) {
    const childIds = this.children.map((child) => child.id);
    return !childIds.includes(entity.id);
  }
  initialize() {
    this.isInitialized = true;
    this.engine.game = this.game;
    this.engine.actors = this.children;
    this.engine.actors.forEach((actor) => {
      actor.game = this.game;
      actor.destroy = () => { this.destroyChild(actor); };
      actor.canAttack = this.canAttack.bind(this);
      // actor.canAttack = (entity) => {this.canAttack(entity)};
      this.game.placeActorOnMap(actor);
      this.engine.addActor(actor);
      this.game.draw();
    });
  }
  getAction(game) {
    // crank engine one turn
    if (!this.isInitialized) {
      this.initialize();
    }
    let result = new EngineCrank({
      game,
      actor: this,
      engine: this.engine,
      energyCost: Constant.ENERGY_THRESHOLD,
      processDelay: 10
    });
    return result;
  }
};
