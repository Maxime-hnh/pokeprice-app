import { authHeader } from "../_helpers/auth-header";
import { handleResponse } from "../_helpers/handleResponse";
import { User } from "../_interfaces/user.interface";

class UserService {
  constructor() { }


  getUserById = async (id: string): Promise<User | void> => {
    const requestOptions = {
      method: 'GET',
      headers: authHeader(),
    };
    return await handleResponse(await fetch(`/api/users/${id}`, requestOptions));
  };

  getUserByEmail = async (email: string): Promise<User | void> => {
    const requestOptions = {
      method: 'GET',
      headers: authHeader(),
    };
    return await handleResponse(await fetch(`/api/users/email/${encodeURI(email)}`, requestOptions));
  };
};

export const userService = new UserService();