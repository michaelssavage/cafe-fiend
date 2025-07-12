import { createFileRoute } from "@tanstack/react-router";
import {
  AdvancedMarker,
  Map as GoogleMap,
  Pin,
} from "@vis.gl/react-google-maps";
import { House } from "lucide-react";
import { useEffect, useState } from "react";
import AutoComplete from "~/components/auto-complete/AutoComplete";
import { ShopMarker } from "~/components/shop-marker/ShopMarker";
import { useCoffeeShops } from "~/hooks/use-coffee.hook";
import { useFavorites } from "~/hooks/use-favorites.hook";
import { useGeolocation } from "~/hooks/use-location.hook";
import { Container, Flexbox } from "~/styles/global.styles";
import { FiltersI } from "~/types/global.type";

export const Route = createFileRoute("/_authed/")({
  component: Home,
});

function Home() {
  const [filters, setFilters] = useState<FiltersI>({
    rating: 4.0,
    radius: 2000,
    reviews: 20,
  });

  const { location, setLocation, getCurrentLocation } = useGeolocation();

  const { isFavorite, saveFavorite, removeFavorite, isSaving, isRemoving } =
    useFavorites();

  const handleToggleFavorite = (placeId: string, name: string) => {
    console.log(
      "Toggle favorite - placeId:",
      placeId,
      "name:",
      name,
      "isFavorite:",
      isFavorite(placeId)
    );
    if (isFavorite(placeId)) {
      console.log("Calling removeFavorite");
      removeFavorite(placeId);
    } else {
      console.log("Calling saveFavorite");
      saveFavorite(placeId, name);
    }
  };

  const { data, isLoading } = useCoffeeShops({
    lat: location.lat,
    long: location.lng,
    filters,
  });

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  return (
    <Container>
      <h1>Cafe Fiend</h1>
      <Flexbox direction="row" align="center" gap="1rem">
        <p>Find your next favourite coffee</p>
      </Flexbox>
      <div style={{ height: "80vh" }}>
        <GoogleMap
          mapId="google-maps-id"
          defaultCenter={location}
          defaultZoom={13}
          gestureHandling="greedy"
          disableDefaultUI
        >
          <AutoComplete onPlaceSelect={setLocation} isLoading={isLoading} />

          <AdvancedMarker position={location}>
            <Pin
              background={"#2922ff"}
              borderColor={"#2b1ea1"}
              glyphColor={"#0f237a"}
            >
              <House size={14} color="#ffffff" />
            </Pin>
          </AdvancedMarker>

          {data && data?.results?.length > 0 ? (
            <ShopMarker
              userLocation={location}
              shops={data?.results}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={isFavorite}
              isSaving={isSaving}
              isRemoving={isRemoving}
            />
          ) : (
            <></>
          )}
        </GoogleMap>
      </div>
    </Container>
  );
}
