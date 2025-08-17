import { createFileRoute } from "@tanstack/react-router";
import { Flag, Star } from "lucide-react";
import { useFavorites } from "~/hooks/use-favorites.hook";
import { CafeStatus } from "~/utils/constants";

export const Route = createFileRoute("/_authed/saved")({
  component: Saved,
});

function Saved() {
  const { favorites, handleRemoveFavorite, isRemoving } = useFavorites();

  const saved = favorites.filter(
    (favorite) => (favorite.status as CafeStatus) !== CafeStatus.HIDDEN,
  );

  return (
    <div className="max-w-[900px] mx-auto px-2 pb-3">
      <h1 className="py-4 text-2xl font-bold">Cafe Fiend</h1>
      <p className="pb-4 text-lg text-gray-700">Saved spots in your favorites and wishlist</p>

      {saved.length === 0 ? (
        <p className="text-gray-500">No saved cafes yet.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {saved.map((cafe) => (
            <li
              key={cafe.id}
              className="relative rounded-2xl shadow-md border border-gray-200 overflow-hidden flex flex-col"
            >
              {(cafe.status as CafeStatus) === CafeStatus.FAVORITE ? (
                <div className="absolute top-2 right-2 bg-transparent rounded-full p-1 ">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                </div>
              ) : (
                <div className="absolute top-2 right-2 bg-transparent rounded-full p-1 ">
                  <Flag className="w-5 h-5 text-green-600 fill-green-600" />
                </div>
              )}
              <div className="p-3 flex flex-col flex-1">
                <h2 className="text-lg font-semibold mb-1">{cafe.name}</h2>
                <p className="text-sm text-gray-600 mb-2">
                  {cafe.short_formatted_address ?? cafe.formatted_address}
                </p>
                {cafe.rating && (
                  <p className="text-sm text-yellow-600">
                    ⭐ {cafe.rating} ({cafe.user_rating_count ?? 0} reviews)
                  </p>
                )}
                <div className="mt-auto flex gap-2 pt-3">
                  <a
                    href={cafe.google_maps_uri ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Open
                  </a>
                  <button
                    onClick={() => handleRemoveFavorite(cafe.place_id)}
                    disabled={isRemoving}
                    className="px-3 py-1 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50"
                  >
                    {isRemoving ? "Removing..." : "Remove"}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
