import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  InfoWindow,
  Pin,
} from "@vis.gl/react-google-maps";
import { EyeOff, Flag, Heart } from "lucide-react";
import { useCallback, useState } from "react";
import { useFavorites } from "~/hooks/use-favorites.hook";
import { Flexbox } from "~/styles/Flexbox";
import { LocationI, StringOrNull } from "~/types/global.type";
import { calculateDistance } from "~/utils/distance";
import type { PlaceI } from "../types/place.type";
import { Button, flagStyles, heartStyles, hideStyles } from "./Button";

interface ShopMarkersProps {
  userLocation: LocationI;
  shops: Array<PlaceI>;
}

export const CafeMarker = ({ userLocation, shops }: ShopMarkersProps) => {
  const data = shops.map((dataItem, index) => ({ ...dataItem, zIndex: index }));

  const Z_INDEX_SELECTED = data.length;
  const Z_INDEX_HOVER = data.length + 1;

  const [hoverId, setHoverId] = useState<StringOrNull>(null);
  const [selectedId, setSelectedId] = useState<StringOrNull>(null);

  const [selectedMarker, setSelectedMarker] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [infoWindowShown, setInfoWindowShown] = useState(false);

  const {
    isFavorite,
    isWishlist,
    handleSaveFavorite,
    handleRemoveFavorite,
    handleHideCafe,
    handleAddToWishlist,
    isSaving,
    isRemoving,
  } = useFavorites();

  const closePopover = useCallback(() => setInfoWindowShown(false), []);
  const onMouseEnter = useCallback((id: StringOrNull) => setHoverId(id), []);
  const onMouseLeave = useCallback(() => setHoverId(null), []);
  const onMarkerClick = useCallback(
    (id: StringOrNull) => {
      setSelectedId(id);
      if (id !== selectedId) setInfoWindowShown(true);
      else setInfoWindowShown((isShown) => !isShown);
    },
    [selectedId]
  );

  const toggleCafe = useCallback(
    (shop: PlaceI, action: "favorite" | "wishlist") => {
      if (!shop.id || !shop.displayName.text) {
        console.error("toggleCafe:Invalid placeId or name:", {
          placeId: shop.id,
          name: shop.displayName.text,
        });
        return;
      }

      const isCurrentlyFavorite = isFavorite(shop.id);
      const isCurrentlyWishlist = isWishlist(shop.id);

      if (action === "favorite") {
        if (isCurrentlyFavorite) {
          console.log(
            "removeFavorite: already a favorite, removing it",
            shop.id
          );
          handleRemoveFavorite(shop.id);
        } else {
          console.log("saveFavorite: not a favorite, add it as favorite");
          handleSaveFavorite(shop);
        }
      } else if (action === "wishlist") {
        if (isCurrentlyWishlist) {
          console.log(
            "removeWishlist: already in wishlist, remove it",
            shop.id
          );
          handleRemoveFavorite(shop.id);
        } else {
          console.log("addToWishlist:not in wishlist, add it to wishlist");
          handleAddToWishlist(shop);
        }
      }
    },
    [
      isFavorite,
      isWishlist,
      handleRemoveFavorite,
      handleSaveFavorite,
      handleAddToWishlist,
    ]
  );

  const hideCafe = useCallback(
    (shop: PlaceI) => {
      if (!shop.id || !shop.displayName.text) {
        console.error("hideCafe:Invalid placeId or name:", {
          placeId: shop.id,
          name: shop.displayName.text,
        });
        return;
      }
      console.log("Hide cafe", {
        placeId: shop.id,
        name: shop.displayName.text,
      });
      handleHideCafe(shop);
    },
    [handleHideCafe]
  );

  return (
    <>
      {data.map((shop) => {
        const shopId = shop.id;

        // Skip rendering if place_id is null or undefined
        if (!shopId) {
          console.warn("Shop missing place_id:", shop);
          return null;
        }

        let zIndex = shop.zIndex;

        if (hoverId === shopId) {
          zIndex = Z_INDEX_HOVER;
        } else if (selectedId === shopId) {
          zIndex = Z_INDEX_SELECTED;
        }

        const position = {
          lat: shop.location.latitude,
          lng: shop.location.longitude,
        };

        const isShopFavorite = isFavorite(shopId);
        const isOnWishlist = isWishlist(shopId);
        const isActionDisabled = isSaving || isRemoving;

        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          shop.location.latitude,
          shop.location.longitude
        );

        const getPinColors = () => {
          if (isShopFavorite) {
            return {
              background: "#fcbf49",
              borderColor: "#fcbf49",
              glyphColor: "#e5a72c",
            };
          }

          if (isOnWishlist) {
            return {
              background: "#0f9d58",
              borderColor: "#0f9d58",
              glyphColor: "#0d8249",
            };
          }

          return {
            background: "#EA4335",
            borderColor: "#C5221F",
            glyphColor: "#C5221F",
          };
        };

        return (
          <div key={shopId}>
            <AdvancedMarker
              ref={(marker) => {
                if (shopId === selectedId && marker) {
                  setSelectedMarker(marker);
                }
              }}
              onClick={() => onMarkerClick(shopId)}
              onMouseEnter={() => onMouseEnter(shopId)}
              onMouseLeave={onMouseLeave}
              zIndex={zIndex}
              style={{
                transform: `scale(${[hoverId, selectedId].includes(shopId) ? 1.3 : 1})`,
                transformOrigin: AdvancedMarkerAnchorPoint.BOTTOM.join(" "),
              }}
              position={position}
            >
              <Pin {...getPinColors()} />
            </AdvancedMarker>

            {selectedId === shopId && infoWindowShown && (
              <InfoWindow
                anchor={selectedMarker}
                pixelOffset={[0, -2]}
                onCloseClick={closePopover}
                style={{ padding: 0 }}
                headerContent={shop.displayName.text}
              >
                <div className="font-bold text-sm">
                  {shop.shortFormattedAddress && (
                    <a
                      href={shop.googleMapsUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 underline"
                    >
                      {shop.shortFormattedAddress}
                    </a>
                  )}
                  <Flexbox
                    direction="row"
                    align="center"
                    justify="space-between"
                    margin="4px 0"
                  >
                    {shop.rating && (
                      <div className="text-xs text-gray-800">
                        ⭐ {shop.rating} ({shop.userRatingCount} reviews)
                      </div>
                    )}
                    <div className="text-xs text-gray-600">
                      {distance < 1
                        ? `${Math.round(distance * 1000)}m`
                        : `${distance.toFixed(1)}km`}{" "}
                      away
                    </div>
                  </Flexbox>

                  {shop.currentOpeningHours && (
                    <div
                      className={`text-xs font-bold rounded px-2 py-1 mt-1 inline-block ${
                        shop.currentOpeningHours.openNow
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {shop.currentOpeningHours.openNow ? "Open now" : "Closed"}
                    </div>
                  )}

                  <Flexbox direction="row" margin="mt-4" justify="flex-end">
                    <Button
                      icon={
                        <Heart
                          fill={isShopFavorite ? "red" : "none"}
                          size={16}
                        />
                      }
                      onClick={() => toggleCafe(shop, "favorite")}
                      disabled={isActionDisabled}
                      loading={isActionDisabled}
                      variant="custom"
                      custom={heartStyles}
                    />
                    <Button
                      icon={
                        <Flag
                          fill={isOnWishlist ? "green" : "none"}
                          size={16}
                        />
                      }
                      onClick={() => toggleCafe(shop, "wishlist")}
                      disabled={isActionDisabled}
                      loading={isActionDisabled}
                      variant="custom"
                      custom={flagStyles}
                    />
                    <Button
                      icon={<EyeOff size={16} />}
                      onClick={() => hideCafe(shop)}
                      disabled={isActionDisabled}
                      variant="custom"
                      custom={hideStyles}
                    />
                  </Flexbox>
                </div>
              </InfoWindow>
            )}
          </div>
        );
      })}
    </>
  );
};
