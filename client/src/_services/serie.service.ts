import { authHeader } from "../_helpers/auth-header";
import { handleResponse } from "../_helpers/handleResponse";
import { Serie } from "../_interfaces/serie.interface";

class SerieService {

  constructor() { }

  getSeries = async (): Promise<Serie[]> => {
    const requestOptions = {
      method: 'GET',
      headers: authHeader(),
    };
    return await handleResponse(await fetch(`/api/series`, requestOptions));
  };

  getSerieById = async (id: number): Promise<Serie | void> => {
    const requestOptions = {
      method: 'GET',
      headers: authHeader(),
    };
    return await handleResponse(await fetch(`/api/series/${id}`, requestOptions));
  };
};

export const serieService = new SerieService();