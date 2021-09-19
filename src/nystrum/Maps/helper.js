import * as _ from 'lodash';
import * as Helper from '../../helper';

export const addTileZone = (tileKey, origin = { x: 0, y: 0 }, height = 3, width = 3, type = 'GROUND', map, mapHeight, mapWidth) => {
  for (let i = 0; i < mapHeight; i++) {
    for (let j = 0; j < mapWidth; j++) {
      if (i >= origin.y && i <= origin.y + (height - 1) && j >= origin.x && j <= origin.x + (width - 1)) {
        const key = `${j},${i}`
        addTileToMap({map, key, tileKey, tileType: type})
      }
    }
  }
}

export const addTileToMap = ({map, key, tileKey, tileType, entities = []}) => {
  const numberOfAnimationFrames = _.get(tileKey[tileType], 'animation.length', 0);
  const currentFrame = Helper.getRandomInt(0, numberOfAnimationFrames);
  const tileData = {
    type: tileType,
    currentFrame,
    entities,
    tileKey,
  };
  map[key] = tileData;

  return tileData;
}

export const tileHasTag = ({tile, tag}) => {
  const tags = _.get(tile.tileKey[tile.type], 'tags', []);
  return tags.includes(tag);
}

export const tileHasAnyTags = ({tile, tags}) => {
  const tileTags = _.get(tile.tileKey[tile.type], 'tags', []);
  return tags.some((tag) => tileTags.includes(tag))
}

export const getTileFromMap = ({map, position}) => map[Helper.coordsToString(position)];