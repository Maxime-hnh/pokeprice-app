import TCGdex from '@tcgdex/sdk'
import { Set } from '../_interfaces/set.interface';
import { handleResponse } from '../_helpers/handleResponse';
import { Serie } from '../_interfaces/serie.interface';
import { Card } from '../_interfaces/card.interface';


class TCGDexService {
  private tcgdex: TCGdex;

  constructor() {
    this.tcgdex = new TCGdex('fr');
  }


  getSeries = async (): Promise<Serie[] | void> => {
    return await handleResponse(await fetch('https://api.tcgdex.net/v2/fr/series?sort:field=releaseDate&sort:order=DESC'));
  };

  getSerieById = async (serieId: string): Promise<Serie | void> => {
    return await handleResponse(await fetch(`https://api.tcgdex.net/v2/fr/series/${serieId}`))
  }

  getSets = async (): Promise<Set[] | void> => {
    return await handleResponse(await fetch('https://api.tcgdex.net/v2/fr/sets?sort:field=releaseDate&sort:order=DESC'));
  };

  getSetById = async (setId: string): Promise<Set | void> => {
    return await handleResponse(await fetch(`https://api.tcgdex.net/v2/fr/sets/${setId}`))
  }

  getCardById = async (cardId: string): Promise<Card | void> => {
    return await handleResponse(await fetch(`https://api.tcgdex.net/v2/fr/cards/${cardId}`))
  }


  searchCard = async (searchValue: string, serie?: string): Promise<Card[] | void> => {
    if (serie) {
      return await handleResponse(await fetch(`https://api.tcgdex.net/v2/fr/cards?id=like:${serie}&name=like:${searchValue}`));
    } else {
      const cards = await handleResponse(await fetch(`https://api.tcgdex.net/v2/fr/cards?name=like:${encodeURIComponent(searchValue)}`))
      if (cards) {
        const fullCardsData = await Promise.all(cards.map(async (card: any) => {
          const fullDataCard = await this.getCardById(card.id);
          const set = await this.getSetById((fullDataCard as any)!.set.id);
          return {
            ...fullDataCard,
            cardCount: set ? { official: set.cardCount.official } : {}
          };
        }));
        return fullCardsData;
      }
    }
  }

  getImageUrl(url: string, extension: string, quality?: string): string | undefined {
    if (url) {

      if (quality) {
        return `${url}/${quality}.${extension}`;
      } else {
        return `${url}.${extension}`;
      }
    } else {
      return undefined
    }
  };
}

export const tcgdexService = new TCGDexService();