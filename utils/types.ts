import { PlaceResult } from "./place";

export type LocationType = {
  latitude: number;
  longitude: number;
} | null

export interface CoffeeShopI { item: PlaceResult, location: LocationType }