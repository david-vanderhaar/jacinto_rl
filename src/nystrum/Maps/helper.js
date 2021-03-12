import * as Constant from '../constants';
import * as Helper from '../../helper';

export const addTileZone = (tileKey, origin = { x: 0, y: 0 }, height = 3, width = 3, type = 'GROUND', map, mapHeight, mapWidth) => {
  for (let i = 0; i < mapHeight; i++) {
    for (let j = 0; j < mapWidth; j++) {
      if (i >= origin.y && i <= origin.y + (height - 1) && j >= origin.x && j <= origin.x + (width - 1)) {
        const key = `${j},${i}`
        let currentFrame = 0;

        if (tileKey[type].animation) {
          currentFrame = Helper.getRandomInt(0, tileKey[type].animation.length)
        }

        map[key] = {
          type,
          currentFrame,
          entities: [],
        };
      }
    }
  }
}