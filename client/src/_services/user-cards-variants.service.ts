import { authHeader } from "../_helpers/auth-header";
import { handleResponse } from "../_helpers/handleResponse";
import { FetchedUserCardVariantProps } from "../_interfaces/user-card-variants.interface";
import { cardStore } from "../_store/card.store";

class UserCardVariantsService {
  constructor() {
  };

  linkOrUpdateUserCardVariant = async (cardId: number, cardVariantId: number, body: { type: string }): Promise<void> => {
    const requestOptions = {
      method: 'POST',
      headers: authHeader(),
      body: JSON.stringify(body)
    };
    return await handleResponse(await fetch(`/api/userCardVariants/card/${cardId}/cardVariant/${cardVariantId}`, requestOptions));
  };

  unlinkUserCardVariant = async (cardId: number, cardVariantId: number): Promise<void> => {
    const requestOptions = {
      method: 'DELETE',
      headers: authHeader(),
    };
    return await handleResponse(await fetch(`/api/userCardVariants/card/${cardId}/cardVariant/${cardVariantId}`, requestOptions));
  };

  getAllUserCardsByUserId = async (): Promise<void> => {
    const requestOptions = {
      method: 'GET',
      headers: authHeader(),
    };
    const response = await handleResponse(await fetch(`/api/userCardVariants`, requestOptions));
    return cardStore.setMyCards(response);
  };

  getAllOwnedUserCardsByUserId = async (): Promise<void> => {
    const requestOptions = {
      method: 'GET',
      headers: authHeader(),
    };
    const response = await handleResponse(await fetch(`/api/userCardVariants/owned`, requestOptions));
    return cardStore.setMyCards(response);
  };

  getAllWishListUserCardsByUserId = async (): Promise<FetchedUserCardVariantProps[] | void> => {
    const requestOptions = {
      method: 'GET',
      headers: authHeader(),
    };
    const response = await handleResponse(await fetch(`/api/userCardVariants/wishList`, requestOptions));
    cardStore.setMyWishList(response);
    return response;
  };

  ownedCardVariant = (
    myCards: FetchedUserCardVariantProps[],
    cardId: number,
    cardVariantId: number
  ): boolean => {
    return myCards.some(card => card.cardId === cardId && card.cardVariantId === cardVariantId && card.type === "own");
  };

  existInWishList = (
    wishListCards: FetchedUserCardVariantProps[],
    cardId: number,
    cardVariantId: number
  ): boolean => {
    return wishListCards.some(card => card.cardId === cardId && card.cardVariantId === cardVariantId && card.type === "wishList");
  };


}

export const userCardVariantsService = new UserCardVariantsService();