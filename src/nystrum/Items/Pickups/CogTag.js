import {RenderedWithPickUpEffects} from '../../Entities/index';
import {COLORS} from '../../Modes/Jacinto/theme';
import SOUNDS from '../../sounds';

export const CogTag = () => {
  let isUsed = false
  return new RenderedWithPickUpEffects({
    name: 'Cog Tag',
    passable: true,
    renderer: {
      character: 'o',
      sprite: '',
      background: COLORS.cog1,
      color: COLORS.cog3,
    },
    pickupEffects: [
      (actor) => {
        if (!isUsed) {
          isUsed = true
          actor.upgrade_points += 1
          SOUNDS.save.play();
        }
      }
    ]
  });
}
