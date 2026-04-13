import { T, COLS, ROWS } from './constants';

export function createWorldMap(): number[][] {
  const worldMap = Array.from({ length: ROWS }, () => Array(COLS).fill(T.GRASS));

  function fillRect(r: number, c: number, rows: number, cols: number, tile: number) {
    for (let rr = r; rr < r + rows; rr++)
      for (let cc = c; cc < c + cols; cc++)
        if (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS) worldMap[rr][cc] = tile;
  }

  // Trees along borders
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      if (r < 2 || r >= ROWS - 2 || c < 2 || c >= COLS - 2) { worldMap[r][c] = T.TREE; continue; }
      const rand = Math.random();
      if (rand < 0.04) worldMap[r][c] = T.FLOWER;
      else if (rand < 0.10) worldMap[r][c] = T.TREE;
    }

  // Water lake
  fillRect(20, 28, 8, 9, T.WATER);
  fillRect(19, 30, 1, 5, T.WATER);
  fillRect(28, 29, 1, 6, T.WATER);

  // Sand beach around lake
  fillRect(19, 28, 1, 9, T.SAND);
  fillRect(28, 28, 1, 9, T.SAND);
  fillRect(20, 27, 8, 1, T.SAND);
  fillRect(20, 37, 8, 1, T.SAND);

  // === Buildings (positioned NEXT TO the path, not on it) ===

  // Restaurant (rows 8-14, cols 19-26) — right of path at col 15
  fillRect(8, 19, 7, 8, T.BUILDING);
  worldMap[14][23] = T.DOOR;

  // House Paul & Claire (rows 20-24, cols 11-16) — right of path at col 8
  fillRect(20, 11, 5, 6, T.BUILDING);
  worldMap[24][14] = T.DOOR;

  // Café (rows 33-38, cols 43-49) — right of path at col 38
  fillRect(33, 43, 6, 7, T.BUILDING);
  worldMap[38][46] = T.DOOR;

  // Studiehoek
  fillRect(48, 44, 10, 14, T.STUDY);

  // Path
  function drawPath(points: [number, number][]) {
    for (let i = 0; i < points.length - 1; i++) {
      const [r1, c1] = points[i], [r2, c2] = points[i + 1];
      const dr = Math.sign(r2 - r1), dc = Math.sign(c2 - c1);
      let r = r1, c = c1;
      while (r !== r2 || c !== c2) {
        for (let pr = -1; pr <= 1; pr++)
          for (let pc = -1; pc <= 1; pc++) {
            const nr = r + pr, nc = c + pc;
            if (nr >= 2 && nr < ROWS - 2 && nc >= 2 && nc < COLS - 2) worldMap[nr][nc] = T.PATH;
          }
        if (r !== r2) r += dr;
        else c += dc;
      }
    }
  }

  drawPath([
    [4, 4], [4, 15], [10, 15], [15, 15], [15, 8], [21, 8], [28, 8],
    [28, 20], [28, 25], [32, 25], [32, 38], [36, 38], [36, 45],
    [42, 45], [42, 52], [52, 52],
  ]);

  // Small path connections from main path to building doors
  // Restaurant: from path at col 17 to door at [14][23]
  fillRect(13, 17, 3, 7, T.PATH);
  // House: from path at col 9 to door at [24][14]
  fillRect(23, 9, 3, 6, T.PATH);
  // Café: from path at col 40 to door at [38][46]
  fillRect(37, 40, 3, 7, T.PATH);

  // Studiehoek path
  fillRect(48, 44, 10, 14, T.STUDY);

  // Re-place doors after path
  worldMap[14][23] = T.DOOR;
  worldMap[24][14] = T.DOOR;
  worldMap[38][46] = T.DOOR;

  return worldMap;
}

export function createTileNoise(): number[][] {
  return Array.from({ length: ROWS }, (_, r) =>
    Array.from({ length: COLS }, (_, c) => {
      const n = (Math.sin(r * 127.1 + c * 311.7) * 43758.5453) % 1;
      return Math.abs(n);
    })
  );
}
