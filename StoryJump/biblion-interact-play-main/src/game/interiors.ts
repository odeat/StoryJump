import { T } from './constants';
import { Interior, GameObject } from './types';

function createInteriorMap(width: number, height: number, decorator: (map: number[][], w: number, h: number) => void): number[][] {
  const map: number[][] = Array.from({ length: height }, () => Array(width).fill(T.FLOOR));
  // Walls on edges
  for (let r = 0; r < height; r++) {
    map[r][0] = T.WALL;
    map[r][width - 1] = T.WALL;
  }
  for (let c = 0; c < width; c++) {
    map[0][c] = T.WALL;
    map[height - 1][c] = T.WALL;
  }
  decorator(map, width, height);
  return map;
}

const restaurantObjects: GameObject[] = [
  {
    id: 'fooi_interior',
    row: 4,
    col: 5,
    emoji: '💶',
    label: '€450 Fooi',
    info: 'Paul geeft de gérant 450 euro fooi zodat hij belooft dat hij Paul en Michel nooit in de tuin heeft gezien. Zo wordt een cruciale getuige omgekocht.',
    interior: 'restaurant',
    pulsePhase: 0,
  },
  {
    id: 'wijn',
    row: 3,
    col: 8,
    emoji: '🍷',
    label: 'Fles Wijn',
    info: 'De fijne wijn die bij het diner wordt geschonken. Serge bestelt altijd het duurste van het duurste — iets wat Paul enorm irriteert.',
    interior: 'restaurant',
    pulsePhase: 1.5,
  },
  {
    id: 'menu',
    row: 6,
    col: 3,
    emoji: '📜',
    label: 'Het Menu',
    info: 'De vijf gangen van het diner vormen de vijf bedrijven van het verhaal: Aperitief, Voorgerecht, Hoofdgerecht, Dessert, en Digestief — plus de Epiloog als Fooi.',
    interior: 'restaurant',
    pulsePhase: 3,
  },
];

const cafeObjects: GameObject[] = [
  {
    id: 'krant',
    row: 3,
    col: 4,
    emoji: '📰',
    label: 'De Krant',
    info: 'In de krant staat een artikel over de aanval bij de pinautomaat. De beelden van de bewakingscamera worden steeds vaker vertoond op het nieuws.',
    interior: 'cafe',
    pulsePhase: 0,
  },
  {
    id: 'tv_screen',
    row: 2,
    col: 7,
    emoji: '📺',
    label: 'TV Nieuws',
    info: 'Op de televisie worden de bewakingsbeelden getoond van de pinautomaat. De daders zijn niet herkenbaar, maar de families weten precies wie het zijn.',
    interior: 'cafe',
    pulsePhase: 2,
  },
];

const huisObjects: GameObject[] = [
  {
    id: 'telefoon_interior',
    row: 4,
    col: 3,
    emoji: '📱',
    label: 'Michels Telefoon',
    info: 'Op deze telefoon staat de zelfgemaakte video: Michel en Rick mishandelen een dakloze vrouw bij een pinautomaat. Paul bekijkt de video stiekem. De video werd ook geüpload als "Men in Black III" op YouTube.',
    interior: 'huis',
    pulsePhase: 0,
  },
  {
    id: 'formulier_interior',
    row: 3,
    col: 7,
    emoji: '📋',
    label: 'Vruchtwateronderzoek',
    info: 'Een medisch formulier dat Paul na het diner vindt. Het vakje "bijzonderheden" is volgeschreven, "keuze ouders" aangekruist. Claire heeft dit stiekem laten doen — de uitslag suggereert dat Michel Pauls erfelijke aandoening heeft.',
    interior: 'huis',
    pulsePhase: 1,
  },
  {
    id: 'medicijnen',
    row: 6,
    col: 5,
    emoji: '💊',
    label: 'Pauls Medicijnen',
    info: 'Paul slikt al een tijdje zijn medicijnen niet meer. Hij heeft een erfelijke aandoening die leidt tot gewelddadige woedeaanvallen. Door te stoppen met medicijnen wordt hij onvoorspelbaar.',
    interior: 'huis',
    pulsePhase: 2.5,
  },
];

export const INTERIORS: Record<string, Interior> = {
  restaurant: {
    id: 'restaurant',
    name: '🍽️ Restaurant',
    emoji: '🍽️',
    width: 12,
    height: 10,
    map: createInteriorMap(12, 10, (map) => {
      // Tables
      map[3][3] = T.TABLE; map[3][4] = T.TABLE;
      map[3][7] = T.TABLE; map[3][8] = T.TABLE;
      map[6][3] = T.TABLE; map[6][4] = T.TABLE;
      map[6][7] = T.TABLE; map[6][8] = T.TABLE;
      // Chairs around tables
      map[2][3] = T.CHAIR; map[2][4] = T.CHAIR;
      map[4][3] = T.CHAIR; map[4][4] = T.CHAIR;
      map[2][7] = T.CHAIR; map[2][8] = T.CHAIR;
      map[4][7] = T.CHAIR; map[4][8] = T.CHAIR;
      map[5][3] = T.CHAIR; map[5][4] = T.CHAIR;
      map[7][3] = T.CHAIR; map[7][4] = T.CHAIR;
      map[5][7] = T.CHAIR; map[5][8] = T.CHAIR;
      map[7][7] = T.CHAIR; map[7][8] = T.CHAIR;
      // Door
      map[9][6] = T.DOOR;
    }),
    spawnRow: 8,
    spawnCol: 6,
    exitRow: 9,
    exitCol: 6,
    exitWorldRow: 15,
    exitWorldCol: 23,
    objects: restaurantObjects,
    ambientColor: 'rgba(255, 200, 100, 0.08)',
  },
  cafe: {
    id: 'cafe',
    name: '☕ Café',
    emoji: '☕',
    width: 10,
    height: 8,
    map: createInteriorMap(10, 8, (map) => {
      // Bar counter
      for (let c = 2; c <= 7; c++) map[1][c] = T.TABLE;
      // Seating
      map[3][2] = T.TABLE; map[3][3] = T.CHAIR;
      map[3][6] = T.TABLE; map[3][7] = T.CHAIR;
      map[5][2] = T.TABLE; map[5][3] = T.CHAIR;
      map[5][6] = T.TABLE; map[5][7] = T.CHAIR;
      // Door
      map[7][5] = T.DOOR;
    }),
    spawnRow: 6,
    spawnCol: 5,
    exitRow: 7,
    exitCol: 5,
    exitWorldRow: 39,
    exitWorldCol: 46,
    objects: cafeObjects,
    ambientColor: 'rgba(200, 150, 100, 0.1)',
  },
  huis: {
    id: 'huis',
    name: '🏠 Huis Paul & Claire',
    emoji: '🏠',
    width: 10,
    height: 9,
    map: createInteriorMap(10, 9, (map) => {
      // Living room furniture
      map[2][2] = T.TABLE; map[2][3] = T.TABLE; // couch
      map[2][6] = T.TABLE; // desk
      map[2][7] = T.CHAIR;
      map[5][2] = T.TABLE; map[5][3] = T.TABLE; // dining table
      map[5][6] = T.CHAIR; map[5][7] = T.CHAIR;
      map[4][2] = T.CHAIR; map[4][3] = T.CHAIR;
      map[6][2] = T.CHAIR; map[6][3] = T.CHAIR;
      // Door
      map[8][5] = T.DOOR;
    }),
    spawnRow: 7,
    spawnCol: 5,
    exitRow: 8,
    exitCol: 5,
    exitWorldRow: 25,
    exitWorldCol: 14,
    objects: huisObjects,
    ambientColor: 'rgba(255, 240, 200, 0.1)',
  },
};

// Map door tiles on world map to interior IDs
export const DOOR_MAP: Record<string, string> = {
  '14,23': 'restaurant',
  '24,14': 'huis',
  '38,46': 'cafe',
};
