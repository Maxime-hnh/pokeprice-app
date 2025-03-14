import { Card } from "../_interfaces/card.interface";
import { handleResponse } from "../_helpers/handleResponse";
import { authHeader } from "../_helpers/auth-header";
import { cardStore } from "../_store/card.store";

const UPDATE_EBAYPRICES_URL = import.meta.env.VITE_FIREBASE_FUNCTION_UPDATE_EBAYPRICES_FOR_CARDID;


class CardService {
  constructor() {
  };

  getAll = async (): Promise<Card[]> => {
    const requestOptions = {
      method: 'GET',
      headers: authHeader(),
    };
    return await handleResponse(await fetch(`/api/cards`, requestOptions));
  };

  getById = async (id: number): Promise<Card | void> => {
    const requestOptions = {
      method: 'GET',
      headers: authHeader(),
    };
    return await handleResponse(await fetch(`/api/cards/${id}`, requestOptions));
  };

  getCardsByIdsForWishList = async (ids: number[]): Promise<Card[]> => {
    const requestOptions = {
      method: 'GET',
      headers: authHeader(),
    };
    return await handleResponse(await fetch(`/api/cards/ids/${ids}`, requestOptions));
  };

  //
  updateEbayPrices = async (serieId: string, setId: string, cardId: string): Promise<Card | void> => {
    const requestOptions: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    }
    try {
      const response = await handleResponse(
        await fetch(`${UPDATE_EBAYPRICES_URL}?serieId=${encodeURIComponent(serieId)}&setId=${encodeURIComponent(setId)}&cardId=${encodeURIComponent(cardId)}`, requestOptions)
      );
      return response;
    } catch (error) {
      console.error("Erreur lors de l'appel à Firebase :", error);
      throw error;
    }
  }

  filterByRarity = (rarities: string[]): Card[] => {
    return cardStore.cards.filter(card => rarities.includes(card.rarity))
  };
}

export const cardService = new CardService();