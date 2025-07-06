import type { FindNearbyCafesP } from "../utils/global.types";
import type { PlaceResult } from "../utils/place.type";

export const findNearbyCoffeeShops = async ({
  latitude,
  longitude,
  filters,
}: FindNearbyCafesP): Promise<PlaceResult[]> => {
  try {
    const url = `/.netlify/functions/nearby-cafes?latitude=${latitude}&longitude=${longitude}&radius=${filters.distance}`;
    console.log("Fetching from:", url);
    
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
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
