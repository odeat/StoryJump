import { NPC, GameObject, Desk, BuildingLabel, BuildingDef, DialogueLine, PathArrow, QuizQuestion, Kiosk } from './types';

export const DIALOGUE: Record<string, DialogueLine[]> = {
  paul: [
    { speaker: 'Paul Lohman', text: 'Goedenavond. Ik ben Paul. Ik... ik ben hier gewoon om te eten. Meer niet. Er is niets bijzonders aan de hand.' },
    { speaker: 'Paul Lohman', text: 'Michel is een goede jongen. Soms doen jongens domme dingen. Dat betekent niet dat ze slecht zijn.' },
    { speaker: 'Paul Lohman', text: 'Ik heb een erfelijke aandoening. Dat klinkt erger dan het is. Ik slik al een tijdje geen medicijnen meer. Dat gaat prima.' },
    { speaker: 'Paul Lohman', text: 'Wij beschermen onze familie. Zo werkt het. Serge begrijpt dat niet, maar hij was altijd al een ijdeltuit.' },
    { speaker: 'Paul Lohman', text: 'Ik sta voor paal!' },
  ],
  claire: [
    { speaker: 'Claire Lohman', text: 'Paul is soms... moeilijk. Maar ik hou van hem, en van onze zoon Michel. We zijn een gelukkig gezin.' },
    { speaker: 'Claire Lohman', text: 'Ik heb misschien wat dingen verzwegen. Maar dat deed ik om iedereen te beschermen. Snap je dat niet?' },
    { speaker: 'Claire Lohman', text: 'Beau was een probleem. Dat is nu opgelost. Meer hoef ik daar niet over te zeggen.' },
    { speaker: 'Claire Lohman', text: 'Het vruchtwateronderzoek? Dat was... een voorzorgsmaatregel. Paul hoefde dat niet te weten.' },
  ],
  serge: [
    { speaker: 'Serge Lohman', text: 'Ik ben Serge. Je kent me misschien van het nieuws — gedoodverfde minister-president bij de komende verkiezingen.' },
    { speaker: 'Serge Lohman', text: 'Rick heeft iets vreselijks gedaan. Ik wil eerlijk zijn. Morgen hou ik een persconferentie. De waarheid moet eruit.' },
    { speaker: 'Serge Lohman', text: 'Paul noemt me een ijdeltuit. Misschien. Maar ik doe tenminste wát goed is, niet wat gemakkelijk is.' },
    { speaker: 'Serge Lohman', text: 'Babette en Paul willen me tegenhouden. Dat lukt ze niet. Mijn besluit staat vast.' },
  ],
  babette: [
    { speaker: 'Babette', text: 'Serge en ik zijn al achttien jaar samen. Ik geloof in zijn toekomst als politicus. Dat mogen ze me niet afpakken.' },
    { speaker: 'Babette', text: 'Rick is mijn kind. Maar Serge wil alles openbaar maken... dat kan ik niet toestaan.' },
    { speaker: 'Babette', text: 'Beau... Beau was altijd al anders. Hij paste niet echt bij ons gezin. Dat klinkt hard, maar het is de waarheid.' },
    { speaker: 'Babette', text: 'Ik heb met Claire gepraat. We zijn het eens. Serge moet worden tegengehouden.' },
  ],
  michel: [
    { speaker: 'Michel', text: 'Hé. Ik heb niks gedaan. Het was gewoon... een grapje. Dat mens lag toch al in de weg.' },
    { speaker: 'Michel', text: 'Beau heeft de video op YouTube gezet. Hij chanteert ons voor 3000 euro. Alsof dat mijn schuld is.' },
    { speaker: 'Michel', text: 'Mijn vader begrijpt me. Hij staat achter me. Oom Serge loopt gewoon de boel te verpesten.' },
    { speaker: 'Michel', text: 'Men in Black III. Zo noemden ze het filmpje. Grappig eigenlijk. Ze zagen er niet eens goed uit op de beelden.' },
  ],
};

export const createNPCs = (): NPC[] => [
  { id: 'paul', name: 'Paul Lohman', emoji: '🧔', color: '#2471a3', skinColor: '#e8b88a', spawnRow: 13, spawnCol: 18, row: 13, col: 18, dialogueIndex: 0, wanderTimer: 0, wanderDx: 0, wanderDy: 0, subX: 0, subY: 0 },
  { id: 'claire', name: 'Claire Lohman', emoji: '👩', color: '#a93226', skinColor: '#f0c8a0', spawnRow: 23, spawnCol: 12, row: 23, col: 12, dialogueIndex: 0, wanderTimer: 0, wanderDx: 0, wanderDy: 0, subX: 0, subY: 0 },
  { id: 'serge', name: 'Serge Lohman', emoji: '👔', color: '#1e8449', skinColor: '#e0a878', spawnRow: 36, spawnCol: 44, row: 36, col: 44, dialogueIndex: 0, wanderTimer: 0, wanderDx: 0, wanderDy: 0, subX: 0, subY: 0 },
  { id: 'babette', name: 'Babette', emoji: '👱‍♀️', color: '#d4ac0d', skinColor: '#f5d0a0', spawnRow: 37, spawnCol: 47, row: 37, col: 47, dialogueIndex: 0, wanderTimer: 0, wanderDx: 0, wanderDy: 0, subX: 0, subY: 0 },
  { id: 'michel', name: 'Michel', emoji: '🧒', color: '#884ea0', skinColor: '#e8b88a', spawnRow: 16, spawnCol: 28, row: 16, col: 28, dialogueIndex: 0, wanderTimer: 0, wanderDx: 0, wanderDy: 0, subX: 0, subY: 0 },
];

export const OVERWORLD_OBJECTS: GameObject[] = [
  { id: 'telefoon', row: 16, col: 18, emoji: '📱', label: 'Michels telefoon', info: "Op deze telefoon staat de zelfgemaakte video: Michel en Rick mishandelen een dakloze vrouw bij een pinautomaat. Paul bekijkt de video stiekem. De video werd ook geüpload als 'Men in Black III' op YouTube.", pulsePhase: 0 },
  { id: 'fooi', row: 26, col: 13, emoji: '💶', label: '€450 fooi', info: "Paul geeft de gérant 450 euro fooi zodat hij belooft dat hij Paul en Michel nooit in de tuin heeft gezien. Zo wordt een cruciale getuige omgekocht.", pulsePhase: 1.5 },
  { id: 'formulier', row: 40, col: 46, emoji: '📋', label: 'Vruchtwateronderzoek', info: "Een medisch formulier dat Paul na het diner vindt. Het vakje 'bijzonderheden' is volgeschreven, 'keuze ouders' aangekruist. Claire heeft dit stiekem laten doen — de uitslag suggereert dat Michel Pauls erfelijke aandoening heeft.", pulsePhase: 3 },
];

export const KIOSKS: Kiosk[] = [
  // Motieven
  {
    id: 'kiosk_moreel', row: 7, col: 10, title: '⚖️ Moreel Dilemma',
    category: 'motief', color: '#e74c3c',
    text: 'Het centrale morele dilemma: hoe ver ga je als ouder om je kind te beschermen? Paul en Claire kiezen ervoor om alles te verzwijgen. Serge wil eerlijk zijn. Maar wie heeft er gelijk als de consequenties zo groot zijn?',
  },
  {
    id: 'kiosk_erfelijk', row: 25, col: 20, title: '🧬 Erfelijkheid',
    category: 'motief', color: '#8e44ad',
    text: 'Paul heeft een erfelijke aandoening die leidt tot gewelddadige uitbarstingen. Het vruchtwateronderzoek suggereert dat Michel dezelfde aandoening heeft. Is geweld aangeleerd of zit het in de genen? Koch laat deze vraag bewust open.',
  },
  {
    id: 'kiosk_schijn', row: 30, col: 32, title: '🎭 Schijnheiligheid',
    category: 'motief', color: '#f39c12',
    text: 'Alle personages doen zich anders voor dan ze zijn. Het chique restaurant is een façade voor een vreselijk gesprek. Paul doet alsof hij een gewone vader is. Babette speelt de bezorgde moeder maar denkt alleen aan haar status.',
  },
  // Thema's
  {
    id: 'kiosk_ouder', row: 15, col: 25, title: '👨‍👩‍👦 Ouder-kind',
    category: 'thema', color: '#2ecc71',
    text: 'De relatie tussen ouders en kinderen staat centraal. Paul en Claire beschermen Michel blindelings. Serge worstelt met Rick. Babette ziet Beau als buitenstaander. Hoeveel is een ouder bereid op te offeren voor een kind?',
  },
  {
    id: 'kiosk_geweld', row: 44, col: 40, title: '🔥 Geweld',
    category: 'thema', color: '#c0392b',
    text: 'Geweld loopt als een rode draad door het verhaal. Michel en Rick verbranden een dakloze vrouw. Paul slaat een leraar in elkaar. Claire moedigt geweld aan. Is geweld erfelijk? Of is het een keuze die iedereen kan maken?',
  },
  {
    id: 'kiosk_politiek', row: 32, col: 15, title: '🏛️ Politiek & Macht',
    category: 'thema', color: '#3498db',
    text: 'Serge is kandidaat minister-president. Zijn politieke toekomst staat op het spel. Babette wil koste wat het kost first lady worden. De persconferentie wordt een wapen — maar wie controleert het verhaal?',
  },
  // Samenvattingen per bedrijf
  {
    id: 'kiosk_aperitief', row: 8, col: 22, title: '🥂 Aperitief',
    category: 'samenvatting', color: '#1abc9c',
    text: 'Het eerste bedrijf. De twee echtparen arriveren bij het restaurant. Paul ergert zich aan de pretentieuze sfeer en aan zijn broer Serge. Ondertussen worden hints gegeven over "het incident" waar ze het over moeten hebben.',
  },
  {
    id: 'kiosk_hoofd', row: 28, col: 42, title: '🥩 Hoofdgerecht',
    category: 'samenvatting', color: '#e67e22',
    text: 'Het keerpunt. Paul bekijkt stiekem de video op Michels telefoon: zijn zoon en neef Rick mishandelen een dakloze vrouw bij een pinautomaat. De spanning stijgt. Serge wil naar de politie, de anderen niet.',
  },
  {
    id: 'kiosk_digestief', row: 45, col: 48, title: '🍸 Digestief & Fooi',
    category: 'samenvatting', color: '#9b59b6',
    text: 'Het laatste bedrijf. De kaarten liggen op tafel. Paul geeft 450 euro fooi om de gérant het zwijgen op te leggen. Claire onthult dat ze Beau heeft laten "regelen". Het boek eindigt met Paul die het vruchtwateronderzoek vindt.',
  },
  // Personage-kiosken
  {
    id: 'kiosk_beau', row: 18, col: 30, title: '👦 Beau',
    category: 'personage', color: '#16a085',
    text: 'Beau is de geadopteerde zoon van Serge en Babette. Hij chanteert Michel en Rick voor 3000 euro met de video. Claire en Paul beschouwen hem als "het probleem" — met dramatische gevolgen.',
  },
  {
    id: 'kiosk_gerant', row: 38, col: 30, title: '🤵 De Gérant',
    category: 'personage', color: '#7f8c8d',
    text: 'De ober/manager van het restaurant. Hij wordt door Paul omgekocht met 450 euro fooi. Een stille getuige die uiteindelijk het zwijgen wordt opgelegd. Symbolisch voor hoe geld geweten kan kopen.',
  },
];

export const BUILDING_DEFS: BuildingDef[] = [
  { id: 'restaurant', topRow: 8, leftCol: 19, rows: 7, cols: 8, type: 'restaurant', roofColor: '#8B0000', wallColor: '#d4a574', accentColor: '#FFD700' },
  { id: 'huis', topRow: 20, leftCol: 11, rows: 5, cols: 6, type: 'house', roofColor: '#8B4513', wallColor: '#deb887', accentColor: '#87CEEB' },
  { id: 'cafe', topRow: 33, leftCol: 43, rows: 6, cols: 7, type: 'cafe', roofColor: '#2F4F4F', wallColor: '#a0522d', accentColor: '#FFE4B5' },
];

export const DESKS: Desk[] = [
  { id: 'desk_info', name: '💾 Info Terminal', row: 51, col: 46, emoji: '💾', screenColor: '#39ff14' },
  { id: 'desk_chat', name: '💬 Chat met de Bot', row: 51, col: 50, emoji: '💬', screenColor: '#ffb000' },
  { id: 'desk_quiz', name: '🧠 Kennisquiz', row: 51, col: 54, emoji: '🧠', screenColor: '#00cfff' },
];

export const BUILDING_LABELS: BuildingLabel[] = [
  { row: 7, col: 23, text: '🍽️ Restaurant', color: '#f0e6d3' },
  { row: 19, col: 14, text: '🏠 Huis Paul & Claire', color: '#f9e79f' },
  { row: 32, col: 46, text: '☕ Café', color: '#aed6f1' },
  { row: 53, col: 51, text: '📚 Studiehoek', color: '#39ff14' },
];

export const PATH_ARROWS: PathArrow[] = [
  { row: 4, col: 8, dir: 'right' }, { row: 4, col: 12, dir: 'right' },
  { row: 7, col: 15, dir: 'down' }, { row: 12, col: 15, dir: 'down' },
  { row: 15, col: 12, dir: 'left' }, { row: 15, col: 8, dir: 'left' },
  { row: 18, col: 8, dir: 'down' }, { row: 24, col: 8, dir: 'down' },
  { row: 28, col: 14, dir: 'right' }, { row: 28, col: 20, dir: 'right' },
  { row: 30, col: 25, dir: 'down' }, { row: 32, col: 32, dir: 'right' },
  { row: 34, col: 38, dir: 'right' }, { row: 36, col: 42, dir: 'right' },
  { row: 40, col: 45, dir: 'down' }, { row: 46, col: 52, dir: 'down' },
];

export const ALL_QUESTIONS: QuizQuestion[] = [
  { q: "Wie is de ik-verteller van Het Diner?", opts: ["Serge Lohman", "Paul Lohman", "Michel", "Babette"], ans: 1 },
  { q: "Wat deden Michel en Rick bij de pinautomaat?", opts: ["Een ruzie met de gerant", "Een portemonnee gestolen", "Een dakloze vrouw verbrand", "Een bankoverval"], ans: 2 },
  { q: "Welke prijs won Het Diner in 2009?", opts: ["Libris Literatuurprijs", "NS Publieksprijs", "Gouden Boekuil", "Booker Prize"], ans: 1 },
  { q: "Waarom geeft Paul 450 euro fooi aan de gerant?", opts: ["Het eten was uitstekend", "Om hem om te kopen als getuige", "Serge betaalde niet", "Uit royale gewoonte"], ans: 1 },
  { q: "Wat voor soort verteller is Paul?", opts: ["Alwetende verteller", "Betrouwbare ik-verteller", "Onbetrouwbare ik-verteller", "Auctoriale verteller"], ans: 2 },
  { q: "Wie wil als enige ouder open kaart spelen?", opts: ["Paul", "Claire", "Babette", "Serge"], ans: 3 },
  { q: "Hoe begint het sleutelhoofdstuk 21?", opts: ['"Dit is er gebeurd. Dit zijn de feiten."', '"Het was een geintje."', '"Zonder Claire was ik nergens geweest."', '"Exacte tijden kunnen zich later tegen je keren."'], ans: 0 },
  { q: "In hoeveel 'bedrijven' (gangen) is de roman opgebouwd?", opts: ["Drie", "Vier", "Vijf", "Zes"], ans: 2 },
  { q: "Wat is Serge Lohman van beroep?", opts: ["Rechter", "Arts", "Politicus", "Restauranthouder"], ans: 2 },
  { q: "Wat vindt Paul na het diner in een lade thuis?", opts: ["Michels dagboek", "Resultaten van een vruchtwateronderzoek", "Een brief van Beau", "Een recept"], ans: 1 },
  { q: "Hoe heet de geadopteerde zoon van Serge en Babette?", opts: ["Rick", "Beau", "Michel", "Valerie"], ans: 1 },
  { q: "Hoe heet Michels eigen video van de aanval op YouTube?", opts: ["Opsporing Verzocht", "Men in Black III", "Pinautomaat", "Dakloze video"], ans: 1 },
  { q: "Waarom wil Babette niet dat Serge stopt als lijsttrekker?", opts: ["Ze vindt het politiek fout", "Ze wil first lady worden", "Ze wil Rick beschermen", "Ze denkt Rick is onschuldig"], ans: 1 },
  { q: "Waar speelt het verhaal zich bijna volledig af?", opts: ["Huis Paul en Claire", "Op een boot", "Chic restaurant in Amsterdam", "In het parlement"], ans: 2 },
  { q: "Uit welk filmscript is het motto van het boek?", opts: ["Pulp Fiction", "Reservoir Dogs", "Goodfellas", "The Godfather"], ans: 1 },
];

export const STUDY_CENTER = { worldX: 51 * 32, worldY: 52 * 32 };
