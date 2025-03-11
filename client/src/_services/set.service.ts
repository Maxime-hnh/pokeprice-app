import { authHeader } from "../_helpers/auth-header";
import { handleResponse } from "../_helpers/handleResponse";
import { Set } from "../_interfaces/set.interface";
import { cardStore } from "../_store/card.store";
import { setStore } from "../_store/set.store";

class SetService {

  constructor() { }

  getSets = async (): Promise<Set[]> => {
    const requestOptions = {
      method: 'GET',
      headers: authHeader(),
    };
    return await handleResponse(await fetch(`/api/sets`, requestOptions));
  };

  getSetById = async (id: number): Promise<Set | void> => {
    const requestOptions = {
      method: 'GET',
      headers: authHeader(),
    };
    const response = await handleResponse(await fetch(`/api/sets/${id}`, requestOptions));
    setStore.setSet(response)
    cardStore.setCards(response.cards)
    return cardStore.setFilteredCards(response.cards)
  };
};

export const setService = new SetService();