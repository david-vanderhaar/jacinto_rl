import * as Constant from '../constants';
import * as Helper from '../../helper';

export const SpawningWithStructure = superclass => class extends superclass {
  constructor({ spawnStructure = Constant.CLONE_PATTERNS.clover, spawnedEntityClass, spawnedEntityOptions, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('SPAWNING_WITH_STRUCTURE');
    this.spawnStructure = spawnStructure;
    this.spawnedEntityClass = spawnedEntityClass;
    this.spawnedEntityOptions = spawnedEntityOptions;
  }

  createEntitiesToSpawn() {
    return Helper.getPositionsFromStructure(this.spawnStructure, this.getPosition()).map((position) => (
      new this.spawnedEntityClass({
        pos: {...position},
        game: this.game,
        ...this.spawnedEntityOptions,
      })
    ))
  }

  spawnEntities() {
    this.createEntitiesToSpawn().forEach((entity) => {
      if (entity.entityTypes.includes('ACTING')) this.game.engine.addActor(entity);
      this.game.placeActorOnMap(entity);
    })
  }
};
