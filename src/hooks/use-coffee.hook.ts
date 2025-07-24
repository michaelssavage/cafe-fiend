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

  // const shouldFetchFavoriteDetails =
  //   filters?.showFavorites && favoritePlaceIds.length > 0;

  // const favoritesQuery = useQuery({
  //   queryKey: ["favoriteDetails", favoritePlaceIds],
  //   queryFn: () => getPlaceDetails({ data: { placeIds: favoritePlaceIds } }),
  //   enabled: shouldFetchFavoriteDetails,
  //   refetchOnWindowFocus: false,
  // });

  // const combinedData = useMemo(() => {
  //   const nearby = nearbyQuery.data?.results ?? [];
  //   const favoriteDetails = favoritesQuery.data ?? [];

  //   if (filters?.showFavorites) {
  //     console.log("Show favorite details", filters?.showFavorites);

  //     const favoriteDetailsMap = new Map();
  //     favoriteDetails.forEach((place) => {
  //       favoriteDetailsMap.set(place.id, {
  //         ...place,
  //         place_id: place.id,
  //         isFavorite: favoritePlaceIds.includes(place.id),
  //         source: "favorite",
  //       });
  //     });
  //     nearby.forEach((place) => {
  //       if (favoritePlaceIds.includes(place.id)) {
  //         favoriteDetailsMap.set(place.id, {
  //           ...place,
  //           place_id: place.id,
  //           isFavorite: favoritePlaceIds.includes(place.id),
  //           source: "nearby",
  //         });
  //       }
  //     });

  //     return {
  //       results: Array.from(favoriteDetailsMap.values()),
  //       status: "OK",
  //     };
  //   }

  //   const enrichedNearby = nearby.map((place) => ({
  //     ...place,
  //     place_id: place.id,
  //     isFavorite: favoritePlaceIds.includes(place.id),
  //     source: "nearby",
  //   }));

  //   return {
  //     ...nearbyQuery.data,
  //     results: enrichedNearby,
  //   };
  // }, [
  //   nearbyQuery.data,
  //   favoritesQuery.data,
  //   filters?.showFavorites,
  //   favoritePlaceIds,
  // ]);

  // return {
  //   data: combinedData,
  //   isLoading:
  //     nearbyQuery.isLoading ||
  //     (shouldFetchFavoriteDetails && favoritesQuery.isLoading),
  //   error: nearbyQuery.error ?? favoritesQuery.error,
  //   refetch: nearbyQuery.refetch,
  // };
};
