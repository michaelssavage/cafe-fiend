import type { PostgrestError } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "~/lib/supabase";

import { Database } from '~/types/supabase.type';

type Favorite = Database['public']['Tables']['favorites']['Row'];

interface FavoriteResponse { 
  data: Favorite | null; 
  error: PostgrestError | null; 
}

export const saveFavorite = createServerFn({ method: "POST" })
  .validator((data: { placeId: string; name: string }) => {
    if (!data.placeId || !data.name) {
      throw new Error("placeId and name are required");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const authResponse = await supabase.auth.getUser();
    const { data: { user }, error: authError } = authResponse;

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const { data: result, error }: FavoriteResponse = await supabase
      .from("favorites")
      .insert({
        placeId: data.placeId,
        userId: user.id,
        name: data.name,
        createdAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save favorite: ${error.message}`);
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
    const { data: { user }, error: authError } = authResponse;

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

export const getFavorites = createServerFn({ method: "GET" })
  .handler(async () => {
    const supabase = getSupabaseServerClient();

    const authResponse = await supabase.auth.getUser();
    const { data: { user }, error: authError } = authResponse;

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const { data, error } = await supabase
      .from("favorites")
      .select("*")
      .eq("userId", user.id)
      .order("createdAt", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch favorites: ${error.message}`);
    }

    return (data as Array<Favorite>) || [];
  });
