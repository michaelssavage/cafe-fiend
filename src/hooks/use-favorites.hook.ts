import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { getFavorites, removeFavorite, saveFavorite } from "~/api/favorites";
import { PlaceI } from "~/types/place.type";
import { CafeStatus } from "~/utils/constants";

export function useFavorites() {
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => getFavorites(),
  });

  const {
    mutate: saveFavoriteMutate,
    isPending: isSavingFavorite,
    error: saveFavoriteError,
  } = useMutation({
    mutationFn: (shop: PlaceI) =>
      saveFavorite({ data: { status: CafeStatus.FAVORITE, shop } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const {
    mutate: saveWishlistMutate,
    isPending: isSavingWishlist,
    error: saveWishlistError,
  } = useMutation({
    mutationFn: (shop: PlaceI) =>
      saveFavorite({ data: { status: CafeStatus.WANT_TO_GO, shop } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const {
    mutate: removeMutate,
    isPending: isRemoving,
    error: removeError,
  } = useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: (error) => {
      console.error("Remove mutation - Error:", error);
    },
  });

  const {
    mutate: hideCafeMutate,
    isPending: isHiding,
    error: hideError,
  } = useMutation({
    mutationFn: (shop: PlaceI) =>
      saveFavorite({ data: { status: CafeStatus.HIDDEN, shop } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const handleSaveFavorite = useCallback(
    (shop: PlaceI) => saveFavoriteMutate(shop),
    [saveFavoriteMutate]
  );

  const handleRemoveFavorite = useCallback(
    (placeId: string) => {
      console.log("Hook - Removing favorite for placeId:", placeId);
      removeMutate({ data: { placeId } });
    },
    [removeMutate]
  );

  const isFavorite = useCallback(
    (placeId: string) => {
      return favorites.some(
        (fav) =>
          fav.place_id === placeId &&
          fav.status === (CafeStatus.FAVORITE as string)
      );
    },
    [favorites]
  );

  const isWishlist = useCallback(
    (placeId: string) => {
      return favorites.some(
        (fav) =>
          fav.place_id === placeId &&
          fav.status === (CafeStatus.WANT_TO_GO as string)
      );
    },
    [favorites]
  );

  const handleHideCafe = useCallback(
    (shop: PlaceI) => hideCafeMutate(shop),
    [hideCafeMutate]
  );

  const handleAddToWishlist = useCallback(
    (shop: PlaceI) => saveWishlistMutate(shop),
    [saveWishlistMutate]
  );

  return {
    favorites,
    isLoading,
    isFavorite,
    isWishlist,
    handleSaveFavorite,
    handleRemoveFavorite,
    handleHideCafe,
    handleAddToWishlist,
    isSavingFavorite,
    isSavingWishlist,
    isHiding,
    isRemoving,
    saveFavoriteError,
    saveWishlistError,
    hideError,
    removeError,
  };
}
