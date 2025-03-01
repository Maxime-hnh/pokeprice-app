import { CardCount } from "./set.interface";

export enum Rarity {
  COMMON = "Commune", //✅
  DOUBLE_RARE = "Double rare", //✅
  TRAINER_FULL_ART = "Dresseur Full Art", //✅
  HIGH_TECH_RARE = "HIGH-TECG rare", //✅
  HOLO_RARE = "Holo Rare", //✅
  HOLO_RARE_V = "Holo Rare V", //✅
  HOLO_RARE_VMAX = "Holo Rare VMAX", //✅
  HOLO_RARE_VSTAR = "Holo Rare VSTAR", //✅
  HYPER_RARE = "Hyper rare", //✅
  ILLUSTRATION_RARE = "Illustration rare", //✅
  SPECIAL_ILLUSTRATION_RARE = "Illustration spéciale rare", //✅
  LEGEND = "LÉGENDE", //✅
  MAGNIFICENT = "Magnifique",//✅
  SECRET_RARE = "Magnifique rare", //✅
  UNCOMMON = "Peu Commune", //✅
  RADIANT_RARE = "Radieux Rare",  //✅
  RARE = "Rare", //✅
  RARE_HOLO = "Rare Holo", //✅
  RARE_HOLO_LVX = "Rare Holo LV.X", //✅
  RARE_PRIME = "Rare Prime",//✅
  NO_RARITY = "Sans Rareté",
  SHINY_RARE = "Shiny rare", //✅ 
  SHINY_RARE_V = "Shiny rare V", //✅ 
  SHINY_RARE_VMAX = "Shiny rare VMAX", //✅
  ULTRA_RARE = "Ultra Rare", //✅
  CHROMATIC_ULTRA_RARE = "Chromatique ultra rare"
}


interface Variants {
  cardId: number;
  cardVariantId: number;
  cardVariant?: any;
}


export interface Card {
  id: number;
  uid: string;
  code: string;
  localId: string;
  name: string;
  image: string;
  category: string;
  illustrator: string;
  rarity: Rarity;
  variants: Variants[];
  cardCount?: CardCount;

  averagePrice?: number;
  highestPrice?: number;
  lowestPrice?: number;
  lastPriceUpdate?: string | null;
  ebaySearchContent?: string;

  setId: number;
  updatedAt: Date;
  //when binderList
};

export interface CardWithVariantId extends Card {
  variantType: string;
  cardVariantId: number;
}

export interface CardBrief {
  id: string;
  localId: string;
  name: string;
  image: string;

  averagePrice?: number;
  highestPrice?: number;
  lowestPrice?: number;
  ebaySearchContent?: string;

  rarity?: string;
  variants?: Variants;

  createdat?: string;
  lastPriceUpdate?: string | null;
  cardCount?: CardCount;
}