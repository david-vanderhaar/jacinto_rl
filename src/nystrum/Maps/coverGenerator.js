import { keys } from 'lodash';
import * as Helper from '../../helper';
import * as MapHelper from '../Maps/helper';
import { CoverWall } from '../Entities/index';
import {COLORS} from '../Modes/Jacinto/theme';
import Map from 'rot-js/lib/map/map';

export const generateCoverBlock = (
    pos,
    game,
    name = 'box',
    character = '%',
    durability = 5,
    background = COLORS.base02,
    color = COLORS.base01
  ) => {
    let sprite = Helper.getRandomInArray(['', '', '']);

    let box = new CoverWall({
      pos,
      renderer: {
        character,
        sprite,
        color,
        background,
      },
      name,
      game,
      durability,
      accuracyModifer: -0.3,
      damageModifer: 0,
    })

    game.placeActorOnMap(box)
  }

const SHAPES = {
  point: {
    x_offset: 0,
    y_offset: 0,
    positions: [
      { x: 0, y: 0, taken: false, },
    ]
  },
  verticalLine: {
    x_offset: 1,
    y_offset: 1,
    positions: [
      { x: 0, y: 0, taken: false, },
      { x: 0, y: 1, taken: false, },
    ]
  },
  horizontalLine: {
    x_offset: 1,
    y_offset: 1,
    positions: [
      { x: 0, y: 0, taken: false, },
      { x: 1, y: 0, taken: false, },
    ]
  },
  smallSquare: {
    x_offset: 0,
    y_offset: 0,
    positions: [
      { x: 0, y: 0, taken: false, },
      { x: 0, y: 1, taken: false, },
      { x: 1, y: 1, taken: false, },
      { x: 1, y: 0, taken: false, },
    ]
  },
  southEastVerticalL: {
    x_offset: 0,
    y_offset: 0,
    positions: [
      { x: 0, y: 0, taken: false, },
      { x: 0, y: 1, taken: false, },
      { x: 0, y: 2, taken: false, },
      { x: 1, y: 2, taken: false, },
    ]
  },
  southWestVerticalL: {
    x_offset: 0,
    y_offset: 0,
    positions: [
      { x: 0, y: 0, taken: false, },
      { x: 0, y: 1, taken: false, },
      { x: 0, y: 2, taken: false, },
      { x: -1, y: 2, taken: false, },
    ]
  },
  northWestVerticalL: {
    x_offset: 0,
    y_offset: 0,
    positions: [
      { x: 0, y: 0, taken: false, },
      { x: 0, y: -1, taken: false, },
      { x: 0, y: -2, taken: false, },
      { x: -1, y: -2, taken: false, },
    ]
  },
  northEastVerticalL: {
    x_offset: 0,
    y_offset: 0,
    positions: [
      { x: 0, y: 0, taken: false, },
      { x: 0, y: -1, taken: false, },
      { x: 0, y: -2, taken: false, },
      { x: 1, y: -2, taken: false, },
    ]
  },
  southEastHorizontalL: {
    x_offset: 0,
    y_offset: 0,
    positions: [
      { x: 0, y: 0, taken: false, },
      { x: 1, y: 0, taken: false, },
      { x: 2, y: 0, taken: false, },
      { x: 2, y: 1, taken: false, },
    ]
  },
  southWestHorizontalL: {
    x_offset: 0,
    y_offset: 0,
    positions: [
      { x: 0, y: 0, taken: false, },
      { x: -1, y: 0, taken: false, },
      { x: -2, y: 0, taken: false, },
      { x: -2, y: 1, taken: false, },
    ]
  },
  northEastHorizontalL: {
    x_offset: 0,
    y_offset: 0,
    positions: [
      { x: 0, y: 0, taken: false, },
      { x: 1, y: 0, taken: false, },
      { x: 2, y: 0, taken: false, },
      { x: 2, y: -1, taken: false, },
    ]
  },
  northWestHorizontalL: {
    x_offset: 0,
    y_offset: 0,
    positions: [
      { x: 0, y: 0, taken: false, },
      { x: -1, y: 0, taken: false, },
      { x: -2, y: 0, taken: false, },
      { x: -2, y: -1, taken: false, },
    ]
  },
}

const shapeChanceTable = [
  ...Array(1).fill('point'),
  ...Array(4).fill('verticalLine'),
  ...Array(3).fill('horizontalLine'),
  ...Array(2).fill('smallSquare'),
  ...Array(2).fill('southEastVerticalL'),
  ...Array(2).fill('southWestVerticalL'),
  ...Array(2).fill('northWestVerticalL'),
  ...Array(2).fill('northEastVerticalL'),
  ...Array(1).fill('southEastHorizontalL'),
  ...Array(1).fill('southWestHorizontalL'),
  ...Array(1).fill('northWestHorizontalL'),
  ...Array(1).fill('northEastHorizontalL'),
];

export const generate = (pos, game, shape) => {
  const positions = Helper.getPositionsFromStructure(shape, pos);
  positions.forEach((position) => {
    let tile = game.map[Helper.coordsToString(position)];
    if (!tile) return;
    if (MapHelper.tileHasTag({tile, tag: 'PROVIDING_COVER'})) {
      generateCoverBlock(position, game);
    }
  });
}

export const generateSingle = (pos, game) => generate(pos, game, SHAPES.point);
export const generateTwoVertically = (pos, game) => generate(pos, game, SHAPES.verticalLine);
export const generateTwoHorizontally = (pos, game) => generate(pos, game, SHAPES.horizontalLine);
export const generateSquare = (pos, game) => generate(pos, game, SHAPES.smallSquare);
export const generateRandom = (pos, game) => {
  const shape = SHAPES[Helper.getRandomInArray(shapeChanceTable)];
  generate(pos, game, shape);
};