export interface GooglePlacesI {
  places: Array<PlaceI>;
}

interface LocalizedTextI {
  text: string;
  languageCode: string;
}

type PriceLevelI =
  | "PRICE_LEVEL_FREE"
  | "PRICE_LEVEL_INEXPENSIVE"
  | "PRICE_LEVEL_MODERATE"
  | "PRICE_LEVEL_EXPENSIVE"
  | "PRICE_LEVEL_VERY_EXPENSIVE";

// https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places#Place

export interface PlaceI {
  id: string; // This is the place identifier
  displayName: LocalizedTextI;
  editorialSummary: LocalizedTextI;
  generativeSummary: { overview: LocalizedTextI };
  reviewSummary: { text: LocalizedTextI };
  googleMapsUri: string;
  location: {
    latitude: number;
    longitude: number;
  };
  formattedAddress: string;
  shortFormattedAddress: string;
  types: Array<string>;
  rating?: number;
  userRatingCount?: number;
  priceLevel?: PriceLevelI;
  currentOpeningHours?: { openNow: boolean };
  businessStatus?: "OPERATIONAL" | "CLOSED_TEMPORARILY" | "CLOSED_PERMANENTLY";
}

export interface EnrichedPlaceI extends PlaceI {
  place_id?: string;
  isFavorite?: boolean;
  isWishlist?: boolean;
  source?: "nearby" | "favorite";
}

export interface CoffeeShopsResponse {
  results: Array<EnrichedPlaceI>;
  status: string;
  next_page_token?: string;
}
