import { authHeader } from "../_helpers/auth-header";
import { handleResponse } from "../_helpers/handleResponse";
import { FetchedUserCardVariantProps } from "../_interfaces/user-card-variants.interface";

class UserCardVariantsService {
  constructor() {
  };

  linkUserCardVariant = async (cardId: number, cardVariantId: number) => {
    const requestOptions = {
      method: 'POST',
      headers: authHeader(),
    };
    return await handleResponse(await fetch(`/api/userCardVariants/card/${cardId}/cardVariant/${cardVariantId}`, requestOptions));
  };

  unlinkUserCardVariant = async (cardId: number, cardVariantId: number) => {
    const requestOptions = {
      method: 'DELETE',
      headers: authHeader(),
    };
    return await handleResponse(await fetch(`/api/userCardVariants/card/${cardId}/cardVariant/${cardVariantId}`, requestOptions));
  };

  getAllUserCardsByUserId = async () => {
    const requestOptions = {
      method: 'GET',
      headers: authHeader(),
    };
    return await handleResponse(await fetch(`/api/userCardVariants`, requestOptions));
  };

  ownedCardVariant = (
    myCards: FetchedUserCardVariantProps[],
    cardId: number,
    cardVariantId: number
  ): boolean => {
    return myCards.some(card => card.cardId === cardId && card.cardVariantId === cardVariantId);
  }
}

export const userCardVariantsService = new UserCardVariantsService();