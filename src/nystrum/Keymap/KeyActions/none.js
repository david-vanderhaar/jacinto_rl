import { Say } from "../../Actions/Say";
import * as Constant from '../../constants';
import { ChakraResource } from '../../Actions/ActionResources/ChakraResource';
import { EnergyResource } from '../../Actions/ActionResources/EnergyResource';

export const none = (engine, actor) => {
  // let actor = engine.actors[engine.currentActor];
  actor.setNextAction(new Say({
    message: 'standing still...',
    game: engine.game,
    actor,
    energyCost: Constant.ENERGY_THRESHOLD,
    requiredResources: [
      new EnergyResource({ getResourceCost: () => Constant.ENERGY_THRESHOLD }),
      new ChakraResource({ getResourceCost: () => 1 }),
    ],
  }))
}