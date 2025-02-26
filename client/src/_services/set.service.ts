import { authHeader } from "../_helpers/auth-header";
import { handleResponse } from "../_helpers/handleResponse";
import { Set } from "../_interfaces/set.interface";

class SetService {

  constructor() { }

  getSets = async (): Promise<Set[]> => {
    const requestOptions = {
      method: 'GET',
      headers: authHeader(),
    };
    return await handleResponse(await fetch(`/api/sets`, requestOptions));
  };

  getSetById = async (id: string): Promise<Set | void> => {
    const requestOptions = {
      method: 'GET',
      headers: authHeader(),
    };
    return await handleResponse(await fetch(`/api/sets/${id}`, requestOptions));
  };
};

export const setService = new SetService();