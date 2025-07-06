import { createServerFn } from '@tanstack/react-start';
import { FindNearbyCafesP } from '~/utils/global.type';
import type { PlaceResult } from "../utils/place.type";

const filterResults = (results: Array<PlaceResult>, filters: any) => {
  const filteredResults = results.filter((place) => {
    const hasGoodRating = place.rating && place.rating > filters.rating;
    const hasEnoughReviews =
      place.user_ratings_total &&
      place.user_ratings_total > filters.reviews;
    return hasGoodRating && hasEnoughReviews;
  });

  return filteredResults;
}

export const findNearbyCoffeeShops = createServerFn({
  method: 'POST', // Changed to POST since you're sending data
}).validator((data: FindNearbyCafesP) => {
  // Validate required fields
  if (!data.lat || !data.long) {
    throw new Error('Latitude and longitude are required');
  }

  // Validate data types and ranges
  const latitude = parseFloat(data.lat.toString());
  const longitude = parseFloat(data.long.toString());
  
  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error('Latitude and longitude must be valid numbers');
  }

  if (latitude < -90 || latitude > 90) {
    throw new Error('Latitude must be between -90 and 90');
  }

  if (longitude < -180 || longitude > 180) {
    throw new Error('Longitude must be between -180 and 180');
  }

  // Validate radius (optional, with default)
  

  // Validate filters (optional, with defaults)
  const filters = {
    radius: data.filters?.radius ? parseInt(data.filters?.radius.toString(), 10) : 1000,
    rating: data.filters?.rating ? parseFloat(data.filters.rating.toString()) : 4.0,
    reviews: data.filters?.reviews ? parseInt(data.filters.reviews.toString(), 10) : 10
  };

  if (filters.rating < 0 || filters.rating > 5) {
    throw new Error('Rating filter must be between 0 and 5');
  }

  if (filters.reviews < 0) {
    throw new Error('Reviews filter must be non-negative');
  }

  if (isNaN(filters.radius) || filters.radius <= 0 || filters.radius > 50000) {
    throw new Error('Radius must be a positive number up to 50000 meters');
  }

  return {
    latitude,
    longitude,
    filters
  };
}).handler(async ({ data }) => {
  try {
    const url: string = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${data.latitude},${data.longitude}&radius=${data.filters.radius}&type=cafe&key=${process.env.VITE_GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error("Google Places API error:", response.status, response.statusText);
      throw new Error(`Google Places API error: ${response.status}`);
    }

    const res = await response.json();

    if (res.status === "OK") {
      const results = filterResults(res.results, data.filters);
      return {
        results, 
        status: "OK"
      };
    } else {
      console.error("Google Places API returned error status:", res.status);
      throw new Error(`Google Places API status: ${res.status}`);
    }

  } catch (error) {
    console.error("Error fetching coffee shops:", error);
    throw error;
  }
});