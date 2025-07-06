import { X as CloseIcon } from "@untitled-ui/icons-react";
import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { useCallback, useState, type MouseEvent } from "react";
import type { PlaceResult } from "../../utils/place.type";
import {
  CloseButton,
  CustomPin,
  ShopMarkerContainer,
  ShopName,
  ShopRating,
  ShopStatus,
  ShopVicinity,
  Tip,
  TitleContent,
  TitlePopup,
} from "./ShopMarker.styled";

interface ShopMarkerP {
  shop: PlaceResult;
  index: number;
}

export const ShopMarker = ({ shop, index }: ShopMarkerP) => {
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  const closePin = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setClicked(false);
  }, []);

  const position = {
    lat: shop.geometry.location.lat,
    lng: shop.geometry.location.lng,
  };

  const renderCustomPin = () => {
    return (
      <>
        <CustomPin>
          {clicked && (
            <TitlePopup>
              <CloseButton onClick={closePin}>
                <CloseIcon />
              </CloseButton>
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
                    className={shop.opening_hours.open_now ? "open" : "closed"}
                  >
                    {shop.opening_hours.open_now ? "Open now" : "Closed"}
                  </ShopStatus>
                )}
              </TitleContent>
            </TitlePopup>
          )}
        </CustomPin>
        <Tip />
      </>
    );
  };

  return (
    <AdvancedMarker
      key={index}
      position={position}
      title={shop.name}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setClicked(!clicked)}
    >
      <ShopMarkerContainer
        className={`${clicked ? "clicked" : ""} ${hovered ? "hovered" : ""}`}
      >
        <Pin />
        {renderCustomPin()}
      </ShopMarkerContainer>
    </AdvancedMarker>
  );
};
