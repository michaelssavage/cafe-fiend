import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  InfoWindow,
  Pin,
} from "@vis.gl/react-google-maps";
import { useCallback, useState } from "react";
import { Flexbox } from "~/styles/global.styles";
import { StringOrNull } from "~/types/global.type";
import type { PlaceResult } from "../../types/place.type";
import { Button } from "../button/Button";
import {
  ShopRating,
  ShopStatus,
  ShopVicinity,
  TitleContent,
} from "./ShopMarker.styles";

interface ShopMarkersProps {
  shops: Array<PlaceResult>;
  onToggleFavorite: (placeId: string, name: string) => void;
  isFavorite: (placeId: string) => boolean;
  isSaving: boolean;
  isRemoving: boolean;
}

export const ShopMarker = ({
  shops,
  onToggleFavorite,
  isFavorite,
  isSaving,
  isRemoving,
}: ShopMarkersProps) => {
  const data = shops
    .sort((a, b) => b.geometry.location.lat - a.geometry.location.lat)
    .map((dataItem, index) => ({ ...dataItem, zIndex: index }));

  const Z_INDEX_SELECTED = data.length;
  const Z_INDEX_HOVER = data.length + 1;

  const [hoverId, setHoverId] = useState<StringOrNull>(null);
  const [selectedId, setSelectedId] = useState<StringOrNull>(null);

  const [selectedMarker, setSelectedMarker] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [infoWindowShown, setInfoWindowShown] = useState(false);

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

  const handleInfowindowCloseClick = useCallback(
    () => setInfoWindowShown(false),
    []
  );

  const handleToggleFavorite = useCallback(
    (placeId: string, name: string) => {
      if (!placeId || !name) {
        console.error("Invalid placeId or name:", { placeId, name });
        return;
      }
      onToggleFavorite(placeId, name);
    },
    [onToggleFavorite]
  );

  return (
    <>
      {data.map((shop) => {
        const shopId = shop.place_id;

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
          lat: shop.geometry.location.lat,
          lng: shop.geometry.location.lng,
        };

        const isShopFavorite = isFavorite(shopId);
        const isActionDisabled = isSaving || isRemoving;

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
                onCloseClick={handleInfowindowCloseClick}
                style={{ padding: 0 }}
                headerContent={shop.name}
              >
                <TitleContent>
                  <ShopVicinity>{shop.vicinity}</ShopVicinity>
                  {shop.rating && (
                    <ShopRating>
                      ⭐ {shop.rating} ({shop.user_ratings_total} reviews)
                    </ShopRating>
                  )}
                  {shop.opening_hours && (
                    <ShopStatus
                      className={
                        shop.opening_hours.open_now ? "open" : "closed"
                      }
                    >
                      {shop.opening_hours.open_now ? "Open now" : "Closed"}
                    </ShopStatus>
                  )}

                  <Flexbox
                    direction="row"
                    margin="6px 0 0"
                    gap="4px"
                    justify="flex-end"
                  >
                    <Button
                      text={
                        isShopFavorite
                          ? isActionDisabled
                            ? "Removing..."
                            : "Remove"
                          : isActionDisabled
                            ? "Saving..."
                            : "Save"
                      }
                      onClick={() => handleToggleFavorite(shopId, shop.name)}
                      disabled={isActionDisabled}
                      variant={isShopFavorite ? "secondary" : "primary"}
                    />
                    <Button text="Hide" />
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
