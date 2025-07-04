import type { FindNearbyCafesP } from "../utils/global.types";
import type { PlaceResult } from "../utils/place.type";

export const findNearbyCoffeeShops = async ({
  latitude,
  longitude,
  filters,
}: FindNearbyCafesP): Promise<PlaceResult[]> => {
  try {
    const response = await fetch(
      `/.netlify/functions/nearby-cafes?latitude=${latitude}&longitude=${longitude}&radius=${filters.distance}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === "OK" && data.results) {
      const filteredResults = data.results.filter((place: PlaceResult) => {
        const hasGoodRating = place.rating && place.rating > filters.rating;
        const hasEnoughReviews =
          place.user_ratings_total &&
          place.user_ratings_total > filters.reviews;
        return hasGoodRating && hasEnoughReviews;
      });

      return filteredResults;
    } else {
      console.error("API returned error:", data.error);
      return [];
    }
  } catch (error) {
    console.error("Error fetching coffee shops:", error);
    return [];
  }
};
