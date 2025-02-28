export interface EbayItemSummary {
  itemId: string;
  title: string;
  leafCategoryIds: string[];
  categories: {
    categoryId: string;
    categoryName: string;
  }[];
  image: {
    imageUrl: string;
  };
  price: {
    value: string;
    currency: string;
  };
  itemHref: string;
  seller: {
    username: string;
    feedbackPercentage: string;
    feedbackScore: number;
    sellerAccountType: "INDIVIDUAL" | "BUSINESS"; // Peut être modifié si d'autres types existent
  };
  condition: string;
  conditionId: string;
  thumbnailImages: {
    imageUrl: string;
  }[];
  shippingOptions: {
    shippingCostType: string; // Ex: "FIXED"
    shippingCost: {
      value: string;
      currency: string;
    };
  }[];
  buyingOptions: string[]; // Ex: ["FIXED_PRICE", "BEST_OFFER"]
  itemWebUrl: string;
  itemLocation: {
    postalCode: string;
    country: string;
  };
  additionalImages?: {
    imageUrl: string;
  }[];
  adultOnly: boolean;
  legacyItemId: string;
  availableCoupons: boolean;
  itemCreationDate: string; // Peut être converti en `Date` si besoin
  topRatedBuyingExperience: boolean;
  priorityListing: boolean;
  listingMarketplaceId: string; // Ex: "EBAY_FR"
};

export interface PriceStats {
  lowestPrice: number;
  averagePrice: number;
  highestPrice: number;
}
