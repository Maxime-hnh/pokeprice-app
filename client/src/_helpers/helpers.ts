import { Card, CardWithVariantId, Rarity } from "../_interfaces/card.interface";
import { FetchedUserCardVariantProps } from "../_interfaces/user-card-variants.interface";


export async function retryOriginalRequest(originalResponse: Response, newToken: string): Promise<any> {
  const originalRequest = {
    method: originalResponse.url,
    headers: {
      ...originalResponse.headers,
      'Authorization': `Bearer ${newToken}`
    },
    body: originalResponse.body
  };

  const retryResponse = await fetch(originalResponse.url, originalRequest);
  const retryText = await retryResponse.text();
  return retryText && JSON.parse(retryText);
};


export const countOwnedCards = (allCards: CardWithVariantId[], ownedCards: FetchedUserCardVariantProps[]) => {
  const ownedSet = new Set(ownedCards.map((card: any) => `${card.cardId}_${card.cardVariantId}`));
  return allCards.reduce((count: number, card: any) => {
    const key = `${card.id}_${card.cardVariantId}`;
    return count + (ownedSet.has(key) ? 1 : 0);
  }, 0);
};

export const formatCardCount = (card: Card, countOfficial: number): string => {
  if (card.localId.startsWith('GG')) return `${card.localId}/${card.ebaySearchContent?.slice(-4)}`
  if (card.localId.startsWith('TG')) return `${card.localId}/${card.ebaySearchContent?.slice(-4)}`
  return `${card.localId}/${countOfficial}`
};

export const getRarityLogo = (rarity: Rarity): string => {
  const commonList = [Rarity.COMMON]
  const uncommonList = [Rarity.UNCOMMON]
  const holoList = [Rarity.HOLO_RARE]
  const rareList = [Rarity.RARE, Rarity.RARE_HOLO]
  const doubleRareList = [Rarity.DOUBLE_RARE]
  const arList = [Rarity.ILLUSTRATION_RARE]
  const ultraRareList = [Rarity.ULTRA_RARE]
  const sarList = [Rarity.SPECIAL_ILLUSTRATION_RARE]
  const hyperRareList = [Rarity.HYPER_RARE]
  const highTechList = [Rarity.HIGH_TECH_RARE]
  const magnificentList = [Rarity.MAGNIFICENT]
  const promoList = [Rarity.NO_RARITY]
  const secretRareList = [Rarity.SECRET_RARE, Rarity.HOLO_RARE_V, Rarity.HOLO_RARE_VMAX, Rarity.HOLO_RARE_VSTAR, Rarity.SHINY_RARE_VMAX, Rarity.SHINY_RARE_V, Rarity.SHINY_RARE, Rarity.RARE_HOLO_LVX, Rarity.RADIANT_RARE, Rarity.LEGEND, Rarity.TRAINER_FULL_ART, Rarity.RARE_PRIME]

  switch (true) {
    case commonList.includes(rarity):
      return '/assets/rarities/rarity_common.png';
    case uncommonList.includes(rarity):
      return '/assets/rarities/rarity_uncommon.png';
    case uncommonList.includes(rarity):
      return '/assets/rarities/rarity_uncommon.png';
    case holoList.includes(rarity):
      return '/assets/rarities/rarity_holo.png';
    case rareList.includes(rarity):
      return '/assets/rarities/rarity_rare.png';
    case doubleRareList.includes(rarity):
      return '/assets/rarities/rarity_double_rare.png';
    case arList.includes(rarity):
      return '/assets/rarities/rarity_AR.png';
    case ultraRareList.includes(rarity):
      return '/assets/rarities/rarity_ultra_rare.png';
    case sarList.includes(rarity):
      return '/assets/rarities/rarity_SAR.png';
    case hyperRareList.includes(rarity):
      return '/assets/rarities/rarity_hyper_rare.png';
    case highTechList.includes(rarity):
      return '/assets/rarities/rarity_high_tech_rare.png';
    case magnificentList.includes(rarity):
      return '/assets/rarities/rarity_magnificent.png';
    case promoList.includes(rarity):
      return '/assets/rarities/rarity_promo.png';
    case secretRareList.includes(rarity):
      return '/assets/rarities/rarity_secret_rare.png';
    default:
      ""
  }
  return ""
}

export const growLogoSizeList = [Rarity.DOUBLE_RARE, Rarity.ILLUSTRATION_RARE, Rarity.HIGH_TECH_RARE, Rarity.HYPER_RARE, Rarity.SPECIAL_ILLUSTRATION_RARE, Rarity.ULTRA_RARE];