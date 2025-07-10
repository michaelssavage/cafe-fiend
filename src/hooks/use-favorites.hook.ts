import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFavorites, removeFavorite, saveFavorite } from "~/api/favorites";

export function useFavorites() {
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => getFavorites(),
  });

  const saveMutation = useMutation({
    mutationFn: saveFavorite,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const handleSaveFavorite = (placeId: string, name: string) => {
    saveMutation.mutate({ placeId, name });
  };

  const handleRemoveFavorite = (placeId: string) => {
    removeMutation.mutate({ placeId });
  };

  const isFavorite = (placeId: string) => {
    return favorites.some(fav => fav.placeId === placeId);
  };

  return {
    favorites,
    isLoading,
    isFavorite,
    saveFavorite: handleSaveFavorite,
    removeFavorite: handleRemoveFavorite,
    isSaving: saveMutation.isPending,
    isRemoving: removeMutation.isPending,
    saveError: saveMutation.error,
    removeError: removeMutation.error,
  };
}