export interface FiltersI {
  rating: number;
  radius: number;
  reviews: number;
}

export interface FindNearbyCafesP {
  lat: number;
  long: number;
  filters: FiltersI;
}

export interface LocationI {
  lat: number,
  lng: number
}

export type StringOrNull = string | null;
