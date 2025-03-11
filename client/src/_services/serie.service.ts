import { authHeader } from "../_helpers/auth-header";
import { handleResponse } from "../_helpers/handleResponse";
import { Serie } from "../_interfaces/serie.interface";
import { serieStore } from "../_store/serie.store";

class SerieService {

  constructor() { }

  getSeries = async (): Promise<void> => {
    const requestOptions = {
      method: 'GET',
      headers: authHeader(),
    };
    const response = await handleResponse(await fetch(`/api/series`, requestOptions));
    return serieStore.setSeries(response);
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