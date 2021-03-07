import { Base } from './Base';

export class MoveSubstitution extends Base {
  constructor({ spawnedEntity, targetPos, processDelay = 25, ...args }) {
    super({ ...args });
    this.spawnedEntity = spawnedEntity;
    this.targetPos = targetPos;
    this.processDelay = processDelay;
  }
  perform() {
    let success = false;
    let alternative = null;
    let move_success = this.actor.move(this.targetPos);
    if (move_success) {
      success = true;
      this.game.placeActorOnMap(this.spawnedEntity)
      this.game.draw();
    }
    return {
      success,
      alternative,
    };
  }
};
