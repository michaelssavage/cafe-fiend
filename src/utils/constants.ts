export const fieldMask = [
  "places.id",
  "places.displayName",
  "places.location",
  "places.formattedAddress",
  "places.shortFormattedAddress",
  "places.types",
  "places.rating",
  "places.userRatingCount",
  "places.priceLevel",
  "places.currentOpeningHours",
  "places.businessStatus"
];

export const defaultPosition = { lat: 41.38879, lng: 2.15899 };

export enum CafeStatus {
  FAVORITE = "favorite",
  WANT_TO_GO = "want_to_go",
  HIDDEN = "hidden"
}
