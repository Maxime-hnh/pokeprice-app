import { authHeader } from "../_helpers/auth-header";
import { handleResponse } from "../_helpers/handleResponse";

class UserCardService {
  constructor() {
  };

  addUserCard = async (data: any) => {
    const requestOptions = {
      method: 'POST',
      headers: authHeader(),
      body: JSON.stringify(data),
    };
    return await handleResponse(await fetch(`/api/userCards`, requestOptions));
  };
}

export const userCardService = new UserCardService();