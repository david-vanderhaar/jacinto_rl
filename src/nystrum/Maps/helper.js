import * as Constant from '../constants';
import * as Helper from '../../helper';

export const addTileZone = (origin = { x: 0, y: 0 }, height = 3, width = 3, type = 'GROUND', map, mapHeight, mapWidth) => {
  for (let i = 0; i < mapHeight; i++) {
    for (let j = 0; j < mapWidth; j++) {
      if (i >= origin.y && i <= origin.y + (height - 1) && j >= origin.x && j <= origin.x + (width - 1)) {
        const key = `${j},${i}`
        let currentFrame = 0;

        if (Constant.TILE_KEY[type].animation) {
          currentFrame = Helper.getRandomInt(0, Constant.TILE_KEY[type].animation.length)
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