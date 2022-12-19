import {RenderedWithPickUpEffects} from '../../Entities/index';
import { JACINTO_SOUNDS } from '../../Modes/Jacinto/sounds';
import {COLORS} from '../../Modes/Jacinto/theme';

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
          JACINTO_SOUNDS.cog_tags.play()
        }
      }
    ]
  });
}
