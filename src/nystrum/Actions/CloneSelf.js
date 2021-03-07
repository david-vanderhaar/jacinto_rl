import { MESSAGE_TYPE } from '../message';
import { Base } from './Base';
export class CloneSelf extends Base {
  constructor({ cloneArgs = [], ...args }) {
    super({ ...args });
    this.cloneArgs = cloneArgs;
  }
  perform() {
    let success = false;
    if (this.actor.createClone(this.cloneArgs)) {
      success = true;
      // this.actor.energy -= this.energyCost;
      this.game.addMessage(`${this.actor.name} is cloning itself`, MESSAGE_TYPE.ACTION);
    }
    // let clone = cloneDeep(this.actor);
    // clone.game = this.actor.game;
    // clone.id = uuid();
    // this.cloneArgs.forEach((arg) => {
    //   console.log(arg);
    //   clone[arg.attribute] = arg.value
    // });
    // if (this.game.placeActorOnMap(clone)) {
    //   this.game.engine.addActorAsNext(clone);
    //   this.game.draw();
    //   success = true;
    // };
    return {
      success,
      alternative: null,
    };
  }
}
;
