import { useQuery } from "@tanstack/react-query";
import { findNearbyCoffeeShops } from "~/api/get-nearby-cafes";
import { FindNearbyCafesP } from "~/utils/global.type";


export const useCoffeeShops = ({ lat, long, filters }: FindNearbyCafesP) => {
  return useQuery({
    queryKey: ["coffeeShops", lat, long, filters],
    queryFn: () =>
      findNearbyCoffeeShops({
        data: {
          lat,
          long,
          filters: filters || { rating: 4.0, reviews: 10, radius: 2000 },
        },
      }),
    enabled: !!(lat && long),
    refetchOnWindowFocus: false,
  });
};