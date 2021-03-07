import { Base } from './Base';

export class SwitchActor extends Base {
  constructor({ targetActor = null, energyCost = 0, ...args }) {
    super({ ...args });
    this.targetActor = targetActor;
  }
  perform() {
    this.game.engine.addActorAsPrevious(this.targetActor);
    // this.game.placeActorOnMap(cursor);
    // this.game.draw();
    return {
      success: true,
      alternative: null,
    };
  }
}
;
