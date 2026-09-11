const fs = require('fs');
const path = require('path');

const svgContent = fs.readFileSync(path.join(__dirname, '../public/ukraine-map.svg'), 'utf8');

const regex = /<path[\s\S]*?d="([\s\S]*?)"[\s\S]*?aria-label="([\s\S]*?)"[\s\S]*?id="([\s\S]*?)"[\s\S]*?\/>/g;
let match;
const regions = [];

const UKRAINIAN_NAMES = {
  'cherkasy': 'Черкаська область',
  'chernihiv': 'Чернігівська область',
  'chernivtsi': 'Чернівецька область',
  'crimea': 'Автономна Республіка Крим',
  'dnipropetrovsk': 'Дніпропетровська область',
  'donetsk': 'Донецька область',
  'ivano-frankivsk': 'Івано-Франківська область',
  'kharkiv': 'Харківська область',
  'kherson': 'Херсонська область',
  'khmelnytskyi': 'Хмельницька область',
  'kirovohrad': 'Кіровоградська область',
  'kyiv': 'Київська область',
  'kyiv-city': 'м. Київ',
  'luhansk': 'Луганська область',
  'lviv': 'Львівська область',
  'mykolaiv': 'Миколаївська область',
  'odessa': 'Одеська область',
  'poltava': 'Полтавська область',
  'rivne': 'Рівненська область',
  'sumy': 'Сумська область',
  'ternopil': 'Тернопільська область',
  'vinnytsia': 'Вінницька область',
  'volyn': 'Волинська область',
  'zakarpattia': 'Закарпатська область',
  'zaporizhia': 'Запорізька область',
  'zhytomyr': 'Житомирська область'
};

// Also map which city ID in CITIES corresponds to which region ID(s)
// e.g. kyiv -> kyiv and kyiv-city, lviv -> lviv, etc.
const CITY_TO_REGIONS = {
  'kyiv': ['kyiv-city', 'kyiv'],
  'lviv': ['lviv'],
  'dnipro': ['dnipropetrovsk'],
  'kharkiv': ['kharkiv'],
  'odesa': ['odessa'],
  'vinnytsia': ['vinnytsia'],
  'poltava': ['poltava'],
  'lutsk': ['volyn'],
  'if': ['ivano-frankivsk'],
  'uzhhorod': ['zakarpattia'],
  'zaporizhzhia': ['zaporizhia'],
  'ternopil': ['ternopil'],
  'cherkasy': ['cherkasy'],
  'chernivtsi': ['chernivtsi']
};

while ((match = regex.exec(svgContent)) !== null) {
  const d = match[1].replace(/\s+/g, ' ').trim();
  const label = match[2].trim();
  const id = match[3].trim();
  regions.push({
    id,
    label,
    nameUa: UKRAINIAN_NAMES[id] || label,
    d
  });
}

const outputTs = `// Auto-generated genuine map of Ukraine regions from @svg-maps/ukraine
// Total regions: ${regions.length} (24 Oblasts, Kyiv City, Autonomous Republic of Crimea)

export interface UkraineRegion {
  id: string;
  label: string;
  nameUa: string;
  d: string;
}

export const UKRAINE_REGIONS: UkraineRegion[] = ${JSON.stringify(regions, null, 2)};

export const CITY_TO_REGIONS: Record<string, string[]> = ${JSON.stringify(CITY_TO_REGIONS, null, 2)};
`;

const outDir = path.join(__dirname, '../src/data');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
fs.writeFileSync(path.join(outDir, 'ukraineMapRegions.ts'), outputTs, 'utf8');
console.log(`Successfully generated src/data/ukraineMapRegions.ts with ${regions.length} regions!`);
