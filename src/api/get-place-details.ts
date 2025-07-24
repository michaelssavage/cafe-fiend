import { createServerFn } from "@tanstack/react-start";
import { fieldMask } from "~/utils/constants";
import type { PlaceI } from "../types/place.type";

interface PlaceDetailsRequest {
  placeIds: Array<string>;
}

export const getPlaceDetails = createServerFn({ method: "POST" })
  .validator((data: PlaceDetailsRequest) => {
    if (!data.placeIds || !Array.isArray(data.placeIds)) {
      throw new Error("placeIds must be an array");
    }

    if (data.placeIds.length === 0) {
      return { placeIds: [] };
    }

    if (data.placeIds.length > 20) {
      throw new Error("Cannot fetch more than 20 place details at once");
    }

    // Validate each placeId is a non-empty string
    for (const placeId of data.placeIds) {
      if (!placeId || typeof placeId !== "string") {
        throw new Error("All placeIds must be non-empty strings");
      }
    }

    return { placeIds: data.placeIds };
  })
  .handler(async ({ data }): Promise<Array<PlaceI>> => {
    if (data.placeIds.length === 0) {
      return [];
    }

    try {
      const placeDetails = await Promise.all(
        data.placeIds.map(async (placeId: string) => {
          try {
            const url = `https://places.googleapis.com/v1/places/${placeId}`;

            const response = await fetch(url, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": import.meta.env
                  .VITE_GOOGLE_MAPS_API_KEY as string,
                "X-Goog-FieldMask": fieldMask.join(","),
              },
            });

            if (!response.ok) {
              console.error(
                `Failed to fetch place ${placeId}:`,
                response.status,
                response.statusText
              );
              return null;
            }

            const place = (await response.json()) as PlaceI;
            return place;
          } catch (error) {
            console.error(`Error fetching place ${placeId}:`, error);
            return null;
          }
        })
      );

      // Filter out failed requests
      const validDetails = placeDetails.filter(
        (place): place is PlaceI => place !== null
      );

      console.log(
        `Successfully fetched ${validDetails.length}/${data.placeIds.length} place details`
      );

      return validDetails;
    } catch (error) {
      console.error("Error in getPlaceDetails:", error);
      throw new Error("Failed to fetch place details");
    }
  });
