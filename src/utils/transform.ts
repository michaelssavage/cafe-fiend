import { Favorite } from "~/api/favorites";
import { BusinessStatusI, PlaceI } from "~/types/place.type";

export const transformFavoriteToPlace = (favorite: Favorite): PlaceI => ({
  id: favorite.place_id,
  displayName: { text: favorite.name, languageCode: "en" },
  location: {
    latitude: favorite.latitude,
    longitude: favorite.longitude,
  },
  rating: favorite.rating ?? 0,
  userRatingCount: favorite.user_rating_count ?? 0,
  priceLevel: favorite.price_level ?? "PRICE_LEVEL_MODERATE",
  businessStatus: favorite.business_status as BusinessStatusI | undefined,
  shortFormattedAddress: favorite.short_formatted_address ?? "",
  googleMapsUri: favorite.google_maps_uri ?? "",
  formattedAddress: (favorite.formatted_address as string) ?? "",
});
