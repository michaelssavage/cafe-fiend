import { useQuery } from "@tanstack/react-query";
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
    .filter((favorite) => favorite.status === CafeStatus.HIDDEN)
    .map((favorite) => favorite.placeId);

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
