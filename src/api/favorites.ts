import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "~/lib/supabase";

import { Database } from '~/types/supabase.type';

type Favorite = Database['public']['Tables']['favorites']['Row'];
type FavoriteInsert = Database['public']['Tables']['favorites']['Insert'];

export const saveFavorite = createServerFn({ method: "POST" })
  .validator((data: { placeId: string; name: string }) => data)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const { data: result, error } = await supabase
      .from("favorites")
      .insert<FavoriteInsert>({
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

    return result as Favorite;
  });

export const removeFavorite = createServerFn({ method: "POST" })
  .validator((data: { placeId: string }) => data)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("placeId", data.placeId)
      .eq("userId", user.id);

    if (error) {
      throw new Error(`Failed to remove favorite: ${error.message}`);
    }

    return { success: true };
  });

export const getFavorites = createServerFn({ method: "GET" })
  .handler(async () => {
    const supabase = getSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

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
