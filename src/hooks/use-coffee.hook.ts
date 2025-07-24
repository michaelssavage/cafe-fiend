import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { findNearbyCoffeeShops } from "~/api/get-nearby-cafes";
import { FindNearbyCafesI } from "~/types/global.type";
import { CafeStatus } from "~/utils/constants";
import { useFavorites } from "./use-favorites.hook";

export const useCoffeeShops = ({
  lat,
  long,
  filters,
}: Omit<FindNearbyCafesI, "hiddenFavorites">) => {
  const { favorites } = useFavorites();

  const hiddenFavorites = favorites
    .filter((favorite) => favorite.status === (CafeStatus.HIDDEN as string))
    .map((favorite) => favorite.place_id);

  // Get favorite place IDs
  const favoritePlaceIds = useMemo(
    () =>
      favorites
        .filter((fav) => fav.status === (CafeStatus.FAVORITE as string))
        .map((fav) => fav.place_id),
    [favorites]
  );

  console.log("favorite place IDs", {
    numFavs: favoritePlaceIds.length,
    showFavorites: filters.showFavorites,
  });

  return useQuery({
    queryKey: ["coffeeShops", lat, long, filters, hiddenFavorites],
    queryFn: () =>
      findNearbyCoffeeShops({
        data: {
          lat,
          long,
          filters: filters || { rating: 4.0, reviews: 10, radius: 2000 },
          hiddenFavorites,
        },
      }),
    enabled: !!(lat && long),
    refetchOnWindowFocus: false,
  });
};
