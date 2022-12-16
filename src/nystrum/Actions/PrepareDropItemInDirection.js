import { Base } from './Base';
import { DropItem } from './DropItem';
import { GoToPreviousKeymap } from './GoToPreviousKeymap';
import { DIRECTIONS, ENERGY_THRESHOLD } from '../constants';
import { getPositionInDirection } from '../../helper';

const directionKeys = [
  'N',
  'S',
  'E',
  'W',
]

const directions = directionKeys.map((key) => DIRECTIONS[key])

const directionKeyMap = {
  N: 'w',
  S: 's',
  E: 'd',
  W: 'a',
}

export class PrepareDropItemInDirection extends Base {
  constructor({
    passThroughEnergyCost = ENERGY_THRESHOLD, 
    passThroughRequiredResources = [],
    itemName,
    ...args 
  }) {
    super({ ...args });
    this.passThroughEnergyCost = passThroughEnergyCost;
    this.passThroughRequiredResources = passThroughRequiredResources;
    this.processDelay = 0;
    this.energyCost = 0;
    this.itemName = itemName
  }

  perform() {
    const pos = this.actor.getPosition();
    const cursor_positions = directions.map((direction) => getPositionInDirection(pos, direction));
    this.actor.activateCursor(cursor_positions)

    const goToPreviousKeymap = new GoToPreviousKeymap({
      actor: this.actor,
      game: this.game,
      onAfter: () => this.actor.deactivateCursor(),
    })


    let keymap = {
      Escape: () => goToPreviousKeymap,
    };


    directionKeys.forEach((key) => {
      const action = () => { 
        return new DropItem({
          actor: this.actor,
          game: this.game,
          interrupt: false,
          energyCost: this.passThroughEnergyCost,
          requiredResources: this.passThroughRequiredResources,
          label: `target ${key}`,
          itemName: this.itemName,
          targetPos: getPositionInDirection(pos, DIRECTIONS[key]),
          onSuccess: () => {
            this.actor.deactivateCursor();
            this.actor.setNextAction(goToPreviousKeymap);
          },
        })
      }

      keymap[directionKeyMap[key]] = action
    })

    this.actor.setKeymap(keymap);
    return {
      success: true,
      alternative: null,
    };
  }
};
