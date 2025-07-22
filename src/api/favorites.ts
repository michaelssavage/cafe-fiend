import type { PostgrestError } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "~/lib/supabase/server";

import { Database } from "~/types/supabase.type";
import { CafeStatus } from "~/utils/constants";

export type Favorite = Database["public"]["Tables"]["favorites"]["Row"];

interface FavoriteResponse {
  data: Favorite | null;
  error: PostgrestError | null;
}

export const saveFavorite = createServerFn({ method: "POST" })
  .validator((data: { placeId: string; name: string; status: CafeStatus }) => {
    if (!data.placeId || !data.name || !data.status) {
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
      .from("favorites")
      .upsert(
        {
          placeId: data.placeId,
          userId: user.id,
          name: data.name,
          status: data.status,
          createdAt: new Date().toISOString(),
        },
        {
          onConflict: "placeId,userId", // Specify the columns that define uniqueness
          ignoreDuplicates: false, // We want to update, not ignore
        }
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
      .from("favorites")
      .select("*")
      .eq("placeId", data.placeId)
      .eq("userId", user.id);

    console.log("Existing record:", existingRecord);
    console.log("Select error:", selectError);

    const { data: deleteResult, error } = await supabase
      .from("favorites")
      .delete()
      .eq("placeId", data.placeId)
      .eq("userId", user.id)
      .select();

    console.log("Delete result:", deleteResult);
    console.log("Delete error:", error);

    if (error) {
      throw new Error(`Failed to remove favorite: ${error.message}`);
    }

    return { success: true };
  });

export const getFavorites = createServerFn({ method: "GET" }).handler(
  async () => {
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
      .from("favorites")
      .select("*")
      .eq("userId", user.id)
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Supabase fetch favorites error:", error.message);
      throw new Error(`Failed to fetch favorites: ${error.message}`);
    }

    console.log("Favorites fetched successfully:", data?.length);
    return (data as Array<Favorite>) || [];
  }
);
