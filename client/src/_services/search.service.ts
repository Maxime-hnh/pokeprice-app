import { handleResponse } from "../_helpers/handleResponse";

const EBAY_SEARCHITEMS_URL = import.meta.env.VITE_EBAY_SEARCHITEMS_URL;

class SearchService {

  constructor() {
  }


  searchOnEbay = (ebaySearchContent: string): void => {
    const ebayUrl = `https://www.ebay.fr/sch/i.html?_nkw=${encodeURIComponent(ebaySearchContent)}&_oaa=1&_dcat=183454&rt=nc&LH_PrefLoc=1`;
    window.open(ebayUrl, '_blank');
  };

  searchOnVinted = (ebaySearchContent: string): void => {
    const vintedUrl = `https://www.vinted.fr/catalog?search_text=${encodeURIComponent(ebaySearchContent).replace(/\+/g, "%20")}&search_id=21317989411&order=newest_first&time=1740788193&brand_ids[]=191646&page=1&catalog[]=3233`;
    window.open(vintedUrl, '_blank');
  }


  searchEbayItems = async (query: any) => {
    const requestOptions: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    }
    try {
      const response = await handleResponse(await fetch(`${EBAY_SEARCHITEMS_URL}?q=${encodeURIComponent(query)}`, requestOptions));
      return response;
    } catch (error) {
      console.error("Erreur lors de l'appel à Firebase :", error);
      throw error;
    }
  }
}

export const searchService = new SearchService();