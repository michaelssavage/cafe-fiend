import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  InfoWindow,
  Pin,
} from "@vis.gl/react-google-maps";
import { EyeOff, Heart } from "lucide-react";
import { useCallback, useState } from "react";
import { useFavorites } from "~/hooks/use-favorites.hook";
import { Flexbox } from "~/styles/global.styles";
import { LocationI, StringOrNull } from "~/types/global.type";
import { calculateDistance } from "~/utils/distance";
import type { PlaceI } from "../../types/place.type";
import { Button } from "../button/Button";
import { heartStyles } from "../button/Button.styled";
import {
  ShopRating,
  ShopStatus,
  ShopVicinity,
  TitleContent,
} from "./ShopMarker.styles";

interface ShopMarkersProps {
  userLocation: LocationI;
  shops: Array<PlaceI>;
}

export const ShopMarker = ({ userLocation, shops }: ShopMarkersProps) => {
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
    handleSaveFavorite,
    handleRemoveFavorite,
    handleHideCafe,
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
      else {
        setInfoWindowShown((isShown) => !isShown);
      }
    },
    [selectedId]
  );

  const toggleFavorite = useCallback(
    (placeId: string, name: string) => {
      if (!placeId || !name) {
        console.error("Invalid placeId or name:", { placeId, name });
        return;
      }
      console.log("Toggle favorite", {
        placeId,
        name,
        isFavorite: isFavorite(placeId),
      });
      if (isFavorite(placeId)) {
        console.log("Calling removeFavorite");
        handleRemoveFavorite(placeId);
      } else {
        console.log("Calling saveFavorite");
        handleSaveFavorite(placeId, name);
      }
    },
    [isFavorite, handleRemoveFavorite, handleSaveFavorite]
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
        const isActionDisabled = isSaving || isRemoving;

        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          shop.location.latitude,
          shop.location.longitude
        );

        return (
          <>
            <AdvancedMarker
              key={shopId}
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
              <Pin
                background={isShopFavorite ? "#0f9d58" : "#EA4335"}
                borderColor={isShopFavorite ? "#0f9d58" : "#C5221F"}
                glyphColor={isShopFavorite ? "#0d8249" : "#C5221F"}
              />
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
                  <ShopVicinity>
                    {
                      distance < 1
                        ? `${Math.round(distance * 1000)}m` // Show meters if under 1km
                        : `${distance.toFixed(1)}km` // Show 1 decimal for km
                    }
                  </ShopVicinity>
                  {shop.rating && (
                    <ShopRating>
                      ⭐ {shop.rating} ({shop.userRatingCount} reviews)
                    </ShopRating>
                  )}
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
                        toggleFavorite(shopId, shop.displayName.text)
                      }
                      disabled={isActionDisabled}
                      loading={isActionDisabled}
                      variant="custom"
                      custom={heartStyles}
                    />
                    <Button
                      icon={<EyeOff size={16} />}
                      onClick={() => hideCafe(shopId, shop.displayName.text)}
                      disabled={isActionDisabled}
                      variant="secondary"
                    />
                  </Flexbox>
                </TitleContent>
              </InfoWindow>
            )}
          </>
        );
      })}
    </>
  );
};
