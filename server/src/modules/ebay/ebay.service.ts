import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import EbayAuthToken from 'ebay-oauth-nodejs-client';
import { EbayItemSummary, PriceStats } from './interfaces/ebay-item-summary.interface';



@Injectable()
export class EbayService {
  private ebayAuth: EbayAuthToken;

  constructor(private readonly configService: ConfigService) {
    this.ebayAuth = new EbayAuthToken({
      clientId: this.configService.get<string>('EBAY_APP_ID')!,
      clientSecret: this.configService.get<string>('EBAY_CERT_ID')!,
    });
  }


  searchCardOnEbay = async (query: string): Promise<EbayItemSummary[]> => {
    try {
      const token = await this.ebayAuth.getApplicationToken("PRODUCTION", ["https://api.ebay.com/oauth/api_scope"]);
      const tokenData = JSON.parse(token)
      if (tokenData.error) {
        throw new HttpException(
          `${tokenData.error_description}`,
          HttpStatus.UNAUTHORIZED
        );
      }

      const searchResponse = await fetch(
        `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}&category_ids=183454&filter=buyingOptions:{FIXED_PRICE}`,

        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-EBAY-C-MARKETPLACE-ID": "EBAY_FR",
            "X-EBAY-C-ENDUSERCTX": "contextualLocation=country=FR,zip=75001",
            "Content-Language": "fr-FR",
          },
        }
      );

      if (!searchResponse.ok) {
        console.error(`erreur http ebay : ${searchResponse.status} ${searchResponse.statusText}`)
        throw new HttpException(
          `Erreur lors de la recherche des items : ${searchResponse.statusText}`,
          HttpStatus.BAD_GATEWAY
        );
      }
      const searchData = await searchResponse.json();
      return searchData.itemSummaries;

    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new HttpException('Erreur interne du serveur eBay', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      throw error
    }
  };
  

  getPriceStats = async (itemSummaries: EbayItemSummary[]): Promise<PriceStats> => {
    //supprimer les cartes "Gradée" et les "Vitrines" pour carte
    const data = itemSummaries.filter(
      item => parseInt(item.conditionId) !== 2750
        && !item.title.toLowerCase().includes('vitrine')
    )

    // Tableau des prix
    const priceArray = data.map((item) => parseFloat(item.price.value))
    // Trier les prix par ordre croissant
    const sortedPrices = [...priceArray].sort((a, b) => a - b);

    // Pas assez de données
    if (sortedPrices.length < 5) {
      const lowestPrice = Math.min(...sortedPrices);
      const highestPrice = Math.max(...sortedPrices);
      const averagePrice = sortedPrices.reduce((sum, price) => sum + price, 0) / sortedPrices.length;
      return { lowestPrice, highestPrice, averagePrice }
    };


    // Calculer Q1 (25ème percentile) et Q3 (75ème percentile)
    const q1 = sortedPrices[Math.floor(sortedPrices.length * 0.25)]; // return l'indice qui se trouve au 1/4 du tableau
    const q3 = sortedPrices[Math.floor(sortedPrices.length * 0.75)]; // return l'indice qui se trouve au 3/4 du tableau
    // Tout ce qui est inférieur à Q1, ou supérieur à q3 est une valeur aberrante, on appelle ca des Outliers.

    // Calculer l'IQR
    const iqr = q3 - q1; //l'intervalle contenant les 50% du milieu des données.

    // Définir les bornes pour exclure les outliers
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;

    // Filtrer les valeurs qui sont dans l'intervalle acceptable
    const filteredPrice = priceArray.filter(price => price >= lowerBound && price <= upperBound);

    const averagePrice = filteredPrice.reduce((sum, price) => sum + price, 0) / filteredPrice.length;
    const lowestPrice = Math.min(...filteredPrice);
    const highestPrice = Math.max(...filteredPrice);
    return { lowestPrice, highestPrice, averagePrice }
  }




  getEbayCategories = async () => {
    try {
      const token = await this.ebayAuth.getApplicationToken("PRODUCTION", ["https://api.ebay.com/oauth/api_scope"]);
      const tokenData = JSON.parse(token)
      if (tokenData.error) {
        throw new HttpException(
          `${tokenData.error_description}`,
          HttpStatus.UNAUTHORIZED
        );
      }

      const categoriesResponse = await fetch(
        'https://api.ebay.com/commerce/taxonomy/v1/category_tree/0',
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      const categoriesData = await categoriesResponse.json();
      return categoriesData
    } catch (error) {
      throw error
    }
  }
}
