import * as ROT from 'rot-js';

export const delay = (timeDelayed = 100) => {
  // return;
  if (timeDelayed <= 0) return;
  return new Promise(resolve => setTimeout(resolve, timeDelayed));
}

export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

export const getRandomInArray = (array) => {
  return array[Math.floor(Math.random() * array.length)];
}

export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const coordsAreEqual = (pos_one, pos_two) => pos_one.x === pos_two.x && pos_one.y === pos_two.y

export const coordsToString = (coords) => coords && `${coords.x},${coords.y}`

const isTilePassable = (game) => (x, y) => {
  const tile = game.map[x + "," + y];
  if (tile) {
    return (game.tileKey[tile.type].passable);
  } else {
    return false
  }
}

export const getTileAtPosition = (game, pos) => game.map[coordsToString(pos)]

const isTileAndEntitiesPassable = (game, sourceEntityPos) => (x, y) => {
  const tile = game.map[x + "," + y];
  if (tile) {
    const tileIsPassable = game.tileKey[tile.type].passable
    if (tile.entities.length && !coordsAreEqual(sourceEntityPos, {x, y})) {
      const entitiesArePassable = tile.entities.every((entity) => entity.passable);
      return tileIsPassable && entitiesArePassable;
    }
    return tileIsPassable;
  } else {
    return false
  }
}

export const calculatePath = (game, targetPos, currentPos, topology = 4, isPassable = isTilePassable) => {
  let map = game.map
  let isPassableCallback = isPassable(game);
  let astar = new ROT.Path.AStar(targetPos.x, targetPos.y, isPassableCallback, { topology });
  let path = [];
  astar.compute(currentPos.x, currentPos.y, function (x, y) {
    path.push({ x, y })
  });

  return path.slice(1);
}

export const calculatePathAroundObstacles = (
  game, 
  targetPos, 
  currentPos, 
  topology = 4
) => calculatePath(
  game,
  targetPos,
  currentPos,
  topology,
  (gameObject) => isTileAndEntitiesPassable(gameObject, currentPos)
);

export const calculateStraightPath = (p0, p1) => {
  let points = [];
  let N = diagonal_distance(p0, p1);
  for (let step = 0; step < N; step++) {
    let t = N === 0 ? 0.0 : step / N;
    points.push(round_point(lerp_point(p0, p1, t)));
  }
  return points;
}

export const diagonal_distance = (p0, p1) => {
  let dx = p1.x - p0.x, dy = p1.y - p0.y;
  return Math.max(Math.abs(dx), Math.abs(dy));
}

const round_point = (p) => {
  return {x: Math.round(p.x), y: Math.round(p.y)};
}

const lerp_point = (p0, p1, t) => {
  return {
    x: lerp(p0.x, p1.x, t),
    y: lerp(p0.y, p1.y, t)
  };
}

const lerp = (start, end, t) => {
  return start + t * (end - start);
}

export const getPositionInDirection = (pos, direction) => {
  return {x: pos.x + direction[0], y: pos.y + direction[1]}
}

export const calculatePathWithRange = (game, targetPos, currentPos, topology, range) => {
  let path = calculatePath(game, targetPos, currentPos, topology);
  return path.slice(0, range + 1);
}

export const getRandomPos = (map) => {
  let keys = Object.keys(map);
  let key = getRandomInArray(keys).split(',');
  let pos = { x: parseInt(key[0]), y: parseInt(key[1])}
  return {coordinates: pos, text: key}
}

export const getDestructableEntities = (entites) => {
  return entites.filter((entity) => entity.hasOwnProperty('durability'));
}

export const filterEntitiesByType = (entites, type) => {
  return entites.filter((entity) => entity.entityTypes.includes(type));
}

export const getEntitiesByPosition = ({game, position}) => {
  const tile = getTileAtPosition(game, position)
  return tile.entities
}

export const getEntitiesByPositionByType = ({game, position, entityType}) => {
  const entities = getEntitiesByPosition({game, position})
  return filterEntitiesByType(entities, entityType);
}

const getGranularity = (radius) => {
  let result = (2 / 3) * (Math.pow(radius, 3) - (9 * Math.pow(radius, 2)) + (32 * radius) - 18)
  return result
}

export const getNeighboringTiles = (map, pos) => {
  const neigborPositions = [
    { x: 0, y: 1},
    { x: 1, y: 1},
    { x: 1, y: 0},
    { x: 1, y: -1},
    { x: 0, y: -1},
    { x: -1, y: -1},
    { x: -1, y: 0},
    { x: -1, y: 1},
  ];

  return neigborPositions.map((point) => {
    const newPos = { x: pos.x + point.x, y: pos.y + point.y};
    let newTile = map[coordsToString(newPos)];
    if (newTile) {
      return newTile
    }
  }).filter((item) => Boolean(item));
}

export const getPointsOnCircumference = (centerX = 0, centerY = 0, r = 3) => {
  const n = getGranularity(r);
  let list = [];
  for (let i = 0; i < n; i++) {
    let x = Math.round(centerX + (Math.cos(2 * Math.PI / n * i) * r))
    let y = Math.round(centerY + (Math.sin(2 * Math.PI / n * i) * r))
    list.push({ x, y });
  }
  return list
}

export const getPointsWithinRadius = (position, radius) => {
  let positions = [];
  for (let x = position.x - radius; x < position.x + radius; x++) {
    let yspan = Math.floor(radius * Math.sin(Math.acos((position.x - x) / radius)));
    for (let y = position.y - yspan + 1; y < position.y + yspan; y++) {
      positions.push({x, y})
    }
  }
  return positions;
}

export const getPositionsFromStructure = (structure, initialPosition) => {
  return structure.positions.map((slot) => {
    let position = {
      x: initialPosition.x + slot.x + structure.x_offset,
      y: initialPosition.y + slot.y + structure.y_offset
    }
    return position
  })
}
