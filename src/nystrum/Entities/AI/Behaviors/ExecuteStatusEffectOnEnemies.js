import ExecuteStatusEffects from './ExecuteStatusEffects';

export default class ExecuteStatusEffectOnEnemies extends ExecuteStatusEffects {
  constructor({ ...args }) {
    super({ ...args });
  }

  getTargetsOnTile(tile) {
    return tile.entities.filter((entity) => this.actor.isEnemy(entity));
  }
}
