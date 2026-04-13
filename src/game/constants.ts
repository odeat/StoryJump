export const TILE = 32;
export const COLS = 60;
export const ROWS = 60;
export const WW = COLS * TILE;
export const WH = ROWS * TILE;

export const T = {
  GRASS: 0,
  PATH: 1,
  WATER: 2,
  FLOWER: 3,
  TREE: 4,
  BUILDING: 5,
  STUDY: 6,
  SAND: 7,
  DOOR: 8,
  FLOOR: 9,
  WALL: 10,
  TABLE: 11,
  CHAIR: 12,
} as const;

export const TILE_COLORS: Record<number, string> = {
  [T.GRASS]: '#3a7d44',
  [T.PATH]: '#c8a96a',
  [T.WATER]: '#4a90d9',
  [T.FLOWER]: '#3a7d44',
  [T.TREE]: '#2d6135',
  [T.BUILDING]: '#8b7355',
  [T.STUDY]: '#1a1a2e',
  [T.SAND]: '#d4b483',
  [T.DOOR]: '#8B4513',
  [T.FLOOR]: '#5c4a3a',
  [T.WALL]: '#4a3a2a',
  [T.TABLE]: '#3a2a1a',
  [T.CHAIR]: '#6b5a4a',
};

export const INTERACT_DIST = TILE * 1.8;
export const WANDER_RADIUS = 5;
export const NPC_SPEED = 0.6;
export const TYPEWRITER_SPEED = 2;
