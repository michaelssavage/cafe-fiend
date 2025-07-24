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
  "places.businessStatus",
  "places.googleMapsUri",
];

export const defaultPosition = { lat: 41.38879, lng: 2.15899 };

export enum CafeStatus {
  FAVORITE = "favorite",
  WANT_TO_GO = "want_to_go",
  HIDDEN = "hidden",
}

export const REVIEWS_OPTIONS = [
  { value: 20, label: "20+" },
  { value: 100, label: "100+" },
  { value: 500, label: "500+" },
  { value: 1000, label: "1000+" },
];

export const RATING_OPTIONS = [
  { value: 4.0, label: "4.0+" },
  { value: 4.4, label: "4.4+" },
  { value: 4.8, label: "4.8+" },
];

export const RADIUS_OPTIONS = [
  { value: 500, label: "500m" },
  { value: 1000, label: "1km" },
  { value: 2000, label: "2km" },
  { value: 3000, label: "3km" },
  { value: 4000, label: "4km" },
];
