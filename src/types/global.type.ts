export interface FiltersI {
  rating: 4.0 | 4.4 | 4.8;
  radius: number;
  reviews: number;
}

export interface FindNearbyCafesI {
  lat: number;
  long: number;
  filters: FiltersI;
  hiddenFavorites: Array<string>;
}

export interface LocationI {
  lat: number;
  lng: number;
}

export type StringOrNull = string | null;
