import { RubbishCategoryInfo, RubbishType, TrashItemDef } from '../types';

export const RUBBISH_CATEGORIES: Record<RubbishType, RubbishCategoryInfo> = {
  electronics: {
    id: 'electronics',
    label: 'Electronics',
    shortLabel: 'Electronics',
    color: 'indigo',
    badgeBg: 'bg-indigo-600/30',
    badgeBorder: 'border-indigo-400/60',
    textColor: 'text-indigo-300',
    accentHex: '#818cf8',
    iconName: 'Cpu',
    hint: 'Devices with circuit boards, chips, or screens',
  },
  glass: {
    id: 'glass',
    label: 'Glass',
    shortLabel: 'Glass',
    color: 'cyan',
    badgeBg: 'bg-cyan-600/30',
    badgeBorder: 'border-cyan-400/60',
    textColor: 'text-cyan-300',
    accentHex: '#22d3ee',
    iconName: 'Wine',
    hint: 'Items made of transparent or molded silica glass',
  },
  paper_cardboard: {
    id: 'paper_cardboard',
    label: 'Paper / Cardboard',
    shortLabel: 'Paper & Cardboard',
    color: 'amber',
    badgeBg: 'bg-amber-600/30',
    badgeBorder: 'border-amber-400/60',
    textColor: 'text-amber-300',
    accentHex: '#fbbf24',
    iconName: 'Package',
    hint: 'Items made from wood pulp, paper sheets, or cartons',
  },
  metal: {
    id: 'metal',
    label: 'Metal',
    shortLabel: 'Metal',
    color: 'slate',
    badgeBg: 'bg-slate-500/30',
    badgeBorder: 'border-slate-300/60',
    textColor: 'text-slate-200',
    accentHex: '#cbd5e1',
    iconName: 'Shield',
    hint: 'Items made of aluminum, tin, steel, or metallic components',
  },
  plastic: {
    id: 'plastic',
    label: 'Plastic',
    shortLabel: 'Plastic',
    color: 'emerald',
    badgeBg: 'bg-emerald-600/30',
    badgeBorder: 'border-emerald-400/60',
    textColor: 'text-emerald-300',
    accentHex: '#34d399',
    iconName: 'Recycle',
    hint: 'Polymers, synthetic containers, and plastic packaging',
  },
};

export const RUBBISH_TYPE_LIST: RubbishType[] = [
  'electronics',
  'glass',
  'paper_cardboard',
  'metal',
  'plastic',
];

/**
 * The 10 items exactly matching user specification:
 * Electronics: computers, TV
 * Glass: computer, jar, TV
 * Paper/cardboard: cereal box, magazine, milk carton
 * Metal: aluminum foil, tin can, TV
 * Plastic: bag, bottle, computer
 */
export const TRASH_ITEMS: TrashItemDef[] = [
  {
    id: 'computer',
    name: 'Computer',
    article: 'a',
    categories: ['electronics', 'glass', 'plastic'],
    weight: 2.2,
    explanation: 'A computer contains electronic chips, a glass screen, and plastic parts!',
    descriptionForStudents: 'Matches: Electronics, Glass, Plastic',
    svgType: 'computer',
  },
  {
    id: 'tv',
    name: 'TV',
    article: 'a',
    categories: ['electronics', 'glass', 'metal'],
    weight: 2.5,
    explanation: 'A TV has electronic circuit boards, a glass display, and metal frame parts!',
    descriptionForStudents: 'Matches: Electronics, Glass, Metal',
    svgType: 'tv',
  },
  {
    id: 'bottle',
    name: 'Bottle',
    article: 'a',
    categories: ['plastic'],
    weight: 1.0,
    explanation: 'A plastic beverage bottle is made of recyclable PET plastic!',
    descriptionForStudents: 'Matches: Plastic',
    svgType: 'bottle',
  },
  {
    id: 'jar',
    name: 'Jar',
    article: 'a',
    categories: ['glass'],
    weight: 1.6,
    explanation: 'A food jar (like jam or pickle jar) is made of recyclable glass!',
    descriptionForStudents: 'Matches: Glass',
    svgType: 'jar',
  },
  {
    id: 'aluminum_foil',
    name: 'Aluminium Foil',
    article: '',
    categories: ['metal'],
    weight: 0.9,
    explanation: 'Aluminium foil is a thin, flexible sheet made of pure metal!',
    descriptionForStudents: 'Matches: Metal',
    svgType: 'aluminum_foil',
  },
  {
    id: 'milk_carton',
    name: 'Milk Carton',
    article: 'a',
    categories: ['paper_cardboard'],
    weight: 1.1,
    explanation: 'A milk carton is constructed primarily from coated paperboard / cardboard!',
    descriptionForStudents: 'Matches: Paper / Cardboard',
    svgType: 'milk_carton',
  },
  {
    id: 'tin_can',
    name: 'Tin Can',
    article: 'a',
    categories: ['metal'],
    weight: 1.3,
    explanation: 'A canned food or soda container is made of metal (tin or steel)!',
    descriptionForStudents: 'Matches: Metal',
    svgType: 'tin_can',
  },
  {
    id: 'cereal_box',
    name: 'Cereal Box',
    article: 'a',
    categories: ['paper_cardboard'],
    weight: 1.0,
    explanation: 'A breakfast cereal box is made of recyclable cardboard!',
    descriptionForStudents: 'Matches: Paper / Cardboard',
    svgType: 'cereal_box',
  },
  {
    id: 'magazine',
    name: 'Magazine',
    article: 'a',
    categories: ['paper_cardboard'],
    weight: 1.2,
    explanation: 'A glossy magazine is printed on recyclable paper pages!',
    descriptionForStudents: 'Matches: Paper / Cardboard',
    svgType: 'magazine',
  },
  {
    id: 'bag',
    name: 'Bag',
    article: 'a',
    categories: ['plastic'],
    weight: 0.8,
    explanation: 'A shopping carrier bag is made of lightweight polyethylene plastic!',
    descriptionForStudents: 'Matches: Plastic',
    svgType: 'bag',
  },
];

export const TRASH_ITEMS_MAP = new Map<string, TrashItemDef>(
  TRASH_ITEMS.map((item) => [item.id, item])
);

/**
 * Check whether a specific item matches the requested target rubbish category
 */
export function checkItemMatchesCategory(itemId: string, category: RubbishType): boolean {
  const item = TRASH_ITEMS_MAP.get(itemId);
  if (!item) return false;
  return item.categories.includes(category);
}

/**
 * Helper to get all items matching a category
 */
export function getItemsForCategory(category: RubbishType): TrashItemDef[] {
  return TRASH_ITEMS.filter((item) => item.categories.includes(category));
}
