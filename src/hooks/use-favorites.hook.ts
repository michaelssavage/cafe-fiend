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
    mutate: saveMutate,
    isPending: isSaving,
    error: saveError,
  } = useMutation({
    mutationFn: saveFavorite,
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

  const handleSaveFavorite = useCallback(
    (shop: PlaceI) => {
      saveMutate({ data: { status: CafeStatus.FAVORITE, shop } });
    },
    [saveMutate]
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
    (shop: PlaceI) => {
      saveMutate({ data: { status: CafeStatus.HIDDEN, shop } });
    },
    [saveMutate]
  );

  const handleAddToWishlist = useCallback(
    (shop: PlaceI) => {
      saveMutate({ data: { status: CafeStatus.WANT_TO_GO, shop } });
    },
    [saveMutate]
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
    isSaving,
    isRemoving,
    saveError,
    removeError,
  };
}
