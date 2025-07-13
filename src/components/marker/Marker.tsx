import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  InfoWindow,
  Pin,
} from "@vis.gl/react-google-maps";
import { EyeOff, Flag, Heart } from "lucide-react";
import { useCallback, useState } from "react";
import { useFavorites } from "~/hooks/use-favorites.hook";
import { Flexbox } from "~/styles/global.styles";
import { LocationI, StringOrNull } from "~/types/global.type";
import { calculateDistance } from "~/utils/distance";
import type { PlaceI } from "../../types/place.type";
import { Button } from "../button/Button";
import { flagStyles, heartStyles, hideStyles } from "../button/Button.styled";
import {
  Anchor,
  ShopRating,
  ShopStatus,
  ShopVicinity,
  TitleContent,
} from "./Marker.styled";

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
    (placeId: string, name: string, action: "favorite" | "wishlist") => {
      if (!placeId || !name) {
        console.error("Invalid placeId or name:", { placeId, name });
        return;
      }

      const isCurrentlyFavorite = isFavorite(placeId);
      const isCurrentlyWishlist = isWishlist(placeId);

      if (action === "favorite") {
        if (isCurrentlyFavorite) {
          // If it's already a favorite, remove it
          console.log("Calling removeFavorite");
          handleRemoveFavorite(placeId);
        } else {
          // If it's not a favorite, add it as favorite
          console.log("Calling saveFavorite");
          handleSaveFavorite(placeId, name);
        }
      } else if (action === "wishlist") {
        if (isCurrentlyWishlist) {
          // If it's already in wishlist, remove it
          console.log("Calling removeWishlist");
          handleRemoveFavorite(placeId);
        } else {
          // If it's not in wishlist, add it to wishlist
          console.log("Calling handleAddToWishlist");
          handleAddToWishlist(placeId, name);
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
    (placeId: string, name: string) => {
      if (!placeId || !name) {
        console.error("Invalid placeId or name:", { placeId, name });
        return;
      }
      console.log("Hide cafe", { placeId, name });
      handleHideCafe(placeId, name);
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
                <TitleContent>
                  {shop.shortFormattedAddress && (
                    <Anchor
                      href={shop.googleMapsUri}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {shop.shortFormattedAddress}
                    </Anchor>
                  )}
                  <Flexbox
                    direction="row"
                    gap="4px"
                    align="center"
                    justify="space-between"
                    margin="4px 0"
                  >
                    {shop.rating && (
                      <ShopRating>
                        ⭐ {shop.rating} ({shop.userRatingCount} reviews)
                      </ShopRating>
                    )}
                    <ShopVicinity>
                      {
                        distance < 1
                          ? `${Math.round(distance * 1000)}m` // Show meters if under 1km
                          : `${distance.toFixed(1)}km` // Show 1 decimal for km
                      }{" "}
                      away
                    </ShopVicinity>
                  </Flexbox>

                  {shop.currentOpeningHours && (
                    <ShopStatus $isOpen={shop.currentOpeningHours.openNow}>
                      {shop.currentOpeningHours.openNow ? "Open now" : "Closed"}
                    </ShopStatus>
                  )}

                  <Flexbox
                    direction="row"
                    margin="6px 0 0"
                    gap="4px"
                    justify="flex-end"
                  >
                    <Button
                      icon={
                        <Heart
                          fill={isShopFavorite ? "red" : "none"}
                          size={16}
                        />
                      }
                      onClick={() =>
                        toggleCafe(shopId, shop.displayName.text, "favorite")
                      }
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
                      onClick={() =>
                        toggleCafe(shopId, shop.displayName.text, "wishlist")
                      }
                      disabled={isActionDisabled}
                      loading={isActionDisabled}
                      variant="custom"
                      custom={flagStyles}
                    />
                    <Button
                      icon={<EyeOff size={16} />}
                      onClick={() => hideCafe(shopId, shop.displayName.text)}
                      disabled={isActionDisabled}
                      variant="custom"
                      custom={hideStyles}
                    />
                  </Flexbox>
                </TitleContent>
              </InfoWindow>
            )}
          </div>
        );
      })}
    </>
  );
};
