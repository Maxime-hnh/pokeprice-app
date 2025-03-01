import { Card, CardWithVariantId } from "../_interfaces/card.interface";
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

export const formatCardCount = (card: Card, countOfficial: number) => {
  if (card.localId.startsWith('GG')) return `${card.localId}/${card.ebaySearchContent?.slice(-4)}`
  if (card.localId.startsWith('TG')) return `${card.localId}/${card.ebaySearchContent?.slice(-4)}`
  return `${card.localId}/${countOfficial}`
}