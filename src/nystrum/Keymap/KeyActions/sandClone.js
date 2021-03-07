import { CloneSelf } from "../../Actions/CloneSelf";
import { cloneDeep } from 'lodash';

export const sandClone = (engine) => {
  let actor = engine.actors[engine.currentActor];
  let cloneKeymap = cloneDeep(actor.keymap);
  delete cloneKeymap['j'];
  delete cloneKeymap['k'];
  delete cloneKeymap['l'];
  let cloneArgs = [
    {
      attribute: 'renderer',
      value: { ...actor.renderer, background: '#A89078' }
    },
    {
      attribute: 'keymap',
      value: cloneKeymap
    }
  ];
  actor.setNextAction(new CloneSelf({
    game: engine.game,
    actor,
    cloneArgs,
  }))
}