import { Card, CardBrief } from "../_interfaces/card.interface";
import { handleResponse } from "../_helpers/handleResponse";
import { sanitizeKey } from "../_helpers/helpers";
import { authHeader } from "../_helpers/auth-header";

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
        await fetch(`${UPDATE_EBAYPRICES_URL}?serieId=${encodeURIComponent(serieId)}&setId=${encodeURIComponent(sanitizeKey(setId))}&cardId=${encodeURIComponent(cardId)}`, requestOptions)
      );
      return response;
    } catch (error) {
      console.error("Erreur lors de l'appel à Firebase :", error);
      throw error;
    }
  }
}

export const cardService = new CardService();