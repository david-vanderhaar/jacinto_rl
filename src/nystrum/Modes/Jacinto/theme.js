export const COLORS = {
  base04: '#07111D',
  base03: '#02252e',
  // base03: '#002b36',
  base02: '#073642',
  base01: '#586e75',
  base00: '#657b83',
  // base0: '#96641D',
  base0: '#839496',
  base1: '#93a1a1',
  // base2: '#E19D3F',
  base2: '#eee8d5',
  base3: '#fdf6e3',
  yellow: '#b58900',
  orange: '#cb4b16',
  red: '#dc322f',
  magenta: '#d33682',
  violet: '#6c71c4',
  blue: '#268bd2',
  cyan: '#2aa198',
  green: '#859900',
  // // base1: '#07111D',
  // base1: '#0B0B0B',
  // base2: '#5A7178',
  // base3: '#B6ACA3',
  // base4: '#EDF6F1',
  cog1: '#27295f',
  cog2: '#3e7dc9',
  cog3: '#18c0f8',
  cog4: '#86C8E4',
  locust0: '#423a18',
  locust1: '#96641D',
  locust2: '#E19D3F',
  // locust2: '#F89339',
  locust3: '#E7C898',
  flesh1: '#833139',
  flesh2: '#CC7468',
  flesh3: '#DDA78F',
  gray: '#6D7886',
}
export const TILE_KEY = {
  'GROUND': {
    background: COLORS.base04,
    foreground: COLORS.base02,
    character: '.',
    sprite: '',
    passable: true,
    tags: ['PROVIDING_COVER'],
  },
  'COVER_PLACEHOLDER': {
    background: COLORS.base04,
    foreground: COLORS.base02,
    character: '.',
    sprite: '',
    passable: true,
    tags: ['PROVIDING_COVER'],
  },
  'GROUND_ALT': {
    background: COLORS.base04,
    foreground: COLORS.base02,
    character: '',
    sprite: '',
    passable: true,
    tags: ['PROVIDING_COVER'],
  },
  'EMERGENCE_DESTROYED': {
    background: COLORS.base04,
    foreground: COLORS.locust0,
    character: '',
    // sprite: '',
    sprite: '',
    passable: true,
  },
  'EMERGENCE_GROUND': {
    background: COLORS.locust0,
    foreground: COLORS.locust1,
    character: '.',
    sprite: '',
    passable: true,
  },
  'EMERGENCE_OUTER_GROUND': {
    background: COLORS.locust0,
    foreground: COLORS.locust2,
    character: '.',
    sprite: '',
    passable: true,
  },
  'FLOOR': {
    background: COLORS.base02,
    foreground: COLORS.locust1,
    character: '',
    passable: true,
    tags: ['BURNABLE'],
  },
  'WALL': {
    background: COLORS.base02,
    foreground: COLORS.locust2,
    character: '#',
    sprite: '',
    passable: false,
    tags: ['BURNABLE', 'WALL'],
  },
  'WALL_VERTICAL': {
    background: COLORS.base02,
    foreground: COLORS.locust2,
    character: '||',
    sprite: '',
    passable: false,
    tags: ['BURNABLE', 'WALL'],
  },
  'WALL_HORIZONTAL': {
    background: COLORS.base02,
    foreground: COLORS.locust2,
    character: '=',
    sprite: '',
    passable: false,
    tags: ['BURNABLE', 'WALL'],
  },
  'WALL_CORNER_NW': {
    background: COLORS.base02,
    foreground: COLORS.locust2,
    character: '#',
    sprite: '',
    passable: false,
    tags: ['BURNABLE', 'WALL'],
  },
  'WALL_CORNER_NE': {
    background: COLORS.base02,
    foreground: COLORS.locust2,
    character: '#',
    sprite: '',
    passable: false,
    tags: ['BURNABLE', 'WALL'],
  },
  'WALL_CORNER_SW': {
    background: COLORS.base02,
    foreground: COLORS.locust2,
    character: '#',
    sprite: '',
    passable: false,
    tags: ['BURNABLE', 'WALL'],
  },
  'WALL_CORNER_SE': {
    background: COLORS.base02,
    foreground: COLORS.locust2,
    character: '#',
    sprite: '',
    passable: false,
    tags: ['BURNABLE', 'WALL'],
  },
  'ROAD_EDGE': {
    background: COLORS.base03,
    foreground: COLORS.base02,
    character: '',
    sprite: '',
    passable: true,
    tags: ['ROAD', 'PROVIDING_COVER'],
  },
  'ROAD': {
    background: COLORS.base03,
    foreground: COLORS.base02,
    character: '=',
    sprite: '',
    passable: true,
    tags: ['ROAD', 'PROVIDING_COVER'],
  },
  'DOOR': {
    background: COLORS.base02,
    foreground: COLORS.base1,
    character: '+',
    sprite: '',
    passable: true,
    tags: ['BURNABLE'],
  },
  'SAFE': {
    background: COLORS.base04,
    foreground: COLORS.base02,
    character: '.',
    sprite: '',
    passable: true,
  },
  'LOCKED_EXIT': {
    background: COLORS.base04,
    foreground: COLORS.base02,
    character: '.',
    sprite: '',
    passable: true,
  },
  'EXIT': {
    background: COLORS.base04,
    foreground: COLORS.green,
    character: '>',
    sprite: '',
    passable: true,
  },
  'BURNT': {
    background: COLORS.base03,
    foreground: COLORS.red,
    character: 'X',
    sprite: '',
    passable: true,
    tags: ['BURNABLE'],
    animation: [
      { background: COLORS.base03, foreground: COLORS.yellow, character: 'X', sprite: '', passable: true, },
      { background: COLORS.base03, foreground: COLORS.yellow, character: 'x', sprite: '', passable: true, },
      { background: COLORS.base03, foreground: COLORS.red, character: 'X', sprite: '', passable: true, },
      { background: COLORS.base03, foreground: COLORS.orange, character: 'x', sprite: '', passable: true, },
      { background: COLORS.base03, foreground: COLORS.orange, character: 'X', sprite: '', passable: true, },
      { background: COLORS.base03, foreground: COLORS.red, character: 'x', sprite: '', passable: true, },
      { background: COLORS.base03, foreground: COLORS.red, character: 'X', sprite: '', passable: true, },
    ]
  },
}

export const STAT_RENDERERS = {
  'amount': {
    background: COLORS.base04,
    foreground: COLORS.locust2,
    character: '',
  },
  'attackRange': {
    background: COLORS.green,
    foreground: COLORS.base3,
    character: '==>',
  },
  'magazine': {
    background: COLORS.gray,
    foreground: COLORS.base3,
    character: '!!',
  },
  'baseRangedAccuracy': {
    background: COLORS.violet,
    foreground: COLORS.base3,
    character: '*',
  },
  'baseRangedDamage': {
    background: COLORS.red,
    foreground: COLORS.base3,
    character: 'x',
    sprite: '',
  },
  'meleeDamage': {
    background: COLORS.red,
    foreground: COLORS.base3,
    character: 'x',
    sprite: '',
  },
} 

// GiArcheryTarget / GiBullseye / GiCrosshair -- accuracy
// GiBullets -- ammo
// GiBackwardTime -- ammo / reload
//  GiBarbedArrow - -range
// GiBurningDot -- damage
// GiCog

/*
SCROLL-O-Sprites







 
*/
