import { PlaceI } from "./place.type";

export type OptionsI = "nearby" | "favorites" | "wishlist";

export interface FiltersI {
  rating: 4.0 | 4.4 | 4.8;
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

// Server-specific types that use arrays instead of Sets
export interface FiltersServerI {
  rating: 4.0 | 4.4 | 4.8;
  radius: number;
  reviews: number;
  options: Array<OptionsI>;
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
