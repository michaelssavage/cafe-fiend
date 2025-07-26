import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { findNearbyCoffeeShops } from "~/api/get-nearby-cafes";
import { FindNearbyCafesI } from "~/types/global.type";
import { PlaceI } from "~/types/place.type";
import { CafeStatus } from "~/utils/constants";
import { transformFavoriteToPlace } from "~/utils/transform";
import { useFavorites } from "./use-favorites.hook";

export const useCoffeeShops = ({
  lat,
  long,
  filters,
}: Omit<FindNearbyCafesI, "hiddenFavorites">) => {
  const { favorites } = useFavorites();

  const { hiddenFavorites, favoriteCafes, wishlistCafes } = useMemo(() => {
    const hidden = favorites
      .filter((favorite) => favorite.status === (CafeStatus.HIDDEN as string))
      .map((favorite) => favorite.place_id);

    const favoriteShops = favorites
      .filter((favorite) => favorite.status === (CafeStatus.FAVORITE as string))
      .map(transformFavoriteToPlace);

    const wishlistShops = favorites
      .filter(
        (favorite) => favorite.status === (CafeStatus.WANT_TO_GO as string)
      )
      .map(transformFavoriteToPlace);

    return {
      hiddenFavorites: hidden,
      favoriteCafes: favoriteShops,
      wishlistCafes: wishlistShops,
    };
  }, [favorites]);

  const shouldFetchNearby = filters.options.has("nearby");

  const { data, isLoading, error } = useQuery({
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
    enabled: !!(lat && long) && shouldFetchNearby,
    refetchOnWindowFocus: false,
  });

  const displayData = useMemo(() => {
    const results: Array<PlaceI> = [];
    const addedPlaceIds = new Set<string>();

    if (filters.options.has("nearby") && data) {
      data.results.forEach((cafe) => {
        if (!addedPlaceIds.has(cafe.id)) {
          results.push({ ...cafe, source: "nearby" });
          addedPlaceIds.add(cafe.id);
        }
      });
    }

    if (filters.options.has("favorites")) {
      favoriteCafes.forEach((cafe) => {
        if (cafe.id && !addedPlaceIds.has(cafe.id)) {
          results.push({ ...cafe, source: "favorites" });
          addedPlaceIds.add(cafe.id);
        }
      });
    }

    if (filters.options.has("wishlist")) {
      wishlistCafes.forEach((cafe) => {
        if (cafe.id && !addedPlaceIds.has(cafe.id)) {
          results.push({ ...cafe, source: "wishlist" });
          addedPlaceIds.add(cafe.id);
        }
      });
    }

    return results;
  }, [filters.options, data, favoriteCafes, wishlistCafes]);

  return {
    data: displayData,
    isLoading: shouldFetchNearby ? isLoading : false,
    error,
  };
};
