import ExecuteStatusEffects from './ExecuteStatusEffects';

export default class ExecuteStatusEffectOnAllies extends ExecuteStatusEffects {
  constructor({ ...args }) {
    super({ ...args });
  }

  getTargetsOnTile(tile) {
    return tile.entities.filter((entity) => this.actor.isAlly(entity));
  }
}
