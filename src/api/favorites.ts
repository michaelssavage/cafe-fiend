import type { PostgrestError } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "~/lib/supabase/server";
import { PlaceI } from "~/types/place.type";

import { Database } from "~/types/supabase.type";
import { CafeStatus } from "~/utils/constants";

export type Favorite = Database["public"]["Tables"]["saved"]["Row"];

interface FavoriteResponse {
  data: Favorite | null;
  error: PostgrestError | null;
}

export const saveFavorite = createServerFn({ method: "POST" })
  .validator((data: { status: CafeStatus; shop: PlaceI }) => {
    if (!data.shop.displayName.text || !data.shop.id || !data.status) {
      throw new Error("placeId and name are required");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const authResponse = await supabase.auth.getUser();
    const {
      data: { user },
      error: authError,
    } = authResponse;

    if (authError) {
      console.error("Authentication error in getFavorites:", authError.message);
      throw new Error("Unauthorized: " + authError.message);
    }

    if (!user) {
      console.log("No user found in getFavorites. Unauthorized.");
      throw new Error("Unauthorized: User not found");
    }

    const { data: result, error }: FavoriteResponse = await supabase
      .from("saved")
      .upsert(
        {
          user_id: user.id,
          status: data.status,
          updated_at: new Date().toISOString(),
          place_id: data.shop.id,
          name: data.shop.displayName.text,
          latitude: data.shop.location.latitude,
          longitude: data.shop.location.longitude,
          rating: data.shop.rating,
          user_rating_count: data.shop.userRatingCount,
          price_level: data.shop.priceLevel,
          formatted_address: data.shop.formattedAddress,
          business_status: data.shop.businessStatus,
          google_maps_uri: data.shop.googleMapsUri,
          short_formatted_address: data.shop.shortFormattedAddress,
        },
        {
          onConflict: "place_id,user_id", // define uniqueness
          ignoreDuplicates: false, // We want to update, not ignore
        },
      )
      .select()
      .single();

    if (error) {
      console.error("Supabase fetch favorites error:", error.message);
      throw new Error(`Failed to fetch favorites: ${error.message}`);
    }

    return result!;
  });

export const removeFavorite = createServerFn({ method: "POST" })
  .validator((data: { placeId: string }) => {
    if (!data.placeId) {
      throw new Error("placeId is required");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const authResponse = await supabase.auth.getUser();
    const {
      data: { user },
      error: authError,
    } = authResponse;

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    console.log("Remove favorite - User ID:", user.id);
    console.log("Remove favorite - Place ID:", data.placeId);

    // First, let's check if the record exists
    const { data: existingRecord, error: selectError } = await supabase
      .from("saved")
      .select("*")
      .eq("place_id", data.placeId)
      .eq("user_id", user.id);

    console.log("Existing record:", existingRecord);
    console.log("Select error:", selectError);

    const { data: deleteResult, error } = await supabase
      .from("saved")
      .delete()
      .eq("place_id", data.placeId)
      .eq("user_id", user.id)
      .select();

    console.log("Delete result:", deleteResult);
    console.log("Delete error:", error);

    if (error) {
      throw new Error(`Failed to remove favorite: ${error.message}`);
    }

    return { success: true };
  });

export const getFavorites = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getSupabaseServerClient();

  const authResponse = await supabase.auth.getUser();
  const {
    data: { user },
    error: authError,
  } = authResponse;

  if (authError) {
    console.error("Authentication error in getFavorites:", authError.message);
    throw new Error("Unauthorized: " + authError.message);
  }

  if (!user) {
    console.log("No user found in getFavorites. Unauthorized.");
    throw new Error("Unauthorized: User not found");
  }

  const { data, error } = await supabase
    .from("saved")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase fetch favorites error:", error.message);
    throw new Error(`Failed to fetch favorites: ${error.message}`);
  }

  console.log("Favorites fetched successfully:", data?.length);
  return (data as Array<Favorite>) || [];
});
