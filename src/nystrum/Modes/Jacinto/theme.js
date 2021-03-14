export const COLORS = {
  base04: '#07111Dff',
  base03: '#02252e',
  // base03: '#002b36',
  base02: '#073642',
  base01: '#586e75',
  base00: '#657b83',
  // base0: '#96641Dff',
  base0: '#839496',
  base1: '#93a1a1',
  // base2: '#E19D3Fff',
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
  // // base1: '#07111Dff',
  // base1: '#0B0B0Bff',
  // base2: '#5A7178ff',
  // base3: '#B6ACA3ff',
  // base4: '#EDF6F1ff',
  cog1: '#27295f',
  cog2: '#3e7dc9',
  cog3: '#18c0f8',
  cog4: '#86C8E4ff',
  locust0: '#423a18',
  locust1: '#96641Dff',
  locust2: '#E19D3Fff',
  // locust2: '#F89339ff',
  locust3: '#E7C898ff',
  flesh1: '#833139ff',
  flesh2: '#CC7468ff',
  flesh3: '#DDA78Fff',
  gray: '#6D7886ff',
}
export const TILE_KEY = {
  'GROUND': {
    background: COLORS.base03,
    foreground: COLORS.base01,
    character: '.',
    sprite: '',
    passable: true,
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
  },
  'WALL': {
    background: COLORS.locust0,
    foreground: COLORS.locust2,
    character: '#',
    sprite: '',
    passable: false,
  },
  'DOOR': {
    background: COLORS.locust0,
    foreground: COLORS.base1,
    character: '+',
    sprite: '',
    passable: true,
  },
  'SAFE': {
    background: COLORS.locust0,
    foreground: COLORS.green,
    character: '+',
    sprite: '',
    passable: true,
  },
}

export const STAT_RENDERERS = {
  'amount': {
    background: COLORS.base04,
    foreground: COLORS.locust2,
    character: '#',
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