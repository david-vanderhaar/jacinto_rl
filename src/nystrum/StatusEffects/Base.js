import * as Helper from '../../helper';

export class Base {
  constructor({ 
    game, 
    actor, 
    name = 'Effect', 
    lifespan = 100,
    stepInterval = 100,
    allowDuplicates = true,
    onStart = () => null,
    onStep = () => null,
    onStop = () => null,
    renderer = {background: 'green', color: 'white', character: '*'}
  }) {
    this.game = game
    this.actor = actor
    this.name = name
    this.lifespan = lifespan
    this.timeToLive = lifespan
    this.stepInterval = stepInterval
    this.allowDuplicates = allowDuplicates
    this.timeSinceLastStep = 0;
    this.onStart = onStart
    this.onStep = onStep
    this.onStop = onStop
    this.renderer = renderer
  }

  static displayName = 'Base Effect'
  static getValidTargetsOnTile (tile, actor) {
    return Helper.getDestructableEntities(tile.entities);
  }
}