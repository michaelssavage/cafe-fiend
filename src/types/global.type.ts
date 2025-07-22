export interface FiltersI {
  rating: 4.0 | 4.4 | 4.8;
  radius: number;
  reviews: number;
  showFavorites: boolean;
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
