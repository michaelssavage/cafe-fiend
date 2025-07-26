import { OptionsI } from "./global.type";

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

export type BusinessStatusI =
  | "OPERATIONAL"
  | "CLOSED_TEMPORARILY"
  | "CLOSED_PERMANENTLY";

// https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places#Place

export interface PlaceI {
  id: string;
  displayName: LocalizedTextI;
  googleMapsUri: string;
  location: {
    latitude: number;
    longitude: number;
  };
  formattedAddress: string;
  shortFormattedAddress: string;
  rating?: number;
  userRatingCount?: number;
  priceLevel?: PriceLevelI;
  currentOpeningHours?: { openNow: boolean };
  businessStatus?: BusinessStatusI;
  source?: OptionsI;
  // types: Array<string>;
  // editorialSummary: LocalizedTextI;
  // generativeSummary: { overview: LocalizedTextI };
  // reviewSummary: { text: LocalizedTextI };
}
