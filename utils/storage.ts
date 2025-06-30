import AsyncStorage from "@react-native-async-storage/async-storage";
import { PlaceResult } from "./place";

const FAVOURITES_KEY = "favourites";

export const saveFavourite = async (shop: PlaceResult) => {
  const existing = await AsyncStorage.getItem(FAVOURITES_KEY);
  const favourites = existing ? JSON.parse(existing) : [];
  const updated = [...favourites, shop];
  await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(updated));
};

export const getFavourites = async (): Promise<Array<PlaceResult>> => {
  const stored = await AsyncStorage.getItem(FAVOURITES_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const removeFavourite = async (placeId: string) => {
  const stored = await AsyncStorage.getItem(FAVOURITES_KEY);
  const updated = stored
    ? JSON.parse(stored).filter((item: PlaceResult) => item.place_id !== placeId)
    : [];
  await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(updated));
};
