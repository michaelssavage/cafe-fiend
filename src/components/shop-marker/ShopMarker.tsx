import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { useCallback, useState } from "react";
import { StringOrNull } from "~/utils/global.type";
import type { PlaceResult } from "../../utils/place.type";
import {
  ShopName,
  ShopRating,
  ShopStatus,
  ShopVicinity,
  TitleContent,
} from "./ShopMarker.styles";

interface ShopMarkersProps {
  shops: PlaceResult[];
}

export const ShopMarker = ({ shops }: ShopMarkersProps) => {
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

  return (
    <>
      {data.map((shop) => {
        const shopId = shop.place_id;
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
                transformOrigin: AdvancedMarkerAnchorPoint["BOTTOM"].join(" "),
              }}
              position={position}
            />

            {selectedId === shopId && infoWindowShown && (
              <InfoWindow
                anchor={selectedMarker}
                pixelOffset={[0, -2]}
                onCloseClick={handleInfowindowCloseClick}
              >
                <TitleContent>
                  <ShopName>{shop.name}</ShopName>
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
                </TitleContent>
              </InfoWindow>
            )}
          </>
        );
      })}
    </>
  );
};
