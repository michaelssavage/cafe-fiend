import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { findNearbyCafes } from "~/api/get-nearby-cafes";
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

  const { favoriteCafes, wishlistCafes } = useMemo(() => {
    const favoriteCafes = favorites
      .filter((favorite) => favorite.status === (CafeStatus.FAVORITE as string))
      .map(transformFavoriteToPlace);

    const wishlistCafes = favorites
      .filter((favorite) => favorite.status === (CafeStatus.WANT_TO_GO as string))
      .map(transformFavoriteToPlace);

    return {
      favoriteCafes,
      wishlistCafes,
    };
  }, [favorites]);

  const shouldFetchNearby = filters.options.has("nearby");

  const { data, isLoading, error } = useQuery({
    queryKey: ["coffeeShops", lat, long, filters, favorites],
    queryFn: () =>
      findNearbyCafes({
        data: {
          lat,
          long,
          filters: {
            rating: filters.rating,
            radius: filters.radius,
            reviews: filters.reviews,
          },
          favorites: favorites.map(({ place_id }) => place_id),
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
