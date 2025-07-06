export interface FiltersI {
  rating: number;
  distance: number;
  reviews: number;
}

export interface FindNearbyCafesP {
  latitude: number;
  longitude: number;
  filters: FiltersI;
}

export interface LocationI {
  lat: number,
  lng: number,
  accuracy: number,
  timestamp: number
}