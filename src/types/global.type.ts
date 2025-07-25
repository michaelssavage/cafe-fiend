import { PlaceI } from "./place.type";

export type OptionsI = "nearby" | "favorites" | "wishlist" | "open now";

export type RatingEnum = 4.0 | 4.4 | 4.8;

export interface FiltersI {
  rating: RatingEnum;
  radius: number;
  reviews: number;
  options: Set<OptionsI>;
}

export interface SelectType {
  label: string;
  value: number;
}

export interface LocationI {
  lat: number;
  lng: number;
}

export interface FindNearbyCafesI {
  lat?: LocationI["lat"];
  long?: LocationI["lng"];
  filters: FiltersI;
  hiddenFavorites: Array<string>;
}

export type StringOrNull = string | null;

export type SetState<T> = (val: T | ((prev: T) => T)) => void;

// Server-specific types dont include options
export interface FiltersServerI extends Omit<FiltersI, "options"> {
  openNow?: boolean;
}

export interface CafeListsI {
  hiddenCafes: Array<string>;
  favoriteCafes: Array<PlaceI>;
  wishlistCafes: Array<PlaceI>;
}

export interface FindNearbyCafesServerI {
  lat?: number;
  long?: number;
  filters: FiltersServerI;
  favorites: Array<string>;
}
