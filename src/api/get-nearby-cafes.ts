import { createServerFn } from "@tanstack/react-start";
import { FiltersServerI, FindNearbyCafesServerI } from "~/types/global.type";
import { fieldMask } from "~/utils/constants";
import type { PlaceI } from "../types/place.type";

interface PlacesResponse {
  places: Array<PlaceI>;
}

const filterResults = (
  results: Array<PlaceI>,
  filters: FiltersServerI,
  favorites: Array<string>
) => {
  const filteredResults = results.filter((place) => {
    // Ensure place has a valid place_id
    if (!place.id) {
      console.warn("Place missing place_id:", place);
      return false;
    }

    // Filter out places that are in the favorites
    if (favorites.includes(place.id)) {
      return false;
    }

    const businessIsOpen = place.businessStatus === "OPERATIONAL";

    const hasGoodRating = place.rating && place.rating > filters.rating;
    const hasEnoughReviews =
      place.userRatingCount && place.userRatingCount > filters.reviews;

    return businessIsOpen && hasGoodRating && hasEnoughReviews;
  });

  return filteredResults;
};

export const findNearbyCafes = createServerFn({ method: "POST" })
  .validator((data: FindNearbyCafesServerI) => {
    // Validate required fields
    if (!data.lat || !data.long) {
      throw new Error("Latitude and longitude are required");
    }

    // Validate data types and ranges
    const latitude = parseFloat(data.lat.toString());
    const longitude = parseFloat(data.long.toString());

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new Error("Latitude and longitude must be valid numbers");
    }

    if (latitude < -90 || latitude > 90) {
      throw new Error("Latitude must be between -90 and 90");
    }

    if (longitude < -180 || longitude > 180) {
      throw new Error("Longitude must be between -180 and 180");
    }

    const filters = {
      radius: data.filters?.radius
        ? parseInt(data.filters?.radius.toString(), 10)
        : 1000,
      rating: (data.filters?.rating
        ? parseFloat(data.filters.rating.toString())
        : 4.0) as 4.0 | 4.4 | 4.8,
      reviews: data.filters?.reviews
        ? parseInt(data.filters.reviews.toString(), 10)
        : 10,
      options: data.filters?.options || [],
    };

    if (filters.rating < 0 || filters.rating > 5) {
      throw new Error("Rating filter must be between 0 and 5");
    }

    if (filters.reviews < 0) {
      throw new Error("Reviews filter must be non-negative");
    }

    if (
      isNaN(filters.radius) ||
      filters.radius <= 0 ||
      filters.radius > 50000
    ) {
      throw new Error("Radius must be a positive number up to 50000 meters");
    }

    return {
      latitude,
      longitude,
      filters,
      favorites: data.favorites || [],
    };
  })
  .handler(async ({ data }) => {
    try {
      const url = "https://places.googleapis.com/v1/places:searchNearby";

      const requestBody = {
        // https://developers.google.com/maps/documentation/places/web-service/place-types#table-a
        includedTypes: ["cafe", "cafeteria", "coffee_shop", "tea_house"],
        excludedTypes: ["brunch_restaurant"],
        maxResultCount: 20,
        rankPreference: "DISTANCE",
        locationRestriction: {
          circle: {
            center: {
              latitude: data.latitude,
              longitude: data.longitude,
            },
            radius: data.filters.radius,
          },
        },
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
          "X-Goog-FieldMask": fieldMask.join(","),
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "Google Places API error:",
          response.status,
          response.statusText,
          errorText
        );
        throw new Error(
          `Google Places API error: ${response.status} - ${errorText}`
        );
      }

      const { places } = (await response.json()) as PlacesResponse;
      console.log("Google Places API response:", places.length, "places found");

      const results = filterResults(places, data.filters, data.favorites);

      return {
        results,
        status: "OK",
      };
    } catch (error) {
      console.error("Error fetching coffee shops:", error);
      throw error;
    }
  });
