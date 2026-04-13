export interface NPC {
  id: string;
  name: string;
  emoji: string;
  color: string;
  skinColor?: string;
  spawnRow: number;
  spawnCol: number;
  row: number;
  col: number;
  dialogueIndex: number;
  wanderTimer: number;
  wanderDx: number;
  wanderDy: number;
  subX: number;
  subY: number;
  interior?: string;
}

export interface GameObject {
  id: string;
  row: number;
  col: number;
  emoji: string;
  label: string;
  info: string;
  interior?: string;
  pulsePhase?: number;
}

export interface Kiosk {
  id: string;
  row: number;
  col: number;
  title: string;
  category: 'motief' | 'thema' | 'samenvatting' | 'personage';
  text: string;
  color: string;
}

export interface Desk {
  id: string;
  name: string;
  row: number;
  col: number;
  emoji: string;
  screenColor: string;
}

export interface BuildingLabel {
  row: number;
  col: number;
  text: string;
  color: string;
}

export interface BuildingDef {
  id: string;
  topRow: number;
  leftCol: number;
  rows: number;
  cols: number;
  type: 'restaurant' | 'house' | 'cafe';
  roofColor: string;
  wallColor: string;
  accentColor: string;
}

export interface DialogueLine {
  speaker: string;
  text: string;
}

export interface Player {
  worldX: number;
  worldY: number;
  speed: number;
  dir: 'up' | 'down' | 'left' | 'right';
  walkFrame: number;
  moving: boolean;
  interior: string | null;
}

export interface Interior {
  id: string;
  name: string;
  emoji: string;
  width: number;
  height: number;
  map: number[][];
  spawnRow: number;
  spawnCol: number;
  exitRow: number;
  exitCol: number;
  exitWorldRow: number;
  exitWorldCol: number;
  objects: GameObject[];
  ambientColor: string;
}

export interface PathArrow {
  row: number;
  col: number;
  dir: 'up' | 'down' | 'left' | 'right';
}

export interface QuizQuestion {
  q: string;
  opts: string[];
  ans: number;
}
